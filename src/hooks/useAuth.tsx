
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
    let App: any = null;
    let Browser: any = null;
    let Capacitor: any = null;

    const initializeCapacitor = async () => {
      try {
        const capacitorCore = await import('@capacitor/core');
        Capacitor = capacitorCore.Capacitor;
        
        if (Capacitor.isNativePlatform()) {
          const capacitorApp = await import('@capacitor/app');
          const capacitorBrowser = await import('@capacitor/browser');
          App = capacitorApp.App;
          Browser = capacitorBrowser.Browser;
          console.log('Capacitor módulos inicializados para plataforma nativa');
        }
      } catch (error) {
        console.log('Capacitor não disponível, executando no modo web');
      }
    };

    const setupAuth = async () => {
      await initializeCapacitor();

      // Configurar listener de mudança de estado de auth
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          if (event === 'SIGNED_IN' && session?.user) {
            console.log('Usuário logado com sucesso:', session.user.email);
            toast({
              title: "Login realizado com sucesso!",
              description: `Bem-vindo, ${session.user.user_metadata?.full_name || session.user.email}!`,
            });

            // Fechar browser se estiver em plataforma nativa
            if (Capacitor && Capacitor.isNativePlatform() && Browser) {
              try {
                console.log('Fechando browser após login bem-sucedido...');
                await Browser.close();
                console.log('Browser fechado após login');
              } catch (error) {
                console.log('Erro ao fechar browser:', error);
              }
            }
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('Usuário deslogado');
            toast({
              title: "Logout realizado",
              description: "Você foi desconectado com segurança.",
            });
          }
        }
      );

      // Verificar sessão existente
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao obter sessão:', error);
        } else {
          console.log('Sessão existente:', existingSession?.user?.email || 'Nenhuma');
          setSession(existingSession);
          setUser(existingSession?.user ?? null);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão existente:', error);
      } finally {
        setLoading(false);
      }

      // Configurar deep links para mobile OAuth - versão simplificada
      if (Capacitor && Capacitor.isNativePlatform() && App) {
        const handleAppUrlOpen = async (data: any) => {
          console.log('App aberto com URL:', data.url);
          
          if (data.url && data.url.includes('callback')) {
            console.log('OAuth callback detectado:', data.url);
            
            // Fechar o browser imediatamente
            if (Browser) {
              try {
                await Browser.close();
                console.log('Browser fechado após callback');
              } catch (error) {
                console.log('Erro ao fechar browser no callback:', error);
              }
            }
            
            // Pequeno delay para processar o callback
            setTimeout(async () => {
              try {
                const { data: callbackSession } = await supabase.auth.getSession();
                if (callbackSession?.session) {
                  console.log('Sessão obtida após callback:', callbackSession.session.user?.email);
                  setSession(callbackSession.session);
                  setUser(callbackSession.session.user);
                }
              } catch (error) {
                console.error('Erro ao processar callback:', error);
              }
            }, 500);
          }
        };

        App.addListener('appUrlOpen', handleAppUrlOpen);
        
        return () => {
          subscription.unsubscribe();
          App.removeAllListeners();
        };
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Iniciando login com Google...');
      
      let isNative = false;
      let Browser: any = null;
      
      try {
        const capacitorCore = await import('@capacitor/core');
        const Capacitor = capacitorCore.Capacitor;
        isNative = Capacitor.isNativePlatform();
        
        if (isNative) {
          const capacitorBrowser = await import('@capacitor/browser');
          Browser = capacitorBrowser.Browser;
          console.log('Plataforma nativa detectada');
        }
      } catch (error) {
        console.log('Capacitor não disponível, usando modo web');
      }
      
      if (isNative && Browser) {
        console.log('Iniciando OAuth simplificado para mobile...');
        
        // Configuração simplificada para mobile
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'com.fincontrol.app://callback',
            skipBrowserRedirect: false
          }
        });

        if (error) {
          console.error('Erro ao iniciar OAuth:', error);
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data.url) {
          console.log('Abrindo URL OAuth simplificada:', data.url);
          
          try {
            // Configuração mais simples do browser
            await Browser.open({
              url: data.url,
              windowName: '_self'
            });
            console.log('Browser OAuth aberto');
            
          } catch (browserError) {
            console.error('Erro ao abrir browser OAuth:', browserError);
            toast({
              title: "Erro no login",
              description: "Não foi possível abrir o navegador para autenticação",
              variant: "destructive",
            });
          }
        }
      } else {
        console.log('Iniciando OAuth para web...');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          console.error('Erro no OAuth web:', error);
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Erro geral no login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado ao tentar fazer login.",
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
