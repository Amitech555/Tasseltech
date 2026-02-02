import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFamily } from '@/hooks/useFamily';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, Users, Crown, Shield, UserPlus, Settings, LogOut, 
  Loader2, Globe, Link2, Copy, ExternalLink, Image
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { family, members, userRole, loading: familyLoading, isAdmin, createFamily, updateMemberRole, removeMember, togglePublicPage } = useFamily();
  const { toast } = useToast();

  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [familyDescription, setFamilyDescription] = useState('');
  const [publicSlug, setPublicSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleCreateFamily = async () => {
    if (!familyName.trim()) return;
    
    setIsCreating(true);
    const { error } = await createFamily(familyName, familyDescription);
    setIsCreating(false);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Famille créée !", description: "Vous êtes maintenant le Maître de cette famille" });
      setShowCreateFamily(false);
    }
  };

  const handleTogglePublic = async (enabled: boolean) => {
    const slug = enabled ? publicSlug || family?.name.toLowerCase().replace(/\s+/g, '-') : undefined;
    const { error } = await togglePublicPage(enabled, slug);
    
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: enabled ? "Page publique activée" : "Page publique désactivée",
        description: enabled ? "Votre page familiale est maintenant accessible" : "Votre page n'est plus visible publiquement"
      });
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'cohost' | 'member') => {
    const { error } = await updateMemberRole(memberId, newRole);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rôle mis à jour" });
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    const { error } = await removeMember(memberId);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Membre retiré", description: `${memberName} a été retiré de la famille` });
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/famille/${family?.public_page_slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Lien copié !" });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'master':
        return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30"><Crown className="w-3 h-3 mr-1" /> Maître</Badge>;
      case 'cohost':
        return <Badge className="bg-primary/20 text-primary border-primary/30"><Shield className="w-3 h-3 mr-1" /> Co-hôte</Badge>;
      default:
        return <Badge variant="secondary"><Users className="w-3 h-3 mr-1" /> Membre</Badge>;
    }
  };

  if (authLoading || familyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold">Tasseltech</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {!family ? (
          // No family - Create one
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Bienvenue sur Tasseltech !</h1>
              <p className="text-muted-foreground">
                Créez votre espace familial pour commencer à partager vos souvenirs.
              </p>
            </div>

            {!showCreateFamily ? (
              <Button onClick={() => setShowCreateFamily(true)} size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Créer ma famille
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Créer votre famille</CardTitle>
                  <CardDescription>
                    Vous serez le Maître de cette famille et pourrez inviter des membres.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="family-name">Nom de la famille</Label>
                    <Input
                      id="family-name"
                      placeholder="Famille Dupont"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="family-desc">Description (optionnel)</Label>
                    <Textarea
                      id="family-desc"
                      placeholder="Notre histoire familiale..."
                      value={familyDescription}
                      onChange={(e) => setFamilyDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCreateFamily(false)} className="flex-1">
                      Annuler
                    </Button>
                    <Button onClick={handleCreateFamily} disabled={!familyName.trim() || isCreating} className="flex-1">
                      {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Créer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Has family - Show dashboard
          <div className="space-y-8">
            {/* Family Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{family.name}</h1>
                  {getRoleBadge(userRole || '')}
                </div>
                {family.description && (
                  <p className="text-muted-foreground mt-1">{family.description}</p>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <Button variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inviter
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Members Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Membres de la famille
                  </CardTitle>
                  <CardDescription>
                    {members.length} membre{members.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {member.profile?.full_name?.[0] || member.profile?.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.profile?.full_name || member.profile?.email}
                            </p>
                            <p className="text-sm text-muted-foreground">{member.profile?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(member.role)}
                          {isAdmin && member.role !== 'master' && member.user_id !== user?.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {member.role === 'member' && (
                                  <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'cohost')}>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Promouvoir Co-hôte
                                  </DropdownMenuItem>
                                )}
                                {member.role === 'cohost' && (
                                  <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                                    <Users className="w-4 h-4 mr-2" />
                                    Rétrograder Membre
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleRemoveMember(member.id, member.profile?.full_name || 'Ce membre')}
                                >
                                  Retirer de la famille
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Public Page Card */}
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Page publique
                    </CardTitle>
                    <CardDescription>
                      Partagez vos souvenirs sélectionnés avec le monde
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="public-toggle">Activer la page publique</Label>
                      <Switch
                        id="public-toggle"
                        checked={family.public_page_enabled}
                        onCheckedChange={handleTogglePublic}
                      />
                    </div>

                    {family.public_page_enabled && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="public-slug">Lien personnalisé</Label>
                          <div className="flex gap-2">
                            <Input
                              id="public-slug"
                              value={publicSlug || family.public_page_slug || ''}
                              onChange={(e) => setPublicSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                              placeholder="ma-famille"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {window.location.origin}/famille/{publicSlug || family.public_page_slug}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={copyPublicLink}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copier le lien
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/famille/${family.public_page_slug}`} target="_blank" rel="noopener">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Voir
                            </a>
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Memories Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Souvenirs partagés
                    </CardTitle>
                    <CardDescription>
                      Les souvenirs visibles par votre famille
                    </CardDescription>
                  </div>
                  <Button>
                    <Image className="w-4 h-4 mr-2" />
                    Ajouter un souvenir
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun souvenir partagé pour le moment</p>
                  <p className="text-sm">Commencez à ajouter des photos, vidéos et histoires</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
