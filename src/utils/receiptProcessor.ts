
import Tesseract from 'tesseract.js';

export interface ExtractedReceiptData {
  valor?: number;
  data?: string;
  pagador?: string;
  recebedor?: string;
  formaPagamento?: string;
  banco?: string;
  codigoTransacao?: string;
  descricao?: string;
  tipo?: 'transferencia' | 'boleto' | 'cartao' | 'pix' | 'recibo' | 'nota_fiscal' | 'rpa' | 'pagamento';
  confianca: number;
}

// Padrões otimizados para identificação de tipos de comprovante
const RECEIPT_PATTERNS = {
  pix: {
    keywords: ['pix', 'pix enviado', 'pix recebido', 'transferencia instantanea', 'chave pix'],
    valueWeight: 0.25,
    structuralWeight: 0.35,
    keywordWeight: 0.4
  },
  transferencia: {
    keywords: ['ted', 'doc', 'transferencia', 'conta corrente'],
    valueWeight: 0.25,
    structuralWeight: 0.25,
    keywordWeight: 0.3
  },
  cartao: {
    keywords: ['visa', 'mastercard', 'elo', 'cartao', 'credito', 'debito', 'compra'],
    valueWeight: 0.25,
    structuralWeight: 0.25,
    keywordWeight: 0.3
  },
  boleto: {
    keywords: ['boleto', 'cobranca', 'vencimento', 'codigo de barras'],
    valueWeight: 0.25,
    structuralWeight: 0.25,
    keywordWeight: 0.3
  },
  pagamento: {
    keywords: ['comprovante de pagamento', 'pagamento', 'sisbb', 'autenticacao'],
    valueWeight: 0.25,
    structuralWeight: 0.25,
    keywordWeight: 0.3
  }
};

const EXTRACTION_PATTERNS = {
  value: [
    /pix\s+enviado\s+r\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /r\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /valor[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /total[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i
  ],
  date: [
    /(?:data\s+do\s+pagamento|data)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(?:sexta|segunda|terca|quarta|quinta|sabado|domingo),?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(\d{2}\/\d{2}\/\d{4})/g
  ],
  receiver: [
    /quem\s+recebeu[\s\n]*nome[\s:]*([^\n\r]+)/i,
    /nome[\s:]*([^\n\r]+)/i,
    /recebedor[\s:]*([^\n\r]+)/i,
    /beneficiario[\s:]*([^\n\r]+)/i
  ],
  bank: [
    /instituicao[\s:]*([^\n\r]+)/i,
    /(caixa\s+economica\s+federal|banco\s+do\s+brasil|itau|bradesco|santander|nubank|inter)/i
  ],
  code: [
    /id\s+da\s+transacao[\s:]*([a-z0-9]+)/i,
    /codigo[\s:]*([a-z0-9.]+)/i,
    /autenticacao[\s:]*([a-z0-9.]+)/i
  ]
};

const PAYMENT_METHODS = {
  pix: 'PIX',
  transferencia: 'Transferência',
  cartao: 'Cartão',
  boleto: 'Boleto',
  pagamento: 'Pagamento Bancário'
} as const;

export async function processReceiptImage(imageFile: File): Promise<ExtractedReceiptData> {
  try {
    console.log('🔍 Processando imagem do comprovante...');
    
    const { data: { text } } = await Tesseract.recognize(imageFile, 'por', {
      logger: m => console.log('OCR:', m)
    });
    
    console.log('📝 Texto extraído:', text);
    return analyzeReceiptText(text);
  } catch (error) {
    console.error('❌ Erro ao processar imagem:', error);
    return {
      confianca: 0,
      descricao: 'Erro ao processar imagem'
    };
  }
}

function analyzeReceiptText(text: string): ExtractedReceiptData {
  const textLower = text.toLowerCase().replace(/\s+/g, ' ');
  
  // Identificar tipo de comprovante
  const detectedType = detectReceiptType(textLower);
  
  // Extrair informações
  const extractedData: ExtractedReceiptData = {
    tipo: detectedType.tipo as any,
    confianca: detectedType.confianca,
    valor: extractValue(text),
    data: extractDate(text),
    recebedor: extractReceiver(text),
    banco: extractBank(text),
    codigoTransacao: extractCode(text)
  };

  // Definir forma de pagamento e descrição
  extractedData.formaPagamento = PAYMENT_METHODS[detectedType.tipo as keyof typeof PAYMENT_METHODS];
  extractedData.descricao = generateDescription(extractedData);

  console.log('✅ Dados finais extraídos:', extractedData);
  return extractedData;
}

function detectReceiptType(text: string): { tipo: string; confianca: number } {
  let bestMatch = { tipo: 'recibo', confianca: 0 };
  
  for (const [tipo, config] of Object.entries(RECEIPT_PATTERNS)) {
    let score = 0;
    let keywordMatches = 0;
    
    // Verificar palavras-chave
    for (const keyword of config.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        keywordMatches++;
        score += keyword === 'pix enviado' || keyword === 'pix recebido' ? 0.4 : 0.15;
      }
    }
    
    // Verificar padrões estruturais
    if (EXTRACTION_PATTERNS.value.some(pattern => text.match(pattern))) {
      score += config.valueWeight;
    }
    
    const confianca = Math.min(score, 1.0);
    
    if (confianca > bestMatch.confianca) {
      bestMatch = { tipo, confianca };
    }
  }
  
  return bestMatch;
}

function extractValue(text: string): number | undefined {
  for (const pattern of EXTRACTION_PATTERNS.value) {
    const match = text.match(pattern);
    if (match) {
      const valorStr = match[1].replace(/\./g, '').replace(',', '.');
      const valor = parseFloat(valorStr);
      if (!isNaN(valor) && valor > 0) {
        console.log('💰 Valor extraído:', valor);
        return valor;
      }
    }
  }
  return undefined;
}

function extractDate(text: string): string | undefined {
  for (const pattern of EXTRACTION_PATTERNS.date) {
    const match = text.match(pattern);
    if (match) {
      console.log('📅 Data extraída:', match[1]);
      return match[1];
    }
  }
  return undefined;
}

function extractReceiver(text: string): string | undefined {
  for (const pattern of EXTRACTION_PATTERNS.receiver) {
    const match = text.match(pattern);
    if (match) {
      const nome = match[1].trim();
      if (nome.length > 2 && !nome.match(/^\d+$/) && !nome.includes('***')) {
        console.log('👤 Recebedor extraído:', nome);
        return nome;
      }
    }
  }
  return undefined;
}

function extractBank(text: string): string | undefined {
  for (const pattern of EXTRACTION_PATTERNS.bank) {
    const match = text.match(pattern);
    if (match) {
      const banco = match[1] || match[0];
      console.log('🏦 Banco extraído:', banco);
      return banco;
    }
  }
  return undefined;
}

function extractCode(text: string): string | undefined {
  for (const pattern of EXTRACTION_PATTERNS.code) {
    const match = text.match(pattern);
    if (match) {
      console.log('🔢 Código extraído:', match[1]);
      return match[1];
    }
  }
  return undefined;
}

function generateDescription(data: ExtractedReceiptData): string {
  if (data.recebedor) {
    return `${data.formaPagamento} - ${data.recebedor}`;
  } else if (data.banco) {
    return `${data.formaPagamento} via ${data.banco}`;
  }
  return data.formaPagamento || 'Transação';
}

export function formatReceiptSuggestion(data: ExtractedReceiptData): string {
  const parts = [];
  
  if (data.recebedor) {
    parts.push(data.recebedor.toLowerCase());
  } else if (data.descricao) {
    parts.push(data.descricao.toLowerCase());
  }
  
  if (data.valor) {
    parts.push(data.valor.toString());
  }
  
  if (data.formaPagamento) {
    parts.push(data.formaPagamento.toLowerCase());
  }
  
  return parts.join(' ');
}
