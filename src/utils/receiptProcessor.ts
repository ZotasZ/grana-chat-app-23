
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
  tipo?: 'transferencia' | 'boleto' | 'cartao' | 'pix' | 'recibo' | 'nota_fiscal' | 'rpa';
  confianca: number;
}

// Padrões para identificar diferentes tipos de comprovantes
const RECEIPT_PATTERNS = {
  // PIX
  pix: {
    keywords: ['pix', 'transferencia instantanea', 'chave pix', 'qr code'],
    valuePattern: /(?:valor|quantia|total)[:.\s]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/,
    codePattern: /(?:codigo|id|identificador)[:.\s]*([a-z0-9]{8,})/i
  },
  
  // Transferência bancária
  transferencia: {
    keywords: ['transferencia', 'ted', 'doc', 'conta corrente'],
    valuePattern: /(?:valor|quantia|total)[:.\s]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/,
    bankPattern: /(banco|bradesco|itau|santander|nubank|inter|bb|caixa)/i
  },
  
  // Cartão
  cartao: {
    keywords: ['visa', 'mastercard', 'elo', 'cartao', 'credito', 'debito'],
    valuePattern: /(?:valor|total)[:.\s]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/,
    establishmentPattern: /(?:estabelecimento|loja|comercio)[:.\s]*([^\n\r]+)/i
  },
  
  // Boleto
  boleto: {
    keywords: ['boleto', 'cobranca', 'vencimento', 'codigo de barras'],
    valuePattern: /(?:valor|total)[:.\s]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(?:vencimento|data)[:.\s]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    barcodePattern: /(\d{5}\.\d{5}\s\d{5}\.\d{6}\s\d{5}\.\d{6}\s\d\s\d{14})/
  }
};

export async function processReceiptImage(imageFile: File): Promise<ExtractedReceiptData> {
  try {
    console.log('🔍 Processando imagem do comprovante...');
    
    // Realizar OCR na imagem
    const { data: { text } } = await Tesseract.recognize(imageFile, 'por', {
      logger: m => console.log('OCR:', m)
    });
    
    console.log('📝 Texto extraído:', text);
    
    // Analisar o texto e extrair informações
    const extractedData = analyzeReceiptText(text);
    
    return extractedData;
  } catch (error) {
    console.error('❌ Erro ao processar imagem:', error);
    return {
      confianca: 0,
      descricao: 'Erro ao processar imagem'
    };
  }
}

function analyzeReceiptText(text: string): ExtractedReceiptData {
  const textLower = text.toLowerCase();
  let bestMatch = { tipo: 'recibo' as const, confianca: 0 };
  
  // Identificar tipo de comprovante
  for (const [tipo, pattern] of Object.entries(RECEIPT_PATTERNS)) {
    const keywordMatches = pattern.keywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    ).length;
    
    const confianca = keywordMatches / pattern.keywords.length;
    
    if (confianca > bestMatch.confianca) {
      bestMatch = { tipo: tipo as any, confianca };
    }
  }
  
  console.log('🎯 Tipo identificado:', bestMatch.tipo, 'com confiança:', bestMatch.confianca);
  
  // Extrair informações específicas
  const pattern = RECEIPT_PATTERNS[bestMatch.tipo as keyof typeof RECEIPT_PATTERNS];
  const result: ExtractedReceiptData = {
    tipo: bestMatch.tipo as any,
    confianca: bestMatch.confianca
  };
  
  // Extrair valor
  if (pattern?.valuePattern) {
    const valorMatch = text.match(pattern.valuePattern);
    if (valorMatch) {
      const valorStr = valorMatch[1].replace(/\./g, '').replace(',', '.');
      result.valor = parseFloat(valorStr);
      console.log('💰 Valor extraído:', result.valor);
    }
  }
  
  // Extrair data
  if (pattern?.datePattern) {
    const dataMatch = text.match(pattern.datePattern);
    if (dataMatch) {
      result.data = dataMatch[1];
      console.log('📅 Data extraída:', result.data);
    }
  }
  
  // Extrair banco/estabelecimento
  if ('bankPattern' in pattern && pattern.bankPattern) {
    const bancoMatch = text.match(pattern.bankPattern);
    if (bancoMatch) {
      result.banco = bancoMatch[1];
      console.log('🏦 Banco extraído:', result.banco);
    }
  }
  
  if ('establishmentPattern' in pattern && pattern.establishmentPattern) {
    const estabelecimentoMatch = text.match(pattern.establishmentPattern);
    if (estabelecimentoMatch) {
      result.recebedor = estabelecimentoMatch[1].trim();
      console.log('🏪 Estabelecimento extraído:', result.recebedor);
    }
  }
  
  // Extrair código de transação
  if ('codePattern' in pattern && pattern.codePattern) {
    const codigoMatch = text.match(pattern.codePattern);
    if (codigoMatch) {
      result.codigoTransacao = codigoMatch[1];
      console.log('🔢 Código extraído:', result.codigoTransacao);
    }
  }
  
  // Definir forma de pagamento baseada no tipo
  const paymentMethods = {
    pix: 'PIX',
    transferencia: 'Transferência',
    cartao: 'Cartão',
    boleto: 'Boleto',
    recibo: 'Dinheiro',
    nota_fiscal: 'Cartão',
    rpa: 'Transferência'
  };
  
  result.formaPagamento = paymentMethods[bestMatch.tipo as keyof typeof paymentMethods];
  
  // Gerar descrição baseada nas informações extraídas
  if (result.recebedor) {
    result.descricao = result.recebedor;
  } else if (result.banco) {
    result.descricao = `Pagamento via ${result.banco}`;
  } else {
    result.descricao = `Pagamento via ${result.formaPagamento}`;
  }
  
  console.log('✅ Dados extraídos:', result);
  return result;
}

export function formatReceiptSuggestion(data: ExtractedReceiptData): string {
  const parts = [];
  
  if (data.descricao) parts.push(data.descricao);
  if (data.valor) parts.push(data.valor.toString());
  if (data.formaPagamento) parts.push(data.formaPagamento.toLowerCase());
  
  return parts.join(' ');
}
