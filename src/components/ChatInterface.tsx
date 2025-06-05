import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTransactionStore } from '../stores/transactionStore';
import { parseTransactionMessage, formatCurrency, formatTime } from '../utils/transactionParser';
import { processReceiptImage, formatReceiptSuggestion, ExtractedReceiptData } from '../utils/receiptProcessor';
import { ChatMessage } from '../types/Transaction';
import { PaymentValidationAlert } from './PaymentValidationAlert';
import { ImageUpload } from './ImageUpload';

export function ChatInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [lastValidation, setLastValidation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addTransaction, addParceladoTransaction, addChatMessage, chatMessages, getRecentTransactions, getTotalByPeriod } = useTransactionStore();

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

    setTimeout(() => {
      processMessage(inputMessage);
      setIsTyping(false);
    }, 1000);
  };

  const processMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('gastei') || lowerMessage.includes('gastos') || lowerMessage.includes('quanto')) {
      handleQuery(lowerMessage);
      return;
    }

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

      // Verificar se é parcelado
      if (parsedTransaction.totalParcelas && parsedTransaction.totalParcelas > 1) {
        addParceladoTransaction(transaction, parsedTransaction.totalParcelas);
        
        const valorTotal = parsedTransaction.valor * parsedTransaction.totalParcelas;
        let confirmationMessage = `✅ Compra parcelada registrada!\n${parsedTransaction.icone} ${parsedTransaction.categoria}: ${formatCurrency(valorTotal)}\n💳 ${parsedTransaction.totalParcelas}x de ${formatCurrency(parsedTransaction.valor)}\n${parsedTransaction.formaPagamento ? `💳 Forma de pagamento: ${parsedTransaction.formaPagamento}\n` : ''}📅 Primeira parcela: ${new Date().toLocaleDateString('pt-BR')}\n📅 Última parcela: ${new Date(new Date().setMonth(new Date().getMonth() + parsedTransaction.totalParcelas - 1)).toLocaleDateString('pt-BR')}`;

        if (parsedTransaction.validacao?.conflitos.length > 0) {
          confirmationMessage += `\n\n⚠️ Atenção: ${parsedTransaction.validacao.conflitos.join(', ')}`;
          setLastValidation(parsedTransaction.validacao);
        }

        const assistantMessage: Omit<ChatMessage, 'id'> = {
          tipo: 'assistant',
          conteudo: confirmationMessage,
          timestamp: new Date(),
        };

        addChatMessage(assistantMessage);
      } else {
        // Transação única
        addTransaction(transaction);

        let confirmationMessage = `✅ Gasto registrado!\n${parsedTransaction.icone} ${parsedTransaction.categoria}: ${formatCurrency(parsedTransaction.valor)}\n${parsedTransaction.formaPagamento ? `💳 Forma de pagamento: ${parsedTransaction.formaPagamento}\n` : ''}📅 ${new Date().toLocaleDateString('pt-BR')}`;

        if (parsedTransaction.validacao?.conflitos.length > 0) {
          confirmationMessage += `\n\n⚠️ Atenção: ${parsedTransaction.validacao.conflitos.join(', ')}`;
          setLastValidation(parsedTransaction.validacao);
        } else if (parsedTransaction.validacao?.confianca < 0.7) {
          confirmationMessage += `\n\n🤔 Forma de pagamento detectada com ${Math.round(parsedTransaction.validacao.confianca * 100)}% de confiança`;
          setLastValidation(parsedTransaction.validacao);
        }

        const assistantMessage: Omit<ChatMessage, 'id'> = {
          tipo: 'assistant',
          conteudo: confirmationMessage,
          timestamp: new Date(),
          transacao: { ...transaction, id: Date.now().toString() },
        };

        addChatMessage(assistantMessage);
      }
    } else {
      const assistantMessage: Omit<ChatMessage, 'id'> = {
        tipo: 'assistant',
        conteudo: '🤔 Não consegui entender. Tente algo como:\n• "ifood 44,00 crédito"\n• "uber 15 pix"\n• "tênis 200 cartão crédito 2x"\n• "mercado 120 cartão débito"',
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

  const handleImageUpload = async (file: File) => {
    console.log('📸 Imagem selecionada:', file.name);
    
    // Adicionar mensagem do usuário com a imagem
    const userMessage: Omit<ChatMessage, 'id'> = {
      tipo: 'user',
      conteudo: `📷 Enviou comprovante: ${file.name}`,
      timestamp: new Date(),
    };
    
    addChatMessage(userMessage);
    setIsProcessingImage(true);
    setIsTyping(true);

    try {
      // Processar a imagem
      const extractedData = await processReceiptImage(file);
      
      if (extractedData.confianca > 0.3 && extractedData.valor) {
        // Gerar sugestão de transação
        const suggestion = formatReceiptSuggestion(extractedData);
        
        const assistantMessage: Omit<ChatMessage, 'id'> = {
          tipo: 'assistant',
          conteudo: `📋 Comprovante analisado!\n\n🔍 **Dados extraídos:**\n${extractedData.tipo ? `📝 Tipo: ${extractedData.tipo}\n` : ''}${extractedData.valor ? `💰 Valor: ${formatCurrency(extractedData.valor)}\n` : ''}${extractedData.data ? `📅 Data: ${extractedData.data}\n` : ''}${extractedData.formaPagamento ? `💳 Forma: ${extractedData.formaPagamento}\n` : ''}${extractedData.recebedor ? `🏪 Recebedor: ${extractedData.recebedor}\n` : ''}${extractedData.banco ? `🏦 Banco: ${extractedData.banco}\n` : ''}${extractedData.codigoTransacao ? `🔢 Código: ${extractedData.codigoTransacao}\n` : ''}\n✅ **Sugestão de registro:**\n"${suggestion}"\n\n💡 Digite essa sugestão ou edite conforme necessário para registrar a transação.`,
          timestamp: new Date(),
        };
        
        addChatMessage(assistantMessage);
        
        // Preencher automaticamente o campo de input com a sugestão
        setInputMessage(suggestion);
        
      } else {
        const assistantMessage: Omit<ChatMessage, 'id'> = {
          tipo: 'assistant',
          conteudo: `🤔 Não consegui extrair informações suficientes do comprovante.\n\nConfiança: ${Math.round(extractedData.confianca * 100)}%\n\n💡 Tente:\n• Tirar uma foto mais nítida\n• Garantir boa iluminação\n• Ou registrar manualmente: "descrição valor forma_pagamento"`,
          timestamp: new Date(),
        };
        
        addChatMessage(assistantMessage);
      }
      
    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      
      const errorMessage: Omit<ChatMessage, 'id'> = {
        tipo: 'assistant',
        conteudo: '❌ Erro ao processar o comprovante. Tente novamente ou registre manualmente.',
        timestamp: new Date(),
      };
      
      addChatMessage(errorMessage);
    } finally {
      setIsProcessingImage(false);
      setIsTyping(false);
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
              <p>• "ifood 44,00 crédito"</p>
              <p>• "uber 15 pix"</p>
              <p>• "tênis 200 cartão crédito 2x"</p>
              <p>• 📷 Ou envie foto do comprovante!</p>
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div key={message.id}>
            <div
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
            
            {/* Mostrar alerta de validação apenas para a última mensagem do assistente com transação */}
            {message.tipo === 'assistant' && message.transacao && lastValidation && (
              <PaymentValidationAlert 
                validacao={lastValidation}
                onConfirm={() => setLastValidation(null)}
                onEdit={() => {
                  setInputMessage(`${message.transacao?.descricao} ${message.transacao?.valor}`);
                  setLastValidation(null);
                }}
              />
            )}
          </div>
        ))}

        {(isTyping || isProcessingImage) && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                {isProcessingImage && <Loader2 className="w-4 h-4 animate-spin" />}
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              {isProcessingImage && (
                <p className="text-xs text-gray-600 mt-1">Analisando comprovante...</p>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <ImageUpload 
            onImageSelected={handleImageUpload}
            disabled={isProcessingImage || isTyping}
          />
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite seu gasto ou envie comprovante..."
            className="flex-1 border-gray-300 focus:border-[var(--whatsapp-green)]"
            disabled={isProcessingImage}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isProcessingImage}
            className="whatsapp-green hover:bg-green-600 text-white px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
