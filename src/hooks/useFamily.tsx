import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Family {
  id: string;
  name: string;
  description: string | null;
  public_page_enabled: boolean;
  public_page_slug: string | null;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: 'master' | 'cohost' | 'member';
  joined_at: string;
  profile?: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

export interface Memory {
  id: string;
  family_id: string;
  created_by: string;
  title: string;
  description: string | null;
  media_url: string | null;
  media_type: string | null;
  visibility: 'private' | 'family' | 'members_only' | 'public_link';
  likes_count: number;
  created_at: string;
}

export function useFamily() {
  const { user } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [userRole, setUserRole] = useState<'master' | 'cohost' | 'member' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFamilyData();
    } else {
      setFamily(null);
      setMembers([]);
      setMemories([]);
      setUserRole(null);
      setLoading(false);
    }
  }, [user]);

  const fetchFamilyData = async () => {
    if (!user) return;
    try {
      const { data: membershipData, error: membershipError } = await supabase
        .from('family_members')
        .select('*, families(*)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;

      if (membershipData) {
        setFamily(membershipData.families as unknown as Family);
        setUserRole(membershipData.role as 'master' | 'cohost' | 'member');

        const { data: membersData, error: membersError } = await supabase
          .from('family_members')
          .select(`*, profiles!family_members_user_id_fkey(full_name, email, avatar_url)`)
          .eq('family_id', membershipData.family_id);

        if (membersError) throw membersError;

        setMembers(membersData?.map(m => ({
          ...m,
          role: m.role as 'master' | 'cohost' | 'member',
          profile: m.profiles as unknown as FamilyMember['profile']
        })) || []);

        await fetchMemoriesForFamily(membershipData.family_id);
      }
    } catch (error) {
      console.error('Error fetching family data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemoriesForFamily = async (familyId: string) => {
    const { data, error } = await supabase
      .from('shared_memories')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMemories(data.map(m => ({
        ...m,
        visibility: m.visibility as Memory['visibility'],
      })));
    }
  };

  const createFamily = async (name: string, description?: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({ name, description })
        .select()
        .single();
      if (familyError) throw familyError;

      const { error: memberError } = await supabase
        .from('family_members')
        .insert({ family_id: familyData.id, user_id: user.id, role: 'master' });
      if (memberError) throw memberError;

      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateFamily = async (name: string, description: string) => {
    if (!family) return { error: new Error('No family') };
    try {
      const { error } = await supabase
        .from('families')
        .update({ name, description })
        .eq('id', family.id);
      if (error) throw error;
      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const deleteFamily = async () => {
    if (!family || userRole !== 'master') return { error: new Error('Not authorized') };
    try {
      const { error } = await supabase.from('families').delete().eq('id', family.id);
      if (error) throw error;
      setFamily(null);
      setMembers([]);
      setMemories([]);
      setUserRole(null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateMemberRole = async (memberId: string, newRole: 'cohost' | 'member') => {
    if (!userRole || !['master', 'cohost'].includes(userRole))
      return { error: new Error('Not authorized') };
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ role: newRole })
        .eq('id', memberId);
      if (error) throw error;
      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const removeMember = async (memberId: string) => {
    if (!userRole || !['master', 'cohost'].includes(userRole))
      return { error: new Error('Not authorized') };
    try {
      const { error } = await supabase.from('family_members').delete().eq('id', memberId);
      if (error) throw error;
      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const togglePublicPage = async (enabled: boolean, slug?: string) => {
    if (!family || !userRole || !['master', 'cohost'].includes(userRole))
      return { error: new Error('Not authorized') };
    try {
      const { error } = await supabase
        .from('families')
        .update({ public_page_enabled: enabled, public_page_slug: enabled ? slug : null })
        .eq('id', family.id);
      if (error) throw error;
      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const createInvitation = async () => {
    if (!family || !user) return { error: new Error('Not authorized'), token: null };
    try {
      const { data, error } = await supabase
        .from('family_invitations' as any)
        .insert({ family_id: family.id, created_by: user.id })
        .select('token')
        .single();
      if (error) throw error;
      return { error: null, token: (data as any).token as string };
    } catch (error) {
      return { error: error as Error, token: null };
    }
  };

  const joinByToken = async (token: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const { data: invitation, error: inviteError } = await supabase
        .from('family_invitations' as any)
        .select('*')
        .eq('token', token)
        .is('used_by', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !invitation) throw new Error('Invitation invalide ou expirée');

      const inv = invitation as any;

      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: inv.family_id,
          user_id: user.id,
          role: 'member',
          invited_by: inv.created_by,
        });
      if (memberError) throw memberError;

      await supabase
        .from('family_invitations' as any)
        .update({ used_by: user.id, used_at: new Date().toISOString() })
        .eq('id', inv.id);

      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const addMemory = async (file: File, title: string, description?: string) => {
    if (!family || !user) return { error: new Error('Not authenticated') };
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${family.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(fileName);

      const { error: memoryError } = await supabase
        .from('shared_memories')
        .insert({
          family_id: family.id,
          created_by: user.id,
          title,
          description: description || null,
          media_url: publicUrl,
          media_type: file.type,
          visibility: 'family',
        });
      if (memoryError) throw memoryError;

      await fetchMemoriesForFamily(family.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      const { error } = await supabase
        .from('shared_memories')
        .delete()
        .eq('id', memoryId);
      if (error) throw error;
      setMemories(prev => prev.filter(m => m.id !== memoryId));
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const isAdmin = userRole === 'master' || userRole === 'cohost';

  return {
    family, members, memories, userRole, loading, isAdmin,
    createFamily, updateFamily, deleteFamily,
    updateMemberRole, removeMember, togglePublicPage,
    createInvitation, joinByToken,
    addMemory, deleteMemory,
    refetch: fetchFamilyData,
  };
}
