
import { useCallback, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { ChatMessage } from '@/types/Transaction';
import { parseTransactionMessage, formatCurrency } from '@/utils/transactionParser';

interface WhatsAppMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  messageType: 'text' | 'image' | 'command';
}

interface UseWhatsAppChatReturn {
  processWhatsAppMessage: (message: string, messageType?: 'text' | 'image') => WhatsAppMessage;
  formatBotResponse: (content: string) => string;
  getQuickReplies: () => string[];
  getMenuCommands: () => { command: string; description: string }[];
}

export function useWhatsAppChat(): UseWhatsAppChatReturn {
  const { 
    addChatMessage, 
    addTransaction, 
    addParceladoTransaction,
    getRecentTransactions,
    getTotalByPeriod 
  } = useTransactionStore();

  const menuCommands = useMemo(() => [
    { command: '/menu', description: 'Ver menu principal' },
    { command: '/gastos', description: 'Ver últimos gastos' },
    { command: '/hoje', description: 'Gastos de hoje' },
    { command: '/semana', description: 'Gastos da semana' },
    { command: '/ajuda', description: 'Como usar o bot' },
    { command: '/contas', description: 'Próximas contas a vencer' }
  ], []);

  const quickReplies = useMemo(() => [
    '📊 Ver gastos',
    '💰 Registrar gasto',
    '📱 Menu principal',
    '❓ Ajuda'
  ], []);

  const processWhatsAppMessage = useCallback((message: string, messageType: 'text' | 'image' = 'text'): WhatsAppMessage => {
    const userMessage: WhatsAppMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: message,
      sender: 'user',
      timestamp: new Date(),
      status: 'read',
      messageType
    };

    // Adicionar mensagem do usuário ao chat
    addChatMessage({
      tipo: 'user',
      conteudo: message,
      timestamp: new Date()
    });

    // Processar comando ou mensagem
    let botResponse = '';
    const lowerMessage = message.toLowerCase().trim();

    // Comandos do menu
    if (lowerMessage === '/menu') {
      botResponse = formatMenuResponse();
    } else if (lowerMessage === '/gastos') {
      botResponse = formatRecentExpenses();
    } else if (lowerMessage === '/hoje') {
      botResponse = formatTodayExpenses();
    } else if (lowerMessage === '/semana') {
      botResponse = formatWeekExpenses();
    } else if (lowerMessage === '/ajuda') {
      botResponse = formatHelpResponse();
    } else if (lowerMessage === '/contas') {
      botResponse = formatUpcomingBills();
    } else if (lowerMessage.includes('gastei') || lowerMessage.includes('gastos') || lowerMessage.includes('quanto')) {
      botResponse = processQuery(lowerMessage);
    } else {
      // Tentar processar como transação
      const success = processTransaction(message);
      if (!success) {
        botResponse = formatDefaultResponse();
      } else {
        return userMessage; // A resposta já foi adicionada em processTransaction
      }
    }

    // Adicionar resposta do bot
    const botMessage: WhatsAppMessage = {
      id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: botResponse,
      sender: 'bot',
      timestamp: new Date(),
      status: 'sent',
      messageType: 'text'
    };

    addChatMessage({
      tipo: 'assistant',
      conteudo: botResponse,
      timestamp: new Date()
    });

    return botMessage;
  }, [addChatMessage]);

  const processTransaction = useCallback((message: string): boolean => {
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

    let confirmationMessage: string;
    if (isParcelado) {
      const valorTotal = parsedTransaction.valor * parsedTransaction.totalParcelas!;
      confirmationMessage = `✅ *Compra parcelada registrada!*\n\n${parsedTransaction.icone} *${parsedTransaction.categoria}*: ${formatCurrency(valorTotal)}\n💳 ${parsedTransaction.totalParcelas}x de ${formatCurrency(parsedTransaction.valor)}\n${parsedTransaction.formaPagamento ? `💳 *Pagamento*: ${parsedTransaction.formaPagamento}\n` : ''}📅 *Primeira parcela*: ${new Date().toLocaleDateString('pt-BR')}\n\n_Parcelas criadas automaticamente_ 🤖`;
    } else {
      confirmationMessage = `✅ *Gasto registrado com sucesso!*\n\n${parsedTransaction.icone} *${parsedTransaction.categoria}*: ${formatCurrency(parsedTransaction.valor)}\n${parsedTransaction.formaPagamento ? `💳 *Pagamento*: ${parsedTransaction.formaPagamento}\n` : ''}📅 *Data*: ${new Date().toLocaleDateString('pt-BR')}\n\n_Digite /gastos para ver seus últimos registros_ 📊`;
    }

    addChatMessage({
      tipo: 'assistant',
      conteudo: confirmationMessage,
      timestamp: new Date()
    });

    return true;
  }, [addTransaction, addParceladoTransaction, addChatMessage]);

  const processQuery = useCallback((query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('últimos dias') || lowerQuery.includes('semana')) {
      const total = getTotalByPeriod(7);
      return `📊 *Gastos dos últimos 7 dias*\n💰 *Total*: ${formatCurrency(total)}\n\n_Digite /gastos para ver detalhes_`;
    } else if (lowerQuery.includes('hoje')) {
      const total = getTotalByPeriod(1);
      return `📅 *Gastos de hoje*\n💰 *Total*: ${formatCurrency(total)}\n\n_Digite /gastos para ver detalhes_`;
    } else {
      const recent = getRecentTransactions(5);
      if (recent.length === 0) {
        return '📭 *Nenhum gasto registrado ainda*\n\nPara registrar um gasto, digite algo como:\n• "ifood 44,00 crédito"\n• "uber 15 pix"\n• "mercado 120 débito"';
      }
      return '📝 *Seus últimos gastos*:\n\n' + recent.map(t => `• ${t.descricao}: ${formatCurrency(t.valor)}`).join('\n') + '\n\n_Digite /hoje ou /semana para ver totais_';
    }
  }, [getTotalByPeriod, getRecentTransactions]);

  const formatMenuResponse = useCallback((): string => {
    return `🤖 *FinControl Bot* - Menu Principal\n\n` +
           `*Comandos disponíveis:*\n` +
           `📊 /gastos - Ver últimos gastos\n` +
           `📅 /hoje - Gastos de hoje\n` +
           `📈 /semana - Gastos da semana\n` +
           `💳 /contas - Próximas contas\n` +
           `❓ /ajuda - Como usar\n\n` +
           `*Para registrar gastos:*\n` +
           `• "ifood 44,00 crédito"\n` +
           `• "uber 15 pix"\n` +
           `• "mercado 120 débito 2x"\n\n` +
           `📷 *Ou envie foto do comprovante!*`;
  }, []);

  const formatRecentExpenses = useCallback((): string => {
    const recent = getRecentTransactions(10);
    if (recent.length === 0) {
      return '📭 *Nenhum gasto registrado*\n\nComece registrando um gasto:\n"mercado 50 débito"';
    }
    
    return `📝 *Últimos ${recent.length} gastos*:\n\n` +
           recent.map((t, i) => 
             `${i + 1}. *${t.descricao}*\n` +
             `   💰 ${formatCurrency(t.valor)}\n` +
             `   📅 ${new Date(t.data).toLocaleDateString('pt-BR')}\n`
           ).join('\n') +
           `\n_Total: ${formatCurrency(recent.reduce((sum, t) => sum + t.valor, 0))}_`;
  }, [getRecentTransactions]);

  const formatTodayExpenses = useCallback((): string => {
    const total = getTotalByPeriod(1);
    return `📅 *Gastos de hoje*\n💰 *Total*: ${formatCurrency(total)}\n\n_Digite /gastos para ver detalhes_`;
  }, [getTotalByPeriod]);

  const formatWeekExpenses = useCallback((): string => {
    const total = getTotalByPeriod(7);
    return `📈 *Gastos da semana*\n💰 *Total*: ${formatCurrency(total)}\n\n_Digite /gastos para ver detalhes_`;
  }, [getTotalByPeriod]);

  const formatHelpResponse = useCallback((): string => {
    return `❓ *Como usar o FinControl Bot*\n\n` +
           `*1. Registrar gastos:*\n` +
           `• "ifood 44,00 crédito"\n` +
           `• "uber 15 pix"\n` +
           `• "mercado 120 débito"\n` +
           `• "tênis 200 cartão 3x" (parcelado)\n\n` +
           `*2. Formas de pagamento:*\n` +
           `• crédito, débito, pix, dinheiro\n` +
           `• cartão crédito, cartão débito\n\n` +
           `*3. Comandos úteis:*\n` +
           `• /menu - Ver opções\n` +
           `• /gastos - Últimos registros\n` +
           `• /hoje ou /semana - Totais\n\n` +
           `📷 *Envie foto do comprovante* para registro automático!`;
  }, []);

  const formatUpcomingBills = useCallback((): string => {
    // Implementar quando tiver dados das contas
    return `💳 *Próximas contas*\n\n_Funcionalidade em desenvolvimento..._\n\nPor enquanto, registre seus gastos normalmente!`;
  }, []);

  const formatDefaultResponse = useCallback((): string => {
    return `🤔 *Não entendi...*\n\n` +
           `Tente:\n` +
           `• "ifood 44,00 crédito"\n` +
           `• "uber 15 pix"\n` +
           `• /menu - Ver opções\n` +
           `• /ajuda - Como usar\n\n` +
           `📷 *Ou envie foto do comprovante!*`;
  }, []);

  const formatBotResponse = useCallback((content: string): string => {
    // Adiciona formatação do WhatsApp
    return content
      .replace(/\*\*(.*?)\*\*/g, '*$1*')  // Bold
      .replace(/__(.*?)__/g, '_$1_')      // Italic
      .replace(/`(.*?)`/g, '```$1```');   // Code
  }, []);

  const getQuickReplies = useCallback((): string[] => {
    return quickReplies;
  }, [quickReplies]);

  const getMenuCommands = useCallback(() => {
    return menuCommands;
  }, [menuCommands]);

  return {
    processWhatsAppMessage,
    formatBotResponse,
    getQuickReplies,
    getMenuCommands
  };
}
