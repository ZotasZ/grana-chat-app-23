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
          console.log('Capacitor inicializado para plataforma nativa');
        }
      } catch (error) {
        console.log('Capacitor não disponível, modo web');
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
            console.log('Login bem-sucedido:', session.user.email);
            toast({
              title: "Login realizado com sucesso!",
              description: `Bem-vindo, ${session.user.user_metadata?.full_name || session.user.email}!`,
            });

            // Fechar browser se mobile
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
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }

      // Deep links para mobile
      if (Capacitor && Capacitor.isNativePlatform() && App) {
        const handleAppUrlOpen = async (data: any) => {
          console.log('App URL aberto:', data.url);
          
          if (data.url && (data.url.includes('#access_token=') || data.url.includes('?access_token='))) {
            console.log('Token detectado na URL, processando...');
            
            // Fechar browser imediatamente
            if (Browser) {
              try {
                await Browser.close();
                console.log('Browser fechado após detectar token');
              } catch (error) {
                console.log('Erro ao fechar browser:', error);
              }
            }
            
            // Processar callback
            try {
              // Extrair fragmento da URL
              const url = new URL(data.url);
              const fragment = url.hash.substring(1);
              const params = new URLSearchParams(fragment);
              
              const accessToken = params.get('access_token');
              const refreshToken = params.get('refresh_token');
              
              if (accessToken) {
                console.log('Definindo sessão com tokens extraídos');
                const { data: sessionData, error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken || ''
                });
                
                if (error) {
                  console.error('Erro ao definir sessão:', error);
                } else {
                  console.log('Sessão definida com sucesso:', sessionData.user?.email);
                }
              }
            } catch (error) {
              console.error('Erro ao processar callback:', error);
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
        }
      } catch (error) {
        console.log('Capacitor não disponível');
      }
      
      if (isNative && Browser) {
        console.log('Login mobile - Nova abordagem');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'com.fincontrol.app://callback',
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account'
            }
          }
        });

        if (error) {
          console.error('Erro OAuth mobile:', error);
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data.url) {
          console.log('Abrindo URL OAuth:', data.url);
          
          try {
            // Configuração otimizada do browser para mobile
            await Browser.open({
              url: data.url,
              windowName: '_system',
              presentationStyle: 'fullscreen',
              toolbarColor: '#22c55e'
            });
            
            console.log('Browser OAuth aberto');
            
          } catch (browserError) {
            console.error('Erro ao abrir browser:', browserError);
            
            // Fallback: tentar abrir no navegador padrão
            try {
              window.open(data.url, '_system');
              console.log('Fallback: URL aberta no navegador padrão');
            } catch (fallbackError) {
              console.error('Erro no fallback:', fallbackError);
              toast({
                title: "Erro no login",
                description: "Não foi possível abrir o navegador",
                variant: "destructive",
              });
            }
          }
        }
      } else {
        console.log('Login web');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account'
            }
          }
        });

        if (error) {
          console.error('Erro OAuth web:', error);
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
        description: "Erro inesperado ao fazer login.",
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
