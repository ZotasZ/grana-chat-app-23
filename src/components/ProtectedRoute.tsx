
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, signInWithGoogle } = useAuth();

  console.log('🛡️ ProtectedRoute - Loading:', loading, 'User:', user?.email);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificar se estamos em desenvolvimento
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  // Em desenvolvimento, sempre permitir acesso
  if (isDevelopment) {
    console.log('🔧 Modo desenvolvimento - acesso liberado');
    return <>{children}</>;
  }

  // Em produção, verificar autenticação
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <LogIn className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo ao Grana Chat
            </h1>
            <p className="text-gray-600">
              Faça login para acessar seu assistente financeiro pessoal
            </p>
          </div>
          
          <Button 
            onClick={signInWithGoogle}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Entrar com Google
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Seus dados estão seguros e protegidos
          </p>
        </div>
      </div>
    );
  }

  // Usuário autenticado - mostrar conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;
