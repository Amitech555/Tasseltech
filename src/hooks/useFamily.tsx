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

export function useFamily() {
  const { user } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [userRole, setUserRole] = useState<'master' | 'cohost' | 'member' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFamilyData();
    } else {
      setFamily(null);
      setMembers([]);
      setUserRole(null);
      setLoading(false);
    }
  }, [user]);

  const fetchFamilyData = async () => {
    if (!user) return;
    
    try {
      // Get user's family membership
      const { data: membershipData, error: membershipError } = await supabase
        .from('family_members')
        .select('*, families(*)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;

      if (membershipData) {
        setFamily(membershipData.families as unknown as Family);
        setUserRole(membershipData.role as 'master' | 'cohost' | 'member');

        // Fetch all family members with profiles
        const { data: membersData, error: membersError } = await supabase
          .from('family_members')
          .select(`
            *,
            profiles!family_members_user_id_fkey(full_name, email, avatar_url)
          `)
          .eq('family_id', membershipData.family_id);

        if (membersError) throw membersError;
        
        setMembers(membersData?.map(m => ({
          ...m,
          role: m.role as 'master' | 'cohost' | 'member',
          profile: m.profiles as unknown as FamilyMember['profile']
        })) || []);
      }
    } catch (error) {
      console.error('Error fetching family data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFamily = async (name: string, description?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      // Create family
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({ name, description })
        .select()
        .single();

      if (familyError) throw familyError;

      // Add user as master
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: familyData.id,
          user_id: user.id,
          role: 'master'
        });

      if (memberError) throw memberError;

      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateMemberRole = async (memberId: string, newRole: 'cohost' | 'member') => {
    if (!userRole || !['master', 'cohost'].includes(userRole)) {
      return { error: new Error('Not authorized') };
    }

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
    if (!userRole || !['master', 'cohost'].includes(userRole)) {
      return { error: new Error('Not authorized') };
    }

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      
      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const togglePublicPage = async (enabled: boolean, slug?: string) => {
    if (!family || !userRole || !['master', 'cohost'].includes(userRole)) {
      return { error: new Error('Not authorized') };
    }

    try {
      const { error } = await supabase
        .from('families')
        .update({ 
          public_page_enabled: enabled,
          public_page_slug: enabled ? slug : null
        })
        .eq('id', family.id);

      if (error) throw error;
      
      await fetchFamilyData();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const isAdmin = userRole === 'master' || userRole === 'cohost';

  return {
    family,
    members,
    userRole,
    loading,
    isAdmin,
    createFamily,
    updateMemberRole,
    removeMember,
    togglePublicPage,
    refetch: fetchFamilyData,
  };
}
