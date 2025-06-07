
import { useEffect } from 'react';
import { useRecurringBillsStore } from '@/stores/recurringBillsStore';
import { useToast } from '@/hooks/use-toast';

export const useAlerts = () => {
  const { bills } = useRecurringBillsStore();
  const { toast } = useToast();

  const checkAlerts = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    bills.forEach(bill => {
      if (!bill.ativo) return;

      const vencimento = new Date(bill.proximoVencimento);
      const isToday = today.toDateString() === vencimento.toDateString();
      const isTomorrow = tomorrow.toDateString() === vencimento.toDateString();

      // Alerta para amanhã
      if (isTomorrow && bill.alertaUmDia) {
        showAlert(bill, 'amanha');
      }

      // Alerta para hoje
      if (isToday && bill.alertaDiaVencimento) {
        showAlert(bill, 'hoje');
      }
    });
  };

  const showAlert = (bill: any, quando: 'hoje' | 'amanha') => {
    const titulo = quando === 'hoje' ? 
      'Conta vence hoje!' : 
      'Conta vence amanhã!';
    
    const descricao = `${bill.nome} - R$ ${bill.valor.toFixed(2).replace('.', ',')}`;

    toast({
      title: titulo,
      description: descricao,
      duration: 10000, // 10 segundos
    });

    // Aqui você pode adicionar notificação push real
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(titulo, {
        body: descricao,
        icon: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    checkAlerts();
    
    // Verificar alertas a cada hora
    const interval = setInterval(checkAlerts, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [bills]);

  return { checkAlerts, requestNotificationPermission };
};
