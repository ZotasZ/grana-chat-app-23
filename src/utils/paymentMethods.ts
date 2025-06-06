
export interface PaymentValidationResult {
  formaPagamento: string;
  confianca: number;
  conflitos: string[];
}

export const PAYMENT_KEYWORDS = {
  credito: [
    'credito', 'crédito', 'credit', 'cc', 'cartao credito', 'cartão crédito',
    'cartao de credito', 'cartão de crédito', 'visa credito', 'master credito'
  ],
  debito: [
    'debito', 'débito', 'debit', 'cd', 'cartao debito', 'cartão débito',
    'cartao de debito', 'cartão de débito', 'visa debito', 'master debito'
  ],
  pix: ['pix', 'px'],
  dinheiro: ['dinheiro', 'din', 'especie', 'espécie', 'cash'],
  boleto: ['boleto', 'bol'],
  mercadopago: ['mercado pago', 'mercadopago', 'mpago', 'mp'],
  picpay: ['picpay', 'pic pay', 'pp'],
  valealimentacao: ['vale alimentacao', 'vale alimentação', 'va', 'sodexo', 'alelo'],
  transferencia: ['transferencia', 'transferência', 'ted', 'doc']
};

export const PAYMENT_NAMES: Record<string, string> = {
  credito: 'Cartão de Crédito',
  debito: 'Cartão de Débito',
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  boleto: 'Boleto',
  mercadopago: 'Mercado Pago',
  picpay: 'PicPay',
  valealimentacao: 'Vale Alimentação',
  transferencia: 'Transferência'
};

export function validatePaymentMethod(tokens: string[], fullMessage: string): PaymentValidationResult {
  const detectedPayments: { tipo: string; confianca: number; palavras: string[] }[] = [];
  const conflitos: string[] = [];
  
  for (const [categoria, keywords] of Object.entries(PAYMENT_KEYWORDS)) {
    const foundKeywords: string[] = [];
    let maxConfianca = 0;
    
    for (const keyword of keywords) {
      for (const token of tokens) {
        if (token.includes(keyword) || keyword.includes(token)) {
          foundKeywords.push(keyword);
          maxConfianca = Math.max(maxConfianca, token === keyword ? 1.0 : 0.7);
        }
      }
      
      if (fullMessage.includes(keyword)) {
        foundKeywords.push(keyword);
        maxConfianca = Math.max(maxConfianca, 0.8);
      }
    }
    
    if (foundKeywords.length > 0) {
      detectedPayments.push({ tipo: categoria, confianca: maxConfianca, palavras: foundKeywords });
    }
  }
  
  // Verificar conflitos entre crédito e débito
  const hasCredito = detectedPayments.some(p => p.tipo === 'credito');
  const hasDebito = detectedPayments.some(p => p.tipo === 'debito');
  
  if (hasCredito && hasDebito) {
    conflitos.push('Conflito detectado entre crédito e débito');
  }
  
  const selectedPayment = detectedPayments.reduce((prev, current) => 
    (current.confianca > prev.confianca) ? current : prev, 
    { tipo: '', confianca: 0, palavras: [] }
  );
  
  return {
    formaPagamento: selectedPayment.tipo ? PAYMENT_NAMES[selectedPayment.tipo] || 'Outros' : '',
    confianca: selectedPayment.confianca,
    conflitos
  };
}

export function isPaymentToken(token: string): boolean {
  for (const keywords of Object.values(PAYMENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (token.includes(keyword) || keyword.includes(token)) {
        return true;
      }
    }
  }
  return false;
}
