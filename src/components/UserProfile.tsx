
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, LogOut, Activity, User, Settings } from 'lucide-react';

const UserProfile = () => {
  const { user, signOut, logActivity } = useAuth();

  const mockProfile = {
    id: user?.id || 'dev-user-123',
    email: user?.email || 'dev@example.com',
    full_name: user?.user_metadata?.name || 'Usuário Desenvolvimento',
    avatar_url: '',
    created_at: new Date().toISOString()
  };

  const mockAuditLogs = [
    {
      id: '1',
      action: 'profile_view',
      resource: 'user_profile',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      action: 'app_access',
      resource: 'dashboard',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      action: 'transaction_add',
      resource: 'transactions',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  React.useEffect(() => {
    logActivity('profile_view', 'user_profile');
  }, [logActivity]);

  const handleSignOut = async () => {
    await logActivity('profile_logout', 'user_profile');
    await signOut();
  };

  return (
    <div className="space-y-4 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <User className="w-5 h-5" />
            <span>Perfil do Usuário</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={mockProfile.avatar_url} alt={mockProfile.full_name} />
              <AvatarFallback className="text-sm">
                {mockProfile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold truncate">{mockProfile.full_name}</h3>
              <p className="text-sm text-muted-foreground truncate">{mockProfile.email}</p>
              <p className="text-xs text-muted-foreground">
                Modo: Desenvolvimento
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <Settings className="w-4 h-4" />
            <span>Configuração de desenvolvimento ativa</span>
          </div>

          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full" 
            disabled
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout (Desabilitado)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Activity className="w-5 h-5" />
            <span>Atividades Simuladas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAuditLogs.map((log) => (
              <div key={log.id} className="flex justify-between items-start py-2 border-b border-border last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm capitalize">{log.action.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground">{log.resource}</p>
                </div>
                <p className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                  {new Date(log.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
