
import React from 'react';
import { Loader2 } from 'lucide-react';

interface TypingIndicatorProps {
  isProcessingImage?: boolean;
}

export function TypingIndicator({ isProcessingImage }: TypingIndicatorProps) {
  return (
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
  );
}
