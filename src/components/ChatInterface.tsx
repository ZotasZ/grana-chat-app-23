import React, { useState } from 'react';
import { MessageCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WhatsAppInterface } from '@/components/WhatsAppInterface';

export function ChatInterface() {
  const [viewMode, setViewMode] = useState<'chat' | 'whatsapp'>('chat');

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastValidation, setLastValidation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { chatMessages } = useTransactionStore();
  const { addMessage, processTransactionMessage, processQueryMessage } = useChatMessages();
  const { isProcessing: isProcessingImage, processImage } = useOCR();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      tipo: 'user' as const,
      conteudo: inputMessage,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    // Simular delay de digitação
    setTimeout(() => {
      processMessage(inputMessage);
      setIsTyping(false);
    }, 1000);
  };

  const processMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('gastei') || lowerMessage.includes('gastos') || lowerMessage.includes('quanto')) {
      processQueryMessage(lowerMessage);
      return;
    }

    const success = processTransactionMessage(message);
    
    if (!success) {
      addMessage({
        tipo: 'assistant',
        conteudo: '🤔 Não consegui entender. Tente algo como:\n• "ifood 44,00 crédito"\n• "uber 15 pix"\n• "tênis 200 cartão crédito 2x"\n• "mercado 120 cartão débito"',
        timestamp: new Date(),
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    console.log('📸 Imagem selecionada:', file.name);
    
    addMessage({
      tipo: 'user',
      conteudo: `📷 Enviou comprovante: ${file.name}`,
      timestamp: new Date(),
    });

    setIsTyping(true);

    try {
      const extractedData = await processImage(file);
      
      if (extractedData && extractedData.confianca > 0.3 && extractedData.valor) {
        const suggestion = formatReceiptSuggestion(extractedData);
        const analysisMessage = createReceiptAnalysisMessage(extractedData);
        
        addMessage({
          tipo: 'assistant',
          conteudo: analysisMessage,
          timestamp: new Date(),
        });
        
        setInputMessage(suggestion);
      } else {
        addMessage({
          tipo: 'assistant',
          conteudo: `🤔 Não consegui extrair informações suficientes do comprovante.\n\n💡 Tente:\n• Tirar uma foto mais nítida\n• Garantir boa iluminação\n• Ou registrar manualmente: "descrição valor forma_pagamento"`,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      addMessage({
        tipo: 'assistant',
        conteudo: '❌ Erro ao processar o comprovante. Tente novamente ou registre manualmente.',
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (viewMode === 'whatsapp') {
    return (
      <div className="flex flex-col h-full">
        {/* Mode Toggle */}
        <div className="p-4 bg-white border-b flex justify-center gap-2">
          <Button
            variant={viewMode === 'chat' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chat')}
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Chat Normal
          </Button>
          <Button
            variant={viewMode === 'whatsapp' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('whatsapp')}
            className="flex items-center gap-2 bg-[#075e54] hover:bg-[#064e46] text-white"
          >
            <Smartphone className="w-4 h-4" />
            Modo WhatsApp
          </Button>
        </div>

        <WhatsAppInterface />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Mode Toggle */}
      <div className="p-4 bg-white border-b flex justify-center gap-2">
        <Button
          variant={viewMode === 'chat' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('chat')}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Chat Normal
        </Button>
        <Button
          variant={viewMode === 'whatsapp' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('whatsapp')}
          className="flex items-center gap-2 bg-[#075e54] hover:bg-[#064e46] text-white"
        >
          <Smartphone className="w-4 h-4" />
          Modo WhatsApp
        </Button>
      </div>

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
              <p className="text-[#075e54] font-medium mt-3">💡 Experimente o Modo WhatsApp!</p>
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div key={message.id}>
            <ChatMessage message={message} />
            
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
          <TypingIndicator isProcessingImage={isProcessingImage} />
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
