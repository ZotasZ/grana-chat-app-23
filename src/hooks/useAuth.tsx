
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthEffects } from './useAuthEffects';
import { logActivity as logActivityUtil } from '@/lib/auth';

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

  useAuthEffects({ setSession, setUser, setLoading, toast });

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
            await Browser.open({
              url: data.url,
              windowName: '_system',
              presentationStyle: 'fullscreen',
              toolbarColor: '#22c55e'
            });
            
            console.log('Browser OAuth aberto');
            
          } catch (browserError) {
            console.error('Erro ao abrir browser:', browserError);
            
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
    await logActivityUtil(user, action, resource, details);
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
