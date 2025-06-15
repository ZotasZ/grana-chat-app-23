
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface UseAuthEffectsProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  toast: (options: any) => void;
}

export const useAuthEffects = ({ setSession, setUser, setLoading, toast }: UseAuthEffectsProps) => {
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

      if (Capacitor && Capacitor.isNativePlatform() && App) {
        const handleAppUrlOpen = async (data: any) => {
          console.log('App URL aberto (nova implementação):', data.url);
          const urlStr = data.url;

          if (urlStr && urlStr.includes('#access_token=')) {
            console.log('Token detectado na URL, processando...');

            if (Browser) {
              try {
                await Browser.close();
                console.log('Browser fechado após detectar token.');
              } catch (error) {
                console.error('Erro ao fechar browser, pode já estar fechado.', error);
              }
            }

            const hash = urlStr.substring(urlStr.indexOf('#') + 1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken) {
              console.log('Definindo sessão com tokens extraídos manualmente.');
              const { data: sessionData, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });

              if (error) {
                console.error('Erro ao definir sessão via setSession:', error);
                toast({
                  title: "Erro de Autenticação",
                  description: `Não foi possível validar sua sessão: ${error.message}`,
                  variant: "destructive",
                });
              } else {
                console.log('Sessão definida com sucesso via setSession:', sessionData.user?.email);
              }
            } else {
              console.error('URL de callback recebida, mas access_token não encontrado.');
              toast({
                title: "Erro de Autenticação",
                description: "A resposta do provedor de login é inválida.",
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
  }, [toast, setSession, setUser, setLoading]);
};
