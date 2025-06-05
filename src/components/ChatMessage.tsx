
import React, { memo } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/Transaction';
import { formatTime } from '@/utils/transactionParser';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
  return (
    <div className={`flex ${message.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
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
  );
});

ChatMessage.displayName = 'ChatMessage';
