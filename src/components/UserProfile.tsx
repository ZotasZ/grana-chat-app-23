
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, LogOut, Activity, User, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  action: string;
  resource: string | null;
  created_at: string;
}

const UserProfile = () => {
  const { user, signOut, logActivity } = useAuth();
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAuditLogs = useCallback(async () => {
    if (!user) return;

    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('audit_logs')
        .select('id, action, resource, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching audit logs:', error);
        toast({
          title: "Erro ao carregar logs",
          description: "Não foi possível carregar o histórico de atividades.",
          variant: "destructive",
        });
      } else {
        setAuditLogs(data || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      logActivity('profile_view', 'user_profile');
      fetchAuditLogs();
    }
  }, [user, logActivity, fetchAuditLogs]);

  const handleSignOut = useCallback(async () => {
    await logActivity('profile_logout', 'user_profile');
    await signOut();
  }, [logActivity, signOut]);

  const handleRefresh = useCallback(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  if (!user) return null;

  const getUserInitials = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
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
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.user_metadata?.full_name || 'Usuário'} 
              />
              <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                {getUserInitials()}
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

          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
            <Shield className="w-4 h-4" />
            <span>Conta protegida por autenticação segura</span>
          </div>

          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Activity className="w-5 h-5" />
              <span>Atividades Recentes</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
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
                    <p className="font-medium text-sm">{formatAction(log.action)}</p>
                    <p className="text-xs text-muted-foreground">{log.resource || 'Sistema'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {new Date(log.created_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma atividade registrada ainda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
