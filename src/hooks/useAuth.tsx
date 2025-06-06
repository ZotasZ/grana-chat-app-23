
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
  const { toast } = useToast();
  
  // Usuário mock simplificado para desenvolvimento
  const mockUser = {
    id: 'dev-user-123',
    email: 'dev@example.com',
    user_metadata: { name: 'Usuário Desenvolvimento' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString()
  } as User;

  const mockSession = {
    user: mockUser,
    access_token: 'mock-token',
    refresh_token: 'mock-refresh',
    expires_in: 3600,
    token_type: 'bearer',
    expires_at: Date.now() + 3600000
  } as Session;

  const [user] = useState<User | null>(mockUser);
  const [session] = useState<Session | null>(mockSession);
  const [loading] = useState(false);

  const signInWithGoogle = async () => {
    console.log('🔧 Login simulado - funcionalidade desabilitada em desenvolvimento');
    toast({
      title: "Modo desenvolvimento",
      description: "Sistema de login desabilitado temporariamente.",
    });
  };

  const signOut = async () => {
    console.log('🔧 Logout simulado - funcionalidade desabilitada em desenvolvimento');
    toast({
      title: "Modo desenvolvimento",
      description: "Sistema de logout desabilitado temporariamente.",
    });
  };

  const logActivity = async (action: string, resource?: string, details?: any) => {
    console.log('📝 Activity logged:', { action, resource, details });
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
