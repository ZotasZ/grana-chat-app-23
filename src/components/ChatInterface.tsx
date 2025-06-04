
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTransactionStore } from '../stores/transactionStore';
import { parseTransactionMessage, formatCurrency, formatTime } from '../utils/transactionParser';
import { ChatMessage } from '../types/Transaction';

export function ChatInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addTransaction, addChatMessage, chatMessages, getRecentTransactions, getTotalByPeriod } = useTransactionStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Omit<ChatMessage, 'id'> = {
      tipo: 'user',
      conteudo: inputMessage,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    // Simular delay do assistente
    setTimeout(() => {
      processMessage(inputMessage);
      setIsTyping(false);
    }, 1000);
  };

  const processMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Verificar se é uma consulta
    if (lowerMessage.includes('gastei') || lowerMessage.includes('gastos') || lowerMessage.includes('quanto')) {
      handleQuery(lowerMessage);
      return;
    }

    // Tentar processar como transação
    const parsedTransaction = parseTransactionMessage(message);
    
    if (parsedTransaction) {
      const transaction = {
        valor: parsedTransaction.valor,
        categoria: parsedTransaction.categoria,
        descricao: parsedTransaction.descricao,
        data: new Date(),
        tipo: 'gasto' as const,
        formaPagamento: parsedTransaction.formaPagamento,
      };

      addTransaction(transaction);

      const confirmationMessage = `✅ Gasto registrado!\n${parsedTransaction.icone} ${parsedTransaction.categoria}: ${formatCurrency(parsedTransaction.valor)}\n${parsedTransaction.formaPagamento ? `💳 Forma de pagamento: ${parsedTransaction.formaPagamento}\n` : ''}📅 ${new Date().toLocaleDateString('pt-BR')}`;

      const assistantMessage: Omit<ChatMessage, 'id'> = {
        tipo: 'assistant',
        conteudo: confirmationMessage,
        timestamp: new Date(),
        transacao: { ...transaction, id: Date.now().toString() },
      };

      addChatMessage(assistantMessage);
    } else {
      const assistantMessage: Omit<ChatMessage, 'id'> = {
        tipo: 'assistant',
        conteudo: '🤔 Não consegui entender. Tente algo como:\n• "ifood 44,00"\n• "uber 15 pix"\n• "mercado 120 cartão"',
        timestamp: new Date(),
      };

      addChatMessage(assistantMessage);
    }
  };

  const handleQuery = (query: string) => {
    let response = '';

    if (query.includes('últimos dias') || query.includes('semana')) {
      const total = getTotalByPeriod(7);
      response = `📊 Gastos dos últimos 7 dias:\n💰 Total: ${formatCurrency(total)}`;
    } else if (query.includes('hoje') || query.includes('hoje')) {
      const total = getTotalByPeriod(1);
      response = `📅 Gastos de hoje:\n💰 Total: ${formatCurrency(total)}`;
    } else {
      const recent = getRecentTransactions(5);
      if (recent.length > 0) {
        response = '📝 Seus últimos gastos:\n' + 
          recent.map(t => `• ${t.descricao}: ${formatCurrency(t.valor)}`).join('\n');
      } else {
        response = '📭 Você ainda não tem gastos registrados.';
      }
    }

    const assistantMessage: Omit<ChatMessage, 'id'> = {
      tipo: 'assistant',
      conteudo: response,
      timestamp: new Date(),
    };

    addChatMessage(assistantMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="whatsapp-dark text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-[var(--whatsapp-dark)]" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Assistente Financeiro</h1>
            <p className="text-sm opacity-90">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Olá! 👋</p>
            <p className="text-sm">Registre seus gastos de forma simples:</p>
            <div className="mt-4 space-y-2 text-xs">
              <p>• "ifood 44,00"</p>
              <p>• "uber 15 pix"</p>
              <p>• "mercado 120 cartão"</p>
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                message.tipo === 'user'
                  ? 'whatsapp-green text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              <p className="whitespace-pre-line text-sm">{message.conteudo}</p>
              <p className={`text-xs mt-1 ${
                message.tipo === 'user' ? 'text-green-100' : 'text-gray-500'
              }`}>
                {formatTime(new Date(message.timestamp))}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite seu gasto..."
            className="flex-1 border-gray-300 focus:border-[var(--whatsapp-green)]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="whatsapp-green hover:bg-green-600 text-white px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
