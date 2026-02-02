import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Calendar, MessageCircle, Share2, Loader2 } from 'lucide-react';

interface Family {
  id: string;
  name: string;
  description: string | null;
}

interface SharedMemory {
  id: string;
  title: string;
  description: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  likes_count: number;
}

export default function FamilyPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [family, setFamily] = useState<Family | null>(null);
  const [memories, setMemories] = useState<SharedMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchFamilyData();
  }, [slug]);

  const fetchFamilyData = async () => {
    if (!slug) return;

    try {
      // Fetch family by public slug
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('id, name, description')
        .eq('public_page_slug', slug)
        .eq('public_page_enabled', true)
        .maybeSingle();

      if (familyError) throw familyError;

      if (!familyData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setFamily(familyData);

      // Fetch public memories
      const { data: memoriesData, error: memoriesError } = await supabase
        .from('shared_memories')
        .select('*')
        .eq('family_id', familyData.id)
        .in('visibility', ['public_link'])
        .order('created_at', { ascending: false });

      if (memoriesError) throw memoriesError;
      setMemories(memoriesData || []);
    } catch (error) {
      console.error('Error fetching family data:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Page non trouvée</h1>
          <p className="text-muted-foreground mb-6">
            Cette page familiale n'existe pas ou n'est plus publique.
          </p>
          <Button asChild>
            <a href="/">Retour à l'accueil</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <a href="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold">Tasseltech</span>
          </a>
          <Button variant="outline" size="sm" onClick={shareLink}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Family Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{family?.name}</h1>
          {family?.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {family.description}
            </p>
          )}
        </div>

        {/* Memories Grid */}
        {memories.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun souvenir partagé publiquement pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <Card key={memory.id} className="overflow-hidden group hover:shadow-lg transition-all">
                {memory.media_url && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img 
                      src={memory.media_url} 
                      alt={memory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{memory.title}</h3>
                  {memory.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {memory.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {memory.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        0
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(memory.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>Propulsé par <a href="/" className="text-primary hover:underline">Tasseltech</a></p>
          <p className="mt-1">Préservez vos souvenirs familiaux en toute sécurité</p>
        </div>
      </footer>
    </div>
  );
}
