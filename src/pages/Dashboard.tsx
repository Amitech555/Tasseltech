import { useEffect, useState, useRef } from 'react';
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
  Loader2, Globe, Copy, ExternalLink, ImageIcon, Trash2, Upload, X, Check, Link2
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    family, members, memories, userRole, loading: familyLoading, isAdmin,
    createFamily, updateFamily, deleteFamily,
    updateMemberRole, removeMember, togglePublicPage,
    createInvitation, addMemory, deleteMemory,
  } = useFamily();
  const { toast } = useToast();

  // Create family
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [familyDescription, setFamilyDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Public page
  const [publicSlug, setPublicSlug] = useState('');

  // Invitation
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);

  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Memory upload
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryDescription, setMemoryDescription] = useState('');
  const [memoryFile, setMemoryFile] = useState<File | null>(null);
  const [memoryPreview, setMemoryPreview] = useState<string | null>(null);
  const [isUploadingMemory, setIsUploadingMemory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (family) {
      setEditName(family.name);
      setEditDescription(family.description || '');
    }
  }, [family]);

  const handleCreateFamily = async () => {
    if (!familyName.trim()) return;
    setIsCreating(true);
    const { error } = await createFamily(familyName, familyDescription);
    setIsCreating(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Famille créée !', description: 'Vous êtes maintenant le Maître de cette famille' });
      setShowCreateFamily(false);
    }
  };

  const handleTogglePublic = async (enabled: boolean) => {
    const slug = enabled ? publicSlug || family?.name.toLowerCase().replace(/\s+/g, '-') : undefined;
    const { error } = await togglePublicPage(enabled, slug);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: enabled ? 'Page publique activée' : 'Page publique désactivée' });
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'cohost' | 'member') => {
    const { error } = await updateMemberRole(memberId, newRole);
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    else toast({ title: 'Rôle mis à jour' });
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    const { error } = await removeMember(memberId);
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    else toast({ title: 'Membre retiré', description: `${memberName} a été retiré de la famille` });
  };

  const handleGenerateInvite = async () => {
    setIsGeneratingInvite(true);
    const { token, error } = await createInvitation();
    setIsGeneratingInvite(false);
    if (error || !token) {
      toast({ title: 'Erreur', description: error?.message, variant: 'destructive' });
    } else {
      setInviteLink(`${window.location.origin}/rejoindre/${token}`);
    }
  };

  const handleSaveSettings = async () => {
    if (!editName.trim()) return;
    setIsSavingSettings(true);
    const { error } = await updateFamily(editName, editDescription);
    setIsSavingSettings(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Paramètres sauvegardés' });
      setSettingsOpen(false);
    }
  };

  const handleDeleteFamily = async () => {
    const { error } = await deleteFamily();
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Famille supprimée' }); setSettingsOpen(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMemoryFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setMemoryPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadMemory = async () => {
    if (!memoryFile || !memoryTitle.trim()) return;
    setIsUploadingMemory(true);
    const { error } = await addMemory(memoryFile, memoryTitle, memoryDescription);
    setIsUploadingMemory(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Souvenir ajouté !' });
      setMemoryOpen(false);
      setMemoryTitle('');
      setMemoryDescription('');
      setMemoryFile(null);
      setMemoryPreview(null);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    const { error } = await deleteMemory(memoryId);
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    else toast({ title: 'Souvenir supprimé' });
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
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Bienvenue sur Tasseltech !</h1>
              <p className="text-muted-foreground">Créez votre espace familial pour commencer à partager vos souvenirs.</p>
            </div>
            {!showCreateFamily ? (
              <Button onClick={() => setShowCreateFamily(true)} size="lg">
                <Heart className="w-4 h-4 mr-2" /> Créer ma famille
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Créer votre famille</CardTitle>
                  <CardDescription>Vous serez le Maître de cette famille et pourrez inviter des membres.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="family-name">Nom de la famille</Label>
                    <Input id="family-name" placeholder="Famille Dupont" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="family-desc">Description (optionnel)</Label>
                    <Textarea id="family-desc" placeholder="Notre histoire familiale..." value={familyDescription} onChange={(e) => setFamilyDescription(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCreateFamily(false)} className="flex-1">Annuler</Button>
                    <Button onClick={handleCreateFamily} disabled={!familyName.trim() || isCreating} className="flex-1">
                      {isCreating && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Créer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Family Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{family.name}</h1>
                  {getRoleBadge(userRole || '')}
                </div>
                {family.description && <p className="text-muted-foreground mt-1">{family.description}</p>}
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  {/* Invite Dialog */}
                  <Dialog open={inviteOpen} onOpenChange={(open) => { setInviteOpen(open); if (!open) setInviteLink(''); }}>
                    <DialogTrigger asChild>
                      <Button variant="outline"><UserPlus className="w-4 h-4 mr-2" /> Inviter</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Inviter un membre</DialogTitle>
                        <DialogDescription>Générez un lien d’invitation valable 7 jours.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {!inviteLink ? (
                          <Button onClick={handleGenerateInvite} disabled={isGeneratingInvite} className="w-full">
                            {isGeneratingInvite ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
                            Générer un lien d’invitation
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground break-all">{inviteLink}</p>
                            </div>
                            <Button onClick={() => { navigator.clipboard.writeText(inviteLink); toast({ title: 'Lien copié !' }); }} className="w-full">
                              <Copy className="w-4 h-4 mr-2" /> Copier le lien
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">Ce lien expire dans 7 jours.</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Settings Dialog */}
                  <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon"><Settings className="w-4 h-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Paramètres de la famille</DialogTitle>
                        <DialogDescription>Modifiez les informations de votre famille.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nom de la famille</Label>
                          <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-desc">Description</Label>
                          <Textarea id="edit-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Notre histoire familiale..." />
                        </div>
                        <Button onClick={handleSaveSettings} disabled={!editName.trim() || isSavingSettings} className="w-full">
                          {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                          Sauvegarder
                        </Button>
                        {userRole === 'master' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" className="w-full"><Trash2 className="w-4 h-4 mr-2" /> Supprimer la famille</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer la famille ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Action irréversible. Tous les souvenirs et membres seront supprimés définitivement.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteFamily} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Supprimer définitivement
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Members Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Membres de la famille</CardTitle>
                  <CardDescription>{members.length} membre{members.length > 1 ? 's' : ''}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {member.profile?.full_name?.[0] || member.profile?.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{member.profile?.full_name || member.profile?.email}</p>
                            <p className="text-sm text-muted-foreground">{member.profile?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(member.role)}
                          {isAdmin && member.role !== 'master' && member.user_id !== user?.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {member.role === 'member' && (
                                  <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'cohost')}>
                                    <Shield className="w-4 h-4 mr-2" /> Promouvoir Co-hôte
                                  </DropdownMenuItem>
                                )}
                                {member.role === 'cohost' && (
                                  <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                                    <Users className="w-4 h-4 mr-2" /> Rétrograder Membre
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive" onClick={() => handleRemoveMember(member.id, member.profile?.full_name || 'Ce membre')}>
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
                    <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Page publique</CardTitle>
                    <CardDescription>Partagez vos souvenirs avec le monde</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="public-toggle">Activer la page publique</Label>
                      <Switch id="public-toggle" checked={family.public_page_enabled} onCheckedChange={handleTogglePublic} />
                    </div>
                    {family.public_page_enabled && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="public-slug">Lien personnalisé</Label>
                          <Input
                            id="public-slug"
                            value={publicSlug || family.public_page_slug || ''}
                            onChange={(e) => setPublicSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            placeholder="ma-famille"
                          />
                          <p className="text-xs text-muted-foreground">
                            {window.location.origin}/famille/{publicSlug || family.public_page_slug}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/famille/${family.public_page_slug}`); toast({ title: 'Lien copié !' }); }}>
                            <Copy className="w-4 h-4 mr-2" /> Copier
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/famille/${family.public_page_slug}`} target="_blank" rel="noopener">
                              <ExternalLink className="w-4 h-4 mr-2" /> Voir
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
                    <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Souvenirs partagés</CardTitle>
                    <CardDescription>{memories.length} souvenir{memories.length > 1 ? 's' : ''} partagé{memories.length > 1 ? 's' : ''}</CardDescription>
                  </div>
                  <Dialog open={memoryOpen} onOpenChange={(open) => {
                    setMemoryOpen(open);
                    if (!open) { setMemoryTitle(''); setMemoryDescription(''); setMemoryFile(null); setMemoryPreview(null); }
                  }}>
                    <DialogTrigger asChild>
                      <Button><Upload className="w-4 h-4 mr-2" /> Ajouter un souvenir</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter un souvenir</DialogTitle>
                        <DialogDescription>Partagez une photo avec votre famille.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div
                          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {memoryPreview ? (
                            <div className="relative">
                              <img src={memoryPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                              <Button variant="ghost" size="icon" className="absolute top-0 right-0"
                                onClick={(e) => { e.stopPropagation(); setMemoryFile(null); setMemoryPreview(null); }}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Cliquez pour sélectionner une image</p>
                              <p className="text-xs text-muted-foreground">JPG, PNG, GIF jusqu’à 10MB</p>
                            </>
                          )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                        <div className="space-y-2">
                          <Label htmlFor="memory-title">Titre *</Label>
                          <Input id="memory-title" placeholder="Noël 2025..." value={memoryTitle} onChange={(e) => setMemoryTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="memory-desc">Description (optionnel)</Label>
                          <Textarea id="memory-desc" placeholder="Un beau moment en famille..." value={memoryDescription} onChange={(e) => setMemoryDescription(e.target.value)} />
                        </div>
                        <Button onClick={handleUploadMemory} disabled={!memoryFile || !memoryTitle.trim() || isUploadingMemory} className="w-full">
                          {isUploadingMemory ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                          Partager le souvenir
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {memories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun souvenir partagé pour le moment</p>
                    <p className="text-sm">Commencez à ajouter des photos et histoires</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {memories.map((memory) => (
                      <div key={memory.id} className="group relative rounded-lg overflow-hidden bg-muted aspect-square">
                        {memory.media_url ? (
                          <img src={memory.media_url} alt={memory.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                          <p className="text-white text-sm font-medium truncate">{memory.title}</p>
                          {memory.description && <p className="text-white/70 text-xs truncate">{memory.description}</p>}
                          {(isAdmin || memory.created_by === user?.id) && (
                            <Button variant="destructive" size="sm" className="mt-2 w-full" onClick={() => handleDeleteMemory(memory.id)}>
                              <Trash2 className="w-3 h-3 mr-1" /> Supprimer
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
