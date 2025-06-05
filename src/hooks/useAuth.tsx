
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔧 Inicializando AuthProvider...');
    
    // Verificar se estamos em modo de desenvolvimento/teste
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    
    if (isDevelopment) {
      console.log('🔧 Modo de desenvolvimento detectado - autenticação simplificada');
      // Em desenvolvimento, criar um usuário mock
      const mockUser = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        user_metadata: { name: 'Usuário Desenvolvimento' }
      } as User;
      
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      setLoading(false);
      return;
    }

    // Configurar listener de mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Log de atividade para eventos de autenticação
          if (session?.user && event === 'SIGNED_IN') {
            await logActivity('user_login', 'auth', {
              provider: 'google',
              timestamp: new Date().toISOString()
            });
          }

          if (event === 'SIGNED_OUT') {
            await logActivity('user_logout', 'auth', {
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('❌ Erro ao processar mudança de estado de auth:', error);
        } finally {
          setLoading(false);
        }
      }
    );

    // Verificar sessão existente
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('❌ Erro na inicialização da auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('❌ Google sign-in error:', error);
        toast({
          title: "Erro na autenticação",
          description: "Não foi possível fazer login com Google. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      toast({
        title: "Erro na autenticação",
        description: "Erro inesperado durante o login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Log logout antes de sair
      if (user) {
        await logActivity('user_logout_attempt', 'auth', {
          timestamp: new Date().toISOString()
        });
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign-out error:', error);
        toast({
          title: "Erro ao sair",
          description: "Não foi possível fazer logout. Tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      toast({
        title: "Erro ao sair",
        description: "Erro inesperado durante o logout.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (action: string, resource?: string, details?: any) => {
    // Em desenvolvimento, apenas logar no console
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    
    if (isDevelopment) {
      console.log('📝 Activity logged:', { action, resource, details });
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_action: action,
        p_resource: resource || null,
        p_details: details ? JSON.stringify(details) : null,
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });

      if (error) {
        console.error('❌ Error logging activity:', error);
      }
    } catch (error) {
      console.error('❌ Activity logging error:', error);
    }
  };

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
