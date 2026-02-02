-- Create enum for family roles
CREATE TYPE public.family_role AS ENUM ('master', 'cohost', 'member');

-- Create enum for memory visibility
CREATE TYPE public.visibility_type AS ENUM ('private', 'family', 'members_only', 'public_link');

-- Create families table
CREATE TABLE public.families (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    public_page_enabled BOOLEAN NOT NULL DEFAULT false,
    public_page_slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family_members table for membership and roles
CREATE TABLE public.family_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role family_role NOT NULL DEFAULT 'member',
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(family_id, user_id)
);

-- Create shared_memories table
CREATE TABLE public.shared_memories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT,
    media_type TEXT,
    visibility visibility_type NOT NULL DEFAULT 'family',
    public_link_token TEXT UNIQUE,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for public page
CREATE TABLE public.memory_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    memory_id UUID NOT NULL REFERENCES public.shared_memories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_comments ENABLE ROW LEVEL SECURITY;

-- Security definer function to check family role
CREATE OR REPLACE FUNCTION public.get_family_role(_user_id UUID, _family_id UUID)
RETURNS family_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.family_members
    WHERE user_id = _user_id AND family_id = _family_id
$$;

-- Security definer function to check if user is master or cohost
CREATE OR REPLACE FUNCTION public.is_family_admin(_user_id UUID, _family_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.family_members
        WHERE user_id = _user_id 
        AND family_id = _family_id 
        AND role IN ('master', 'cohost')
    )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for families
CREATE POLICY "Family members can view their family"
ON public.families FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.family_members
        WHERE family_id = families.id AND user_id = auth.uid()
    )
    OR (public_page_enabled = true)
);

CREATE POLICY "Family admins can update family"
ON public.families FOR UPDATE
USING (public.is_family_admin(auth.uid(), id));

CREATE POLICY "Authenticated users can create families"
ON public.families FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for family_members
CREATE POLICY "Family members can view other members"
ON public.family_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.family_members fm
        WHERE fm.family_id = family_members.family_id AND fm.user_id = auth.uid()
    )
);

CREATE POLICY "Family admins can manage members"
ON public.family_members FOR INSERT
WITH CHECK (
    public.is_family_admin(auth.uid(), family_id)
    OR NOT EXISTS (SELECT 1 FROM public.family_members WHERE family_id = family_members.family_id)
);

CREATE POLICY "Family admins can update members"
ON public.family_members FOR UPDATE
USING (public.is_family_admin(auth.uid(), family_id));

CREATE POLICY "Family admins can remove members"
ON public.family_members FOR DELETE
USING (
    public.is_family_admin(auth.uid(), family_id) 
    AND user_id != auth.uid()
);

-- RLS Policies for shared_memories
CREATE POLICY "Family members can view family memories"
ON public.shared_memories FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.family_members
        WHERE family_id = shared_memories.family_id AND user_id = auth.uid()
    )
    OR (visibility = 'public_link' AND public_link_token IS NOT NULL)
);

CREATE POLICY "Family members can create memories"
ON public.shared_memories FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.family_members
        WHERE family_id = shared_memories.family_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Family admins can update memories"
ON public.shared_memories FOR UPDATE
USING (
    public.is_family_admin(auth.uid(), family_id)
    OR created_by = auth.uid()
);

CREATE POLICY "Family admins can delete memories"
ON public.shared_memories FOR DELETE
USING (public.is_family_admin(auth.uid(), family_id));

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments on public memories"
ON public.memory_comments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.shared_memories sm
        WHERE sm.id = memory_comments.memory_id
        AND (
            sm.visibility = 'public_link'
            OR EXISTS (
                SELECT 1 FROM public.family_members fm
                WHERE fm.family_id = sm.family_id AND fm.user_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Authenticated users can comment"
ON public.memory_comments FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_families_updated_at
BEFORE UPDATE ON public.families
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_shared_memories_updated_at
BEFORE UPDATE ON public.shared_memories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_family_members_family_id ON public.family_members(family_id);
CREATE INDEX idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX idx_shared_memories_family_id ON public.shared_memories(family_id);
CREATE INDEX idx_shared_memories_visibility ON public.shared_memories(visibility);
CREATE INDEX idx_families_public_slug ON public.families(public_page_slug) WHERE public_page_slug IS NOT NULL;