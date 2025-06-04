
import { Transaction } from '../types/Transaction';

const CATEGORIAS: Record<string, { categoria: string; icone: string; cor: string }> = {
  // Alimentação
  'ifood': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'ifd': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'uber eats': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'restaurante': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'lanche': { categoria: 'Alimentação', icone: '🥪', cor: '#FF6B6B' },
  'almoço': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'almoco': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'jantar': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'café': { categoria: 'Alimentação', icone: '☕', cor: '#FF6B6B' },
  'cafe': { categoria: 'Alimentação', icone: '☕', cor: '#FF6B6B' },
  'pizza': { categoria: 'Alimentação', icone: '🍕', cor: '#FF6B6B' },
  'mercado': { categoria: 'Alimentação', icone: '🛒', cor: '#FF6B6B' },
  'supermercado': { categoria: 'Alimentação', icone: '🛒', cor: '#FF6B6B' },
  'padaria': { categoria: 'Alimentação', icone: '🥖', cor: '#FF6B6B' },
  'lanchonete': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'comida': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  
  // Transporte
  'uber': { categoria: 'Transporte', icone: '🚗', cor: '#4ECDC4' },
  '99': { categoria: 'Transporte', icone: '🚗', cor: '#4ECDC4' },
  'taxi': { categoria: 'Transporte', icone: '🚕', cor: '#4ECDC4' },
  'gasolina': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'combustível': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'combustivel': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'ônibus': { categoria: 'Transporte', icone: '🚌', cor: '#4ECDC4' },
  'onibus': { categoria: 'Transporte', icone: '🚌', cor: '#4ECDC4' },
  'metro': { categoria: 'Transporte', icone: '🚇', cor: '#4ECDC4' },
  'metrô': { categoria: 'Transporte', icone: '🚇', cor: '#4ECDC4' },
  'estacionamento': { categoria: 'Transporte', icone: '🅿️', cor: '#4ECDC4' },
  'transporte': { categoria: 'Transporte', icone: '🚗', cor: '#4ECDC4' },
  
  // Saúde
  'farmácia': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  'farmacia': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  'médico': { categoria: 'Saúde', icone: '👨‍⚕️', cor: '#45B7D1' },
  'medico': { categoria: 'Saúde', icone: '👨‍⚕️', cor: '#45B7D1' },
  'dentista': { categoria: 'Saúde', icone: '🦷', cor: '#45B7D1' },
  'exame': { categoria: 'Saúde', icone: '🔬', cor: '#45B7D1' },
  'remédio': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  'remedio': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  
  // Lazer
  'cinema': { categoria: 'Lazer', icone: '🎬', cor: '#F7DC6F' },
  'cin': { categoria: 'Lazer', icone: '🎬', cor: '#F7DC6F' },
  'streaming': { categoria: 'Lazer', icone: '📺', cor: '#F7DC6F' },
  'netflix': { categoria: 'Lazer', icone: '📺', cor: '#F7DC6F' },
  'spotify': { categoria: 'Lazer', icone: '🎵', cor: '#F7DC6F' },
  'parque': { categoria: 'Lazer', icone: '🎢', cor: '#F7DC6F' },
  'bar': { categoria: 'Lazer', icone: '🍺', cor: '#F7DC6F' },
  
  // Educação
  'curso': { categoria: 'Educação', icone: '📚', cor: '#BB8FCE' },
  'livro': { categoria: 'Educação', icone: '📖', cor: '#BB8FCE' },
  'faculdade': { categoria: 'Educação', icone: '🎓', cor: '#BB8FCE' },
  
  // Casa
  'casa': { categoria: 'Casa', icone: '🏠', cor: '#82E0AA' },
  'aluguel': { categoria: 'Casa', icone: '🏠', cor: '#82E0AA' },
  'luz': { categoria: 'Casa', icone: '💡', cor: '#82E0AA' },
  'água': { categoria: 'Casa', icone: '💧', cor: '#82E0AA' },
  'agua': { categoria: 'Casa', icone: '💧', cor: '#82E0AA' },
  'internet': { categoria: 'Casa', icone: '📶', cor: '#82E0AA' },
  'limpeza': { categoria: 'Casa', icone: '🧽', cor: '#82E0AA' },
};

// Mapeamento robusto para formas de pagamento - separando claramente crédito e débito
const PAYMENT_KEYWORDS = {
  // CRÉDITO - palavras que indicam especificamente cartão de crédito
  credito: [
    'credito', 'crédito', 'credit', 'cc', 'cartao credito', 'cartão crédito',
    'cartao de credito', 'cartão de crédito', 'cartaocredito', 'cartãocrédito',
    'visa credito', 'visa crédito', 'master credito', 'mastercard credito',
    'elo credito', 'hipercard', 'american express', 'amex', 'cartcred',
    'cred', 'credcard', 'creditcard'
  ],
  
  // DÉBITO - palavras que indicam especificamente cartão de débito
  debito: [
    'debito', 'débito', 'debit', 'cd', 'cartao debito', 'cartão débito',
    'cartao de debito', 'cartão de débito', 'cartaodebito', 'cartãodébito',
    'visa debito', 'visa débito', 'master debito', 'mastercard debito',
    'elo debito', 'cartdeb', 'deb', 'debcard', 'debitcard'
  ],
  
  // PIX
  pix: [
    'pix', 'px', 'pixe', 'fotos', 'pixels', 'pic', 'pik'
  ],
  
  // DINHEIRO
  dinheiro: [
    'dinheiro', 'din', 'especie', 'espécie', 'cash', 'money', 'grana',
    'nota', 'papel', 'fisico', 'físico'
  ],
  
  // BOLETO
  boleto: [
    'boleto', 'bol', 'bloco', 'bancario', 'bancário', 'cobranca', 'cobrança'
  ],
  
  // CARTEIRAS DIGITAIS
  mercadopago: [
    'mercado pago', 'mercadopago', 'mpago', 'mp', 'mercado'
  ],
  
  picpay: [
    'picpay', 'pic pay', 'pp', 'pic'
  ],
  
  // VALE ALIMENTAÇÃO/REFEIÇÃO
  valealimentacao: [
    'vale alimentacao', 'vale alimentação', 'va', 'valeal', 'sodexo',
    'alelo', 'ticket', 'vr', 'ben', 'flash', 'up', 'verde'
  ],
  
  valerefeicao: [
    'vale refeicao', 'vale refeição', 'vr', 'valref', 'refeicao',
    'refeição', 'almoco', 'almoço'
  ],
  
  // TRANSFERÊNCIA
  transferencia: [
    'transferencia', 'transferência', 'ted', 'doc', 'transf'
  ],
  
  // OUTROS
  outros: [
    'cheque', 'automatico', 'automático', 'conta'
  ]
};

// Palavras que indicam frases naturais para filtrar
const NATURAL_WORDS = [
  'gastei', 'paguei', 'comprei', 'pago', 'gasto', 'compra',
  'no', 'na', 'do', 'da', 'com', 'via', 'pelo', 'pela',
  'hoje', 'ontem', 'amanha', 'amanhã', 'semana', 'mês', 'mes',
  'reais', 'real', 'r$', 'rs', 'brl',
  'pagamento', 'transação', 'transacao', 'valor'
];

interface PaymentValidationResult {
  formaPagamento: string;
  confianca: number;
  conflitos: string[];
}

export function parseTransactionMessage(message: string): { 
  descricao: string; 
  valor: number; 
  formaPagamento?: string;
  categoria: string;
  icone: string;
  cor: string;
  validacao?: PaymentValidationResult;
} | null {
  console.log('🔍 Parsing message:', message);
  
  // Limpar e normalizar a mensagem
  let cleanMessage = message.trim().toLowerCase();
  
  // Remover símbolos de moeda
  cleanMessage = cleanMessage.replace(/r\$\s*/g, '');
  
  // Extrair valor usando regex mais robusta
  const valorMatches = cleanMessage.match(/\b(\d{1,6}(?:[,\.]\d{1,2})?)\b/g);
  if (!valorMatches) {
    console.log('❌ Nenhum valor encontrado');
    return null;
  }
  
  // Pegar o primeiro valor encontrado e converter
  const valorStr = valorMatches[0].replace(',', '.');
  const valor = parseFloat(valorStr);
  
  if (isNaN(valor) || valor <= 0) {
    console.log('❌ Valor inválido:', valorStr);
    return null;
  }
  
  console.log('💰 Valor encontrado:', valor);
  
  // Remover o valor da mensagem para processar o resto
  let remainingMessage = cleanMessage.replace(valorStr.replace('.', ','), '').replace(valorStr, '');
  
  // Dividir em tokens
  const tokens = remainingMessage.split(/\s+/).filter(token => 
    token.length > 0 && 
    !NATURAL_WORDS.includes(token) &&
    token !== valorStr &&
    token !== valorStr.replace('.', ',')
  );
  
  console.log('🔤 Tokens extraídos:', tokens);
  
  // Identificar forma de pagamento com validação robusta
  const paymentValidation = validatePaymentMethod(tokens, remainingMessage);
  let descriptionTokens: string[] = [];
  
  // Remover tokens de pagamento dos tokens de descrição
  if (paymentValidation.formaPagamento) {
    descriptionTokens = tokens.filter(token => !isPaymentToken(token));
  } else {
    descriptionTokens = tokens;
  }
  
  // Criar descrição a partir dos tokens restantes
  let descricao = descriptionTokens.join(' ').trim();
  
  // Se não há descrição, usar uma genérica
  if (!descricao) {
    descricao = 'Gasto';
  } else {
    // Limpar descrição de palavras desnecessárias
    descricao = descricao.replace(/\b(de|do|da|no|na|com|via|pelo|pela)\b/g, '').trim();
  }
  
  console.log('📝 Descrição final:', descricao);
  
  // Buscar categoria baseada na descrição
  const categoriaInfo = findCategory(descricao);
  console.log('📂 Categoria identificada:', categoriaInfo.categoria);
  
  const result = {
    descricao,
    valor,
    formaPagamento: paymentValidation.formaPagamento,
    validacao: paymentValidation,
    ...categoriaInfo
  };
  
  console.log('✅ Resultado final:', result);
  return result;
}

function validatePaymentMethod(tokens: string[], fullMessage: string): PaymentValidationResult {
  console.log('🔧 Validando forma de pagamento:', tokens);
  
  const detectedPayments: { tipo: string; confianca: number; palavras: string[] }[] = [];
  const conflitos: string[] = [];
  
  // Verificar cada categoria de pagamento
  for (const [categoria, keywords] of Object.entries(PAYMENT_KEYWORDS)) {
    const foundKeywords: string[] = [];
    let maxConfianca = 0;
    
    for (const keyword of keywords) {
      // Verificar se algum token contém a palavra-chave
      for (const token of tokens) {
        if (token.includes(keyword) || keyword.includes(token)) {
          foundKeywords.push(keyword);
          // Confiança baseada na correspondência exata vs parcial
          const confianca = token === keyword ? 1.0 : 0.7;
          maxConfianca = Math.max(maxConfianca, confianca);
        }
      }
      
      // Verificar também na mensagem completa para frases
      if (fullMessage.includes(keyword)) {
        foundKeywords.push(keyword);
        maxConfianca = Math.max(maxConfianca, 0.8);
      }
    }
    
    if (foundKeywords.length > 0) {
      detectedPayments.push({
        tipo: categoria,
        confianca: maxConfianca,
        palavras: foundKeywords
      });
    }
  }
  
  console.log('🎯 Pagamentos detectados:', detectedPayments);
  
  // Verificar conflitos entre crédito e débito
  const hasCredito = detectedPayments.some(p => p.tipo === 'credito');
  const hasDebito = detectedPayments.some(p => p.tipo === 'debito');
  
  if (hasCredito && hasDebito) {
    conflitos.push('Conflito detectado entre crédito e débito');
    console.log('⚠️ Conflito: crédito e débito detectados simultaneamente');
  }
  
  // Selecionar o pagamento com maior confiança
  let selectedPayment = detectedPayments.reduce((prev, current) => 
    (current.confianca > prev.confianca) ? current : prev, 
    { tipo: '', confianca: 0, palavras: [] }
  );
  
  // Se há conflito, priorizar a palavra mais específica
  if (conflitos.length > 0) {
    const creditoPayment = detectedPayments.find(p => p.tipo === 'credito');
    const debitoPayment = detectedPayments.find(p => p.tipo === 'debito');
    
    // Se uma das palavras é mais específica, usar ela
    if (creditoPayment && debitoPayment) {
      const creditoEspecifico = creditoPayment.palavras.some(p => 
        ['cartao credito', 'cartão crédito', 'credito', 'crédito'].includes(p)
      );
      const debitoEspecifico = debitoPayment.palavras.some(p => 
        ['cartao debito', 'cartão débito', 'debito', 'débito'].includes(p)
      );
      
      if (creditoEspecifico && !debitoEspecifico) {
        selectedPayment = creditoPayment;
      } else if (debitoEspecifico && !creditoEspecifico) {
        selectedPayment = debitoPayment;
      }
    }
  }
  
  // Mapear para nome amigável
  const paymentNames: Record<string, string> = {
    credito: 'Cartão de Crédito',
    debito: 'Cartão de Débito',
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    boleto: 'Boleto',
    mercadopago: 'Mercado Pago',
    picpay: 'PicPay',
    valealimentacao: 'Vale Alimentação',
    valerefeicao: 'Vale Refeição',
    transferencia: 'Transferência',
    outros: 'Outros'
  };
  
  const result: PaymentValidationResult = {
    formaPagamento: selectedPayment.tipo ? paymentNames[selectedPayment.tipo] || 'Outros' : '',
    confianca: selectedPayment.confianca,
    conflitos
  };
  
  console.log('💳 Validação de pagamento:', result);
  return result;
}

function isPaymentToken(token: string): boolean {
  for (const keywords of Object.values(PAYMENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (token.includes(keyword) || keyword.includes(token)) {
        return true;
      }
    }
  }
  return false;
}

function findCategory(descricao: string): { categoria: string; icone: string; cor: string } {
  const descricaoLower = descricao.toLowerCase();
  
  console.log('🏷️ Buscando categoria para:', descricaoLower);
  
  // Buscar correspondência exata ou parcial
  for (const [key, info] of Object.entries(CATEGORIAS)) {
    if (descricaoLower.includes(key) || key.includes(descricaoLower)) {
      console.log('✅ Categoria encontrada:', info.categoria);
      return info;
    }
  }
  
  // Categoria padrão
  console.log('📂 Usando categoria padrão: Outros');
  return { categoria: 'Outros', icone: '💸', cor: '#95A5A6' };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
