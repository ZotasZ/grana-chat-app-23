
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface PaymentValidationAlertProps {
  validacao?: {
    formaPagamento: string;
    confianca: number;
    conflitos: string[];
  };
  onConfirm?: () => void;
  onEdit?: () => void;
}

export function PaymentValidationAlert({ validacao, onConfirm, onEdit }: PaymentValidationAlertProps) {
  if (!validacao || validacao.conflitos.length === 0) {
    return null;
  }

  const hasConflicts = validacao.conflitos.length > 0;
  const lowConfidence = validacao.confianca < 0.7;

  if (!hasConflicts && !lowConfidence) {
    return null;
  }

  return (
    <Alert variant={hasConflicts ? "destructive" : "default"} className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>
        {hasConflicts ? "Conflito Detectado!" : "Baixa Confiança"}
      </AlertTitle>
      <AlertDescription className="space-y-2">
        {hasConflicts && (
          <p>
            Detectamos palavras conflitantes na forma de pagamento. 
            Registramos como: <strong>{validacao.formaPagamento}</strong>
          </p>
        )}
        
        {lowConfidence && (
          <p>
            A forma de pagamento foi detectada com baixa confiança ({Math.round(validacao.confianca * 100)}%).
            Pode ser necessário verificar se está correta.
          </p>
        )}
        
        <div className="flex gap-2 mt-3">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Confirmar
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Corrigir
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
