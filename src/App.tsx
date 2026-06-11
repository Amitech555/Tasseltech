import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import FamilyPublicPage from './pages/FamilyPublicPage';
import JoinFamily from './pages/JoinFamily';
import Revelation from './pages/Revelation';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// "/" on Vercel/Lovable, "/<repo>" on GitHub Pages (from Vite's base).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/famille/:slug" element={<FamilyPublicPage />} />
            <Route path="/rejoindre/:token" element={<JoinFamily />} />
            <Route path="/revelation" element={<Revelation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
