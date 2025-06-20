
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const AuthPage = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/b294f686-9842-4bdf-9bdd-3f0252e30686.png" 
                alt="FinControl Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              FinControl
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sistema de Controle Financeiro Pessoal
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Conectando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Entrar com Google</span>
                </div>
              )}
            </Button>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-green-600" />
                <span>Conexão protegida por HTTPS</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-green-600" />
                <span>Dados criptografados no Supabase</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-green-600" />
                <span>Logs de auditoria completos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Row Level Security ativo</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Ao fazer login, você concorda com nossa política de privacidade e 
              proteção de dados. Todos os acessos são monitorados e registrados 
              para sua segurança.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
