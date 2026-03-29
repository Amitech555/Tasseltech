import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (user) {
      // Check for pending invite in sessionStorage
      const pendingToken = sessionStorage.getItem('pendingInviteToken');
      if (pendingToken) {
        sessionStorage.removeItem('pendingInviteToken');
        navigate(`/rejoindre/${pendingToken}`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);
    if (error) {
      let message = 'Une erreur est survenue';
      if (error.message.includes('Invalid login credentials')) message = 'Email ou mot de passe incorrect';
      else if (error.message.includes('Email not confirmed')) message = 'Veuillez confirmer votre email avant de vous connecter';
      toast({ title: 'Erreur de connexion', description: message, variant: 'destructive' });
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);
    if (error) {
      let message = 'Une erreur est survenue';
      if (error.message.includes('User already registered')) message = 'Cet email est déjà utilisé';
      toast({ title: "Erreur d'inscription", description: message, variant: 'destructive' });
    } else {
      toast({ title: 'Inscription réussie !', description: 'Vérifiez votre email pour confirmer votre compte' });
      setActiveTab('login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-bold">Tasseltech</span>
          </div>
          <p className="text-muted-foreground">Préservez vos souvenirs familiaux</p>
        </div>
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mb-2">
              <Shield className="w-3 h-3" />
              <span>Connexion sécurisée</span>
            </div>
            <CardTitle className="text-2xl">Bienvenue</CardTitle>
            <CardDescription>Connectez-vous ou créez un compte pour accéder à votre espace familial</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="votre@email.com" {...loginForm.register('email')} />
                    {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input id="login-password" type="password" placeholder="••••••••" {...loginForm.register('password')} />
                    {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Se connecter
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom complet</Label>
                    <Input id="signup-name" placeholder="Jean Dupont" {...signupForm.register('fullName')} />
                    {signupForm.formState.errors.fullName && <p className="text-sm text-destructive">{signupForm.formState.errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="votre@email.com" {...signupForm.register('email')} />
                    {signupForm.formState.errors.email && <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input id="signup-password" type="password" placeholder="••••••••" {...signupForm.register('password')} />
                    {signupForm.formState.errors.password && <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
                    <Input id="signup-confirm" type="password" placeholder="••••••••" {...signupForm.register('confirmPassword')} />
                    {signupForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Créer mon compte
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/" className="hover:text-primary transition-colors">← Retour à l’accueil</a>
        </p>
      </div>
    </div>
  );
}
