import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFamily } from '@/hooks/useFamily';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JoinFamily() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { family, joinByToken } = useFamily();
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      sessionStorage.setItem('pendingInviteToken', token || '');
      navigate('/auth');
    }
  }, [user, authLoading, token, navigate]);

  useEffect(() => {
    if (family && !joined) {
      navigate('/dashboard');
    }
  }, [family, joined, navigate]);

  const handleJoin = async () => {
    if (!token) return;
    setIsJoining(true);
    const { error } = await joinByToken(token);
    setIsJoining(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setJoined(true);
      toast({ title: 'Bienvenue dans la famille !' });
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Rejoindre une famille</CardTitle>
          <CardDescription>Vous avez été invité à rejoindre une famille sur Tasseltech.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {joined ? (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <p className="font-medium text-green-600">Vous avez rejoint la famille !</p>
              <p className="text-sm text-muted-foreground">Redirection vers le tableau de bord...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Cliquez sur le bouton ci-dessous pour accepter l’invitation.
              </p>
              <Button onClick={handleJoin} disabled={isJoining} size="lg" className="w-full">
                {isJoining ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                Rejoindre la famille
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
