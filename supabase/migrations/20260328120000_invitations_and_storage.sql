-- Create family invitations table
CREATE TABLE IF NOT EXISTS public.family_invitations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() + interval '7 days',
    used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.family_invitations ENABLE ROW LEVEL SECURITY;

-- Family admins can create invitations
CREATE POLICY "Family admins can create invitations"
ON public.family_invitations FOR INSERT
WITH CHECK (public.is_family_admin(auth.uid(), family_id));

-- Family admins can view their family invitations
CREATE POLICY "Family admins can view invitations"
ON public.family_invitations FOR SELECT
USING (
    public.is_family_admin(auth.uid(), family_id)
    OR auth.uid() IS NOT NULL
);

-- Authenticated users can mark an invitation as used
CREATE POLICY "Authenticated users can use invitations"
ON public.family_invitations FOR UPDATE
USING (auth.uid() IS NOT NULL AND used_by IS NULL AND expires_at > now());

CREATE INDEX idx_family_invitations_token ON public.family_invitations(token);
CREATE INDEX idx_family_invitations_family_id ON public.family_invitations(family_id);

-- Storage bucket for family memories (created via Supabase dashboard or this migration)
INSERT INTO storage.buckets (id, name, public)
VALUES ('memories', 'memories', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Authenticated users can upload memories"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memories' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view memories"
ON storage.objects FOR SELECT
USING (bucket_id = 'memories' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own memories"
ON storage.objects FOR DELETE
USING (bucket_id = 'memories' AND owner::uuid = auth.uid());
