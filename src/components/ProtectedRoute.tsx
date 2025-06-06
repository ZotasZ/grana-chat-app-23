
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('🔧 ProtectedRoute - Modo desenvolvimento ativo');
  
  // Em desenvolvimento, sempre permitir acesso
  return <>{children}</>;
};

export default ProtectedRoute;
