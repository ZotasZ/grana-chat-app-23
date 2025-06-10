
import { useEffect, useCallback } from 'react';
import { useRecurringBillsStore } from '@/stores/recurringBillsStore';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export const useAlerts = () => {
  const { bills } = useRecurringBillsStore();
  const { toast } = useToast();

  const checkAlerts = useCallback(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayString = today.toDateString();
    const tomorrowString = tomorrow.toDateString();

    bills.forEach(bill => {
      if (!bill.ativo) return;

      const vencimento = new Date(bill.proximoVencimento);
      const vencimentoString = vencimento.toDateString();

      // Alerta para amanhã
      if (tomorrowString === vencimentoString && bill.alertaUmDia) {
        showAlert(bill, 'amanha');
      }

      // Alerta para hoje
      if (todayString === vencimentoString && bill.alertaDiaVencimento) {
        showAlert(bill, 'hoje');
      }
    });
  }, [bills]);

  const showAlert = useCallback((bill: any, quando: 'hoje' | 'amanha') => {
    const titulo = quando === 'hoje' ? 
      'Conta vence hoje!' : 
      'Conta vence amanhã!';
    
    const valor = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(bill.valor);
    
    const descricao = `${bill.nome} - ${valor}`;

    toast({
      title: titulo,
      description: descricao,
      duration: 10000,
      action: (
        <Bell className="w-4 h-4" />
      ),
    });

    // Notificação push se permitida
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(titulo, {
        body: descricao,
        icon: '/lovable-uploads/b294f686-9842-4bdf-9bdd-3f0252e30686.png',
        badge: '/lovable-uploads/b294f686-9842-4bdf-9bdd-3f0252e30686.png'
      });
    }
  }, [toast]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          toast({
            title: "Notificações ativadas!",
            description: "Você receberá alertas sobre suas contas.",
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }, [toast]);

  useEffect(() => {
    requestNotificationPermission();
    checkAlerts();
    
    // Verificar alertas a cada hora
    const interval = setInterval(checkAlerts, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkAlerts, requestNotificationPermission]);

  return { 
    checkAlerts, 
    requestNotificationPermission 
  };
};
