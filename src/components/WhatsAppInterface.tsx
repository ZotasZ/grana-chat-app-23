
import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTransactionStore } from '@/stores/transactionStore';
import { useWhatsAppChat } from '@/hooks/useWhatsAppChat';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { ImageUpload } from '@/components/ImageUpload';
import { useOCR } from '@/hooks/useOCR';
import { formatReceiptSuggestion, createReceiptAnalysisMessage } from '@/utils/receiptFormatter';

export function WhatsAppInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { chatMessages } = useTransactionStore();
  const { processWhatsAppMessage, getQuickReplies, getMenuCommands } = useWhatsAppChat();
  const { isProcessing: isProcessingImage, processImage } = useOCR();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setShowQuickReplies(false);
    setIsTyping(true);

    // Simular delay de digitação do WhatsApp
    setTimeout(() => {
      processWhatsAppMessage(inputMessage);
      setInputMessage('');
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setShowQuickReplies(false);
  };

  const handleImageUpload = async (file: File) => {
    console.log('📸 Imagem enviada via WhatsApp:', file.name);
    
    processWhatsAppMessage(`📷 Comprovante: ${file.name}`, 'image');
    setIsTyping(true);

    try {
      const extractedData = await processImage(file);
      
      if (extractedData && extractedData.confianca > 0.3 && extractedData.valor) {
        const suggestion = formatReceiptSuggestion(extractedData);
        const analysisMessage = createReceiptAnalysisMessage(extractedData);
        
        setTimeout(() => {
          processWhatsAppMessage(analysisMessage);
          setInputMessage(suggestion);
          setIsTyping(false);
        }, 1500);
      } else {
        setTimeout(() => {
          processWhatsAppMessage(`🤔 *Não consegui ler o comprovante*\n\n💡 *Tente*:\n• Foto mais nítida\n• Boa iluminação\n• Ou digite: "descrição valor forma"`);
          setIsTyping(false);
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      setTimeout(() => {
        processWhatsAppMessage('❌ *Erro ao processar comprovante*\n\nTente novamente ou registre manualmente');
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = getQuickReplies();

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] max-w-md mx-auto">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowLeft className="w-6 h-6 cursor-pointer" />
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/b294f686-9842-4bdf-9bdd-3f0252e30686.png" 
                alt="FinControl" 
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div>
              <h1 className="font-semibold text-base">FinControl Bot</h1>
              <p className="text-xs opacity-90">online</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Video className="w-5 h-5 cursor-pointer" />
            <Phone className="w-5 h-5 cursor-pointer" />
            <MoreVertical className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#e5ddd5]">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            <div className="bg-white rounded-lg p-4 shadow-sm mx-4">
              <div className="w-12 h-12 bg-[#075e54] rounded-full flex items-center justify-center mx-auto mb-3">
                <img 
                  src="/lovable-uploads/b294f686-9842-4bdf-9bdd-3f0252e30686.png" 
                  alt="FinControl" 
                  className="w-8 h-8"
                />
              </div>
              <p className="font-medium mb-2">Olá! 👋</p>
              <p className="text-sm text-gray-600 mb-3">
                Sou o FinControl Bot! Posso te ajudar a registrar gastos de forma simples.
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• "ifood 44,00 crédito"</p>
                <p>• "uber 15 pix"</p>
                <p>• 📷 Ou envie foto do comprovante!</p>
                <p>• Digite <strong>/menu</strong> para ver todas as opções</p>
              </div>
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-3 py-2 rounded-lg shadow-sm ${
                message.tipo === 'user'
                  ? 'bg-[#dcf8c6] text-gray-800'
                  : 'bg-white text-gray-800'
              }`}
            >
              <p className="whitespace-pre-line text-sm">{message.conteudo}</p>
              <p className={`text-xs mt-1 ${
                message.tipo === 'user' ? 'text-gray-600' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                {message.tipo === 'user' && (
                  <span className="ml-1 text-blue-500">✓✓</span>
                )}
              </p>
            </div>
          </div>
        ))}

        {(isTyping || isProcessingImage) && (
          <div className="flex justify-start">
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
              <TypingIndicator isProcessingImage={isProcessingImage} />
            </div>
          </div>
        )}

        {/* Quick Replies */}
        {showQuickReplies && chatMessages.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="bg-white text-[#075e54] px-3 py-2 rounded-full text-sm border border-[#075e54] hover:bg-[#075e54] hover:text-white transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#f0f0f0] border-t">
        <div className="flex gap-2 items-end">
          <ImageUpload 
            onImageSelected={handleImageUpload}
            disabled={isProcessingImage || isTyping}
          />
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className="rounded-full border-gray-300 focus:border-[#075e54] bg-white"
              disabled={isProcessingImage}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isProcessingImage}
            className="bg-[#075e54] hover:bg-[#064e46] text-white rounded-full p-3 h-auto"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
