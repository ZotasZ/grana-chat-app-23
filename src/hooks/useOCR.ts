
import { useState } from 'react';
import { processReceiptImage, ExtractedReceiptData } from '@/utils/receiptProcessor';

interface UseOCRReturn {
  isProcessing: boolean;
  processImage: (file: File) => Promise<ExtractedReceiptData | null>;
  error: string | null;
}

export function useOCR(): UseOCRReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (file: File): Promise<ExtractedReceiptData | null> => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Arquivo deve ser uma imagem');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processReceiptImage(file);
      return result;
    } catch (err) {
      console.error('Erro no processamento OCR:', err);
      setError('Erro ao processar imagem');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processImage,
    error
  };
}
