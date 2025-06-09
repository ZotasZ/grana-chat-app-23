
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, LogOut, Activity, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuditLog {
  id: string;
  action: string;
  resource: string | null;
  created_at: string;
}

const UserProfile = () => {
  const { user, signOut, logActivity } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      logActivity('profile_view', 'user_profile');
      fetchAuditLogs();
    }
  }, [user, logActivity]);

  const fetchAuditLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('id, action, resource, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching audit logs:', error);
      } else {
        setAuditLogs(data || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logActivity('profile_logout', 'user_profile');
    await signOut();
  };

  if (!user) return null;

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
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
              <AvatarFallback className="text-sm">
                {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || 
                 user.email?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold truncate">
                {user.user_metadata?.full_name || 'Usuário'}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Login via: Google OAuth
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-green-600">
            <Shield className="w-4 h-4" />
            <span>Conta protegida por autenticação segura</span>
          </div>

          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Activity className="w-5 h-5" />
            <span>Atividades Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : auditLogs.length > 0 ? (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-start py-2 border-b border-border last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm capitalize">{log.action.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">{log.resource || 'Sistema'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma atividade registrada ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
