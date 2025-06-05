
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

// Padrões para identificar diferentes tipos de comprovantes
const RECEIPT_PATTERNS = {
  // Comprovante de pagamento bancário (BB, Itaú, etc)
  pagamento: {
    keywords: ['comprovante de pagamento', 'pagamento', 'sisbb', 'sistema de informacoes', 'auto-atendimento', 'convenio', 'codigo de barras', 'autenticacao'],
    valuePattern: /(?:valor\s+total|total)\s*:?\s*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(?:data\s+do\s+pagamento|data)\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    authPattern: /(?:autenticacao|documento)\s*:?\s*([a-z0-9.]+)/i,
    bankPattern: /(banco\s+do\s+brasil|bb|sisbb|itau|bradesco|santander|caixa|nubank)/i
  },
  
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
  
  // Identificar tipo de comprovante com peso maior para padrões específicos
  for (const [tipo, pattern] of Object.entries(RECEIPT_PATTERNS)) {
    let score = 0;
    let keywordMatches = 0;
    
    // Contar matches de palavras-chave
    for (const keyword of pattern.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        keywordMatches++;
        // Dar peso maior para palavras-chave específicas
        if (keyword === 'comprovante de pagamento' || keyword === 'sisbb') {
          score += 0.3;
        } else {
          score += 0.1;
        }
      }
    }
    
    // Verificar se tem padrões específicos (valor, data, etc)
    if (pattern.valuePattern && text.match(pattern.valuePattern)) {
      score += 0.3;
    }
    if (pattern.datePattern && text.match(pattern.datePattern)) {
      score += 0.2;
    }
    if ('bankPattern' in pattern && pattern.bankPattern && text.match(pattern.bankPattern)) {
      score += 0.3;
    }
    if ('authPattern' in pattern && pattern.authPattern && text.match(pattern.authPattern)) {
      score += 0.2;
    }
    
    const confianca = Math.min(score, 1.0); // Limitar a 1.0
    
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
  
  // Extrair valor com padrões mais flexíveis
  const valorPatterns = [
    /valor\s+total\s*:?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /total\s*:?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /(\d{1,3}(?:\.\d{3})*,\d{2})/g // Captura qualquer valor no formato brasileiro
  ];
  
  for (const valorPattern of valorPatterns) {
    const valorMatch = text.match(valorPattern);
    if (valorMatch) {
      const valorStr = valorMatch[1].replace(/\./g, '').replace(',', '.');
      result.valor = parseFloat(valorStr);
      console.log('💰 Valor extraído:', result.valor);
      break;
    }
  }
  
  // Extrair data com padrões mais flexíveis
  const dataPatterns = [
    /data\s+do\s+pagamento\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(\d{2}\/\d{2}\/\d{4})/g // Captura qualquer data no formato DD/MM/YYYY
  ];
  
  for (const dataPattern of dataPatterns) {
    const dataMatch = text.match(dataPattern);
    if (dataMatch) {
      result.data = dataMatch[1];
      console.log('📅 Data extraída:', result.data);
      break;
    }
  }
  
  // Extrair banco/estabelecimento
  const bancoPatterns = [
    /sisbb/i,
    /banco\s+do\s+brasil/i,
    /sistema\s+de\s+informacoes\s+banco\s+do\s+brasil/i,
    /(itau|bradesco|santander|caixa|nubank)/i
  ];
  
  for (const bancoPattern of bancoPatterns) {
    const bancoMatch = text.match(bancoPattern);
    if (bancoMatch) {
      result.banco = bancoMatch[0].includes('sisbb') || bancoMatch[0].toLowerCase().includes('banco do brasil') 
        ? 'Banco do Brasil' 
        : bancoMatch[1] || bancoMatch[0];
      console.log('🏦 Banco extraído:', result.banco);
      break;
    }
  }
  
  // Extrair recebedor/convenio
  const convenioMatch = text.match(/convenio\s+([^\n\r]+)/i);
  if (convenioMatch) {
    result.recebedor = convenioMatch[1].trim();
    console.log('🏪 Convênio extraído:', result.recebedor);
  }
  
  // Extrair código de autenticação/documento
  const authPatterns = [
    /autenticacao\s+sisbb\s*:?\s*([a-z0-9.]+)/i,
    /documento\s*:?\s*(\d+)/i
  ];
  
  for (const authPattern of authPatterns) {
    const authMatch = text.match(authPattern);
    if (authMatch) {
      result.codigoTransacao = authMatch[1];
      console.log('🔢 Código extraído:', result.codigoTransacao);
      break;
    }
  }
  
  // Definir forma de pagamento baseada no tipo
  const paymentMethods = {
    pagamento: 'Pagamento Bancário',
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
    result.descricao = `Pagamento - ${result.recebedor}`;
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
