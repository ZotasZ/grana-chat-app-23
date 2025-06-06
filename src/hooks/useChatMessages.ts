
import { useCallback, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { ChatMessage } from '@/types/Transaction';
import { parseTransactionMessage, formatCurrency } from '@/utils/transactionParser';

interface UseChatMessagesReturn {
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  processTransactionMessage: (message: string) => boolean;
  processQueryMessage: (query: string) => void;
}

export function useChatMessages(): UseChatMessagesReturn {
  const { 
    addChatMessage, 
    addTransaction, 
    addParceladoTransaction,
    getRecentTransactions,
    getTotalByPeriod 
  } = useTransactionStore();

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    addChatMessage(message);
  }, [addChatMessage]);

  const createConfirmationMessage = useCallback((parsedTransaction: any, isParcelado: boolean) => {
    let confirmationMessage: string;

    if (isParcelado) {
      const valorTotal = parsedTransaction.valor * parsedTransaction.totalParcelas;
      confirmationMessage = `✅ Compra parcelada registrada!\n${parsedTransaction.icone} ${parsedTransaction.categoria}: ${formatCurrency(valorTotal)}\n💳 ${parsedTransaction.totalParcelas}x de ${formatCurrency(parsedTransaction.valor)}\n${parsedTransaction.formaPagamento ? `💳 Forma de pagamento: ${parsedTransaction.formaPagamento}\n` : ''}📅 Primeira parcela: ${new Date().toLocaleDateString('pt-BR')}`;
    } else {
      confirmationMessage = `✅ Gasto registrado!\n${parsedTransaction.icone} ${parsedTransaction.categoria}: ${formatCurrency(parsedTransaction.valor)}\n${parsedTransaction.formaPagamento ? `💳 Forma de pagamento: ${parsedTransaction.formaPagamento}\n` : ''}📅 ${new Date().toLocaleDateString('pt-BR')}`;
    }

    if (parsedTransaction.validacao?.conflitos.length > 0) {
      confirmationMessage += `\n\n⚠️ Atenção: ${parsedTransaction.validacao.conflitos.join(', ')}`;
    }

    return confirmationMessage;
  }, []);

  const processTransactionMessage = useCallback((message: string): boolean => {
    const parsedTransaction = parseTransactionMessage(message);
    
    if (!parsedTransaction) return false;

    const transaction = {
      valor: parsedTransaction.valor,
      categoria: parsedTransaction.categoria,
      descricao: parsedTransaction.descricao,
      data: new Date(),
      tipo: 'gasto' as const,
      formaPagamento: parsedTransaction.formaPagamento,
    };

    const isParcelado = parsedTransaction.totalParcelas && parsedTransaction.totalParcelas > 1;

    if (isParcelado) {
      addParceladoTransaction(transaction, parsedTransaction.totalParcelas!);
    } else {
      addTransaction(transaction);
    }

    const confirmationMessage = createConfirmationMessage(parsedTransaction, isParcelado);

    addMessage({
      tipo: 'assistant',
      conteudo: confirmationMessage,
      timestamp: new Date(),
    });

    return true;
  }, [addTransaction, addParceladoTransaction, addMessage, createConfirmationMessage]);

  const queryResponses = useMemo(() => ({
    week: (total: number) => `📊 Gastos dos últimos 7 dias:\n💰 Total: ${formatCurrency(total)}`,
    today: (total: number) => `📅 Gastos de hoje:\n💰 Total: ${formatCurrency(total)}`,
    recent: (transactions: any[]) => transactions.length > 0 
      ? '📝 Seus últimos gastos:\n' + transactions.map(t => `• ${t.descricao}: ${formatCurrency(t.valor)}`).join('\n')
      : '📭 Você ainda não tem gastos registrados.'
  }), []);

  const processQueryMessage = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    let response = '';

    if (lowerQuery.includes('últimos dias') || lowerQuery.includes('semana')) {
      const total = getTotalByPeriod(7);
      response = queryResponses.week(total);
    } else if (lowerQuery.includes('hoje')) {
      const total = getTotalByPeriod(1);
      response = queryResponses.today(total);
    } else {
      const recent = getRecentTransactions(5);
      response = queryResponses.recent(recent);
    }

    addMessage({
      tipo: 'assistant',
      conteudo: response,
      timestamp: new Date(),
    });
  }, [getTotalByPeriod, getRecentTransactions, addMessage, queryResponses]);

  return {
    addMessage,
    processTransactionMessage,
    processQueryMessage
  };
}
