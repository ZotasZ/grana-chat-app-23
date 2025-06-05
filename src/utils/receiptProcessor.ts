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

// Padrões expandidos para todos os tipos de comprovantes brasileiros
const RECEIPT_PATTERNS = {
  // PIX - Padrões mais específicos
  pix: {
    keywords: ['pix', 'pix enviado', 'pix recebido', 'transferencia instantanea', 'chave pix', 'qr code', 'codigo pix'],
    valuePattern: /(?:r\$|valor|quantia|total)[\s:]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(?:data\s+do\s+pagamento|data)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4})|(\d{2}\/\d{2}\/\d{4})/i,
    codePattern: /(?:id\s+da\s+transacao|codigo|identificador)[\s:]*([a-z0-9]{8,})/i,
    receiverPattern: /(?:quem\s+recebeu|nome|recebedor)[\s:]*([^\n\r]+)/i,
    institutionPattern: /(caixa\s+economica\s+federal|banco\s+do\s+brasil|itau|bradesco|santander|nubank|inter)/i
  },

  // Transferência TED/DOC
  transferencia: {
    keywords: ['ted', 'doc', 'transferencia', 'conta corrente', 'transferencia entre contas'],
    valuePattern: /(?:valor|quantia|total)[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/,
    bankPattern: /(banco|bradesco|itau|santander|nubank|inter|bb|caixa)/i,
    accountPattern: /(?:conta|ag|agencia)[\s:]*(\d+)/i
  },

  // Cartão de crédito/débito
  cartao: {
    keywords: ['visa', 'mastercard', 'elo', 'cartao', 'credito', 'debito', 'compra', 'estabelecimento'],
    valuePattern: /(?:valor|total|rs)[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/,
    establishmentPattern: /(?:estabelecimento|loja|comercio|local)[\s:]*([^\n\r]+)/i,
    cardPattern: /(?:final|cartao)[\s:]*(\d{4})/i
  },

  // Boleto bancário
  boleto: {
    keywords: ['boleto', 'cobranca', 'vencimento', 'codigo de barras', 'linha digitavel'],
    valuePattern: /(?:valor|total|documento)[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(?:vencimento|data)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    barcodePattern: /(\d{5}\.\d{5}\s\d{5}\.\d{6}\s\d{5}\.\d{6}\s\d\s\d{14})/,
    beneficiaryPattern: /(?:beneficiario|cedente)[\s:]*([^\n\r]+)/i
  },

  // Comprovante de pagamento bancário
  pagamento: {
    keywords: ['comprovante de pagamento', 'pagamento', 'sisbb', 'sistema de informacoes', 'auto-atendimento', 'convenio', 'codigo de barras', 'autenticacao'],
    valuePattern: /(?:valor\s+total|total|valor)[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(?:data\s+do\s+pagamento|data)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    authPattern: /(?:autenticacao|documento)[\s:]*([a-z0-9.]+)/i,
    bankPattern: /(banco\s+do\s+brasil|bb|sisbb|itau|bradesco|santander|caixa|nubank)/i,
    beneficiaryPattern: /(?:convenio|favorecido)[\s:]*([^\n\r]+)/i
  },

  // Nota fiscal eletrônica
  nota_fiscal: {
    keywords: ['nota fiscal', 'nfe', 'nfc-e', 'cupom fiscal', 'danfe'],
    valuePattern: /(?:total|valor\s+total|total\s+geral)[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(?:data\s+de\s+emissao|emissao)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    cnpjPattern: /cnpj[\s:]*(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i,
    establishmentPattern: /(?:razao\s+social|empresa)[\s:]*([^\n\r]+)/i
  },

  // RPA (Recibo de Pagamento Autônomo)
  rpa: {
    keywords: ['rpa', 'recibo de pagamento autonomo', 'prestacao de servico', 'autonomo'],
    valuePattern: /(?:valor|total|liquido)[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(?:data|competencia)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    cpfPattern: /cpf[\s:]*(\d{3}\.\d{3}\.\d{3}-\d{2})/i,
    servicePattern: /(?:servico|atividade)[\s:]*([^\n\r]+)/i
  },

  // Recibo genérico
  recibo: {
    keywords: ['recibo', 'comprovante', 'pagamento', 'quitacao'],
    valuePattern: /(?:valor|total|quantia|rs)[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    datePattern: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/,
    referencePattern: /(?:referente|ref)[\s:]*([^\n\r]+)/i
  }
};

export async function processReceiptImage(imageFile: File): Promise<ExtractedReceiptData> {
  try {
    console.log('🔍 Processando imagem do comprovante...');
    
    // Realizar OCR na imagem com configurações otimizadas
    const { data: { text } } = await Tesseract.recognize(imageFile, 'por', {
      logger: m => console.log('OCR:', m),
      psm: 6 // Assume uma única coluna de texto uniforme
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
  const textLower = text.toLowerCase().replace(/\s+/g, ' ');
  let bestMatch = { tipo: 'recibo' as const, confianca: 0 };
  
  console.log('🔍 Analisando texto:', textLower);
  
  // Identificar tipo de comprovante
  for (const [tipo, pattern] of Object.entries(RECEIPT_PATTERNS)) {
    let score = 0;
    let matches = 0;
    
    // Verificar palavras-chave com pesos diferentes
    for (const keyword of pattern.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        matches++;
        
        // Palavras-chave específicas têm peso maior
        if (keyword === 'pix enviado' || keyword === 'pix recebido' || keyword === 'comprovante de pagamento') {
          score += 0.4;
        } else if (keyword === 'pix' || keyword === 'ted' || keyword === 'doc') {
          score += 0.3;
        } else {
          score += 0.15;
        }
      }
    }
    
    // Verificar padrões estruturais
    if (pattern.valuePattern && text.match(pattern.valuePattern)) {
      score += 0.25;
    }
    if (pattern.datePattern && text.match(pattern.datePattern)) {
      score += 0.15;
    }
    
    // Verificar padrões específicos do tipo
    if ('institutionPattern' in pattern && pattern.institutionPattern && text.match(pattern.institutionPattern)) {
      score += 0.2;
    }
    if ('codePattern' in pattern && pattern.codePattern && text.match(pattern.codePattern)) {
      score += 0.2;
    }
    if ('receiverPattern' in pattern && pattern.receiverPattern && text.match(pattern.receiverPattern)) {
      score += 0.15;
    }
    
    const confianca = Math.min(score, 1.0);
    
    console.log(`📊 ${tipo}: ${matches} matches, score: ${score.toFixed(2)}, confiança: ${confianca.toFixed(2)}`);
    
    if (confianca > bestMatch.confianca) {
      bestMatch = { tipo: tipo as any, confianca };
    }
  }
  
  console.log('🎯 Tipo identificado:', bestMatch.tipo, 'com confiança:', bestMatch.confianca);
  
  // Extrair informações específicas
  const result: ExtractedReceiptData = {
    tipo: bestMatch.tipo as any,
    confianca: bestMatch.confianca
  };
  
  // Extrair valor com múltiplos padrões
  const valorPatterns = [
    /pix\s+enviado\s+r\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /r\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /valor[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /total[\s:]*r?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /(\d{1,3}(?:\.\d{3})*,\d{2})/g
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
  
  // Extrair data
  const dataPatterns = [
    /(?:data\s+do\s+pagamento|data)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(?:sexta|segunda|terca|quarta|quinta|sabado|domingo),?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(\d{2}\/\d{2}\/\d{4})/g
  ];
  
  for (const dataPattern of dataPatterns) {
    const dataMatch = text.match(dataPattern);
    if (dataMatch) {
      result.data = dataMatch[1];
      console.log('📅 Data extraída:', result.data);
      break;
    }
  }
  
  // Extrair recebedor/beneficiário
  const recebedorPatterns = [
    /quem\s+recebeu[\s\n]*nome[\s:]*([^\n\r]+)/i,
    /nome[\s:]*([^\n\r]+)/i,
    /recebedor[\s:]*([^\n\r]+)/i,
    /beneficiario[\s:]*([^\n\r]+)/i,
    /favorecido[\s:]*([^\n\r]+)/i,
    /convenio[\s:]*([^\n\r]+)/i
  ];
  
  for (const recebedorPattern of recebedorPatterns) {
    const recebedorMatch = text.match(recebedorPattern);
    if (recebedorMatch) {
      const nome = recebedorMatch[1].trim();
      // Filtrar linhas que não parecem nomes
      if (nome.length > 2 && !nome.match(/^\d+$/) && !nome.includes('***')) {
        result.recebedor = nome;
        console.log('👤 Recebedor extraído:', result.recebedor);
        break;
      }
    }
  }
  
  // Extrair instituição financeira
  const instituicaoPatterns = [
    /instituicao[\s:]*([^\n\r]+)/i,
    /banco[\s:]*([^\n\r]+)/i,
    /(caixa\s+economica\s+federal|banco\s+do\s+brasil|itau|bradesco|santander|nubank|inter)/i
  ];
  
  for (const instituicaoPattern of instituicaoPatterns) {
    const instituicaoMatch = text.match(instituicaoPattern);
    if (instituicaoMatch) {
      result.banco = instituicaoMatch[1] || instituicaoMatch[0];
      console.log('🏦 Banco extraído:', result.banco);
      break;
    }
  }
  
  // Extrair código da transação
  const codigoPatterns = [
    /id\s+da\s+transacao[\s:]*([a-z0-9]+)/i,
    /codigo[\s:]*([a-z0-9.]+)/i,
    /autenticacao[\s:]*([a-z0-9.]+)/i,
    /documento[\s:]*(\d+)/i
  ];
  
  for (const codigoPattern of codigoPatterns) {
    const codigoMatch = text.match(codigoPattern);
    if (codigoMatch) {
      result.codigoTransacao = codigoMatch[1];
      console.log('🔢 Código extraído:', result.codigoTransacao);
      break;
    }
  }
  
  // Definir forma de pagamento baseada no tipo
  const paymentMethods = {
    pix: 'PIX',
    transferencia: 'Transferência',
    ted: 'TED',
    doc: 'DOC',
    cartao: 'Cartão',
    boleto: 'Boleto',
    pagamento: 'Pagamento Bancário',
    nota_fiscal: 'Cartão',
    rpa: 'Transferência',
    recibo: 'Dinheiro'
  };
  
  result.formaPagamento = paymentMethods[bestMatch.tipo as keyof typeof paymentMethods];
  
  // Gerar descrição
  if (result.recebedor) {
    result.descricao = `${result.formaPagamento} - ${result.recebedor}`;
  } else if (result.banco) {
    result.descricao = `${result.formaPagamento} via ${result.banco}`;
  } else {
    result.descricao = `${result.formaPagamento}`;
  }
  
  console.log('✅ Dados finais extraídos:', result);
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
