
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Importações condicionais do Capacitor
let App: any = null;
let Browser: any = null;
let Capacitor: any = null;

try {
  const capacitorCore = await import('@capacitor/core');
  Capacitor = capacitorCore.Capacitor;
  
  if (Capacitor.isNativePlatform()) {
    const capacitorApp = await import('@capacitor/app');
    const capacitorBrowser = await import('@capacitor/browser');
    App = capacitorApp.App;
    Browser = capacitorBrowser.Browser;
  }
} catch (error) {
  console.log('Capacitor não disponível, executando no modo web');
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  logActivity: (action: string, resource?: string, details?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo, ${session.user.user_metadata?.full_name || session.user.email}!`,
          });
        }
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado",
            description: "Você foi desconectado com segurança.",
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Handle deep links for mobile OAuth
    if (Capacitor && Capacitor.isNativePlatform() && App) {
      App.addListener('appUrlOpen', async (data: any) => {
        console.log('App opened with URL:', data.url);
        
        // Handle Supabase auth callback
        if (data.url.includes('#access_token') || data.url.includes('?access_token')) {
          try {
            // For mobile, we just log the URL - the auth state change will handle the session
            console.log('OAuth callback received:', data.url);
            toast({
              title: "Processando login",
              description: "Finalizando autenticação...",
            });
          } catch (error) {
            console.error('Error handling auth URL:', error);
            toast({
              title: "Erro no login",
              description: "Erro ao processar autenticação.",
              variant: "destructive",
            });
          }
        }
      });
    }

    return () => {
      subscription.unsubscribe();
      if (Capacitor && Capacitor.isNativePlatform() && App) {
        App.removeAllListeners();
      }
    };
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      
      // Para mobile, usamos o Browser para abrir o OAuth
      if (Capacitor && Capacitor.isNativePlatform() && Browser) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'com.fincontrol.app://callback'
          }
        });

        if (error) {
          console.error('Error starting OAuth flow:', error);
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data.url) {
          await Browser.open({
            url: data.url,
            windowName: '_self'
          });
        }
      } else {
        // Para web, usa o fluxo normal
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          console.error('Error signing in with Google:', error);
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login com Google.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Erro no logout",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao tentar fazer logout.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const logActivity = useCallback(async (action: string, resource?: string, details?: any) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('audit_logs').insert({
        user_id: user.id,
        action,
        resource,
        details,
        ip_address: null,
        user_agent: navigator.userAgent
      });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user]);

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    logActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
