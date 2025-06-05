
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Temporariamente removendo a verificação de autenticação
  // TODO: Reativar autenticação quando necessário
  console.log('🔧 ProtectedRoute - Autenticação desabilitada temporariamente');
  
  // Sempre permitir acesso durante desenvolvimento
  return <>{children}</>;
};

export default ProtectedRoute;
