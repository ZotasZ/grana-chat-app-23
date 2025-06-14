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
          
          // Para mobile, tratar casos específicos de auth
          if (event === 'TOKEN_REFRESHED') {
            console.log('Token renovado');
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

      // Configurar deep links para mobile OAuth
      if (Capacitor && Capacitor.isNativePlatform() && App) {
        const handleAppUrlOpen = async (data: any) => {
          console.log('App aberto com URL:', data.url);
          
          if (data.url.includes('#access_token') || data.url.includes('?access_token')) {
            try {
              console.log('OAuth callback detectado, processando...');
              
              // Extrair o hash/query da URL
              const url = new URL(data.url);
              const hashParams = new URLSearchParams(url.hash.substring(1));
              const queryParams = new URLSearchParams(url.search);
              
              const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
              const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
              
              if (accessToken) {
                console.log('Tokens encontrados, definindo sessão...');
                
                // Definir a sessão com os tokens
                const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken || ''
                });
                
                if (sessionError) {
                  console.error('Erro ao definir sessão:', sessionError);
                  toast({
                    title: "Erro no login",
                    description: "Erro ao processar autenticação.",
                    variant: "destructive",
                  });
                } else {
                  console.log('Sessão definida com sucesso:', sessionData.user?.email);
                }
              }
              
              // Fechar o browser
              if (Browser) {
                await Browser.close();
              }
              
            } catch (error) {
              console.error('Erro ao processar URL de auth:', error);
              toast({
                title: "Erro no login",
                description: "Erro ao processar autenticação.",
                variant: "destructive",
              });
            }
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
        console.log('Iniciando OAuth para mobile...');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'com.fincontrol.app://callback',
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });

        if (error) {
          console.error('Erro ao iniciar fluxo OAuth:', error);
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data.url) {
          console.log('Abrindo URL OAuth:', data.url);
          await Browser.open({
            url: data.url,
            windowName: '_self'
          });
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
          console.error('Erro ao fazer login com Google:', error);
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
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
