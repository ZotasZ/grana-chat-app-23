
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

    return () => subscription.unsubscribe();
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
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
