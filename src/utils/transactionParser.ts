
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

// Mapeamento flexível para formas de pagamento
const PAYMENT_KEYWORDS: Record<string, string> = {
  // PIX e variações
  'pix': 'PIX',
  'fotos': 'PIX',
  'pixels': 'PIX',
  'px': 'PIX',
  'pixe': 'PIX',
  
  // Cartão de crédito
  'credito': 'Cartão de Crédito',
  'crédito': 'Cartão de Crédito',
  'credit': 'Cartão de Crédito',
  'cartao': 'Cartão de Crédito',
  'cartão': 'Cartão de Crédito',
  'card': 'Cartão de Crédito',
  'cartaoA': 'Cartão de Crédito',
  
  // Cartão de débito
  'debito': 'Cartão de Débito',
  'débito': 'Cartão de Débito',
  'debit': 'Cartão de Débito',
  'deb': 'Cartão de Débito',
  
  // Dinheiro
  'dinheiro': 'Dinheiro',
  'especie': 'Dinheiro',
  'espécie': 'Dinheiro',
  'cash': 'Dinheiro',
  'din': 'Dinheiro',
  
  // Boleto
  'boleto': 'Boleto',
  'bol': 'Boleto',
  'bloco': 'Boleto',
  'bancario': 'Boleto Bancário',
  'bancário': 'Boleto Bancário',
  
  // Carteiras digitais
  'mercado': 'Mercado Pago',
  'pago': 'Mercado Pago',
  'mpago': 'Mercado Pago',
  'picpay': 'PicPay',
  'paypal': 'PayPal',
  'pagseguro': 'PagSeguro',
  'google': 'Google Pay',
  'pay': 'Google Pay',
  'apple': 'Apple Pay',
  'samsung': 'Samsung Pay',
  'ame': 'Ame Digital',
  
  // Vales
  'vale': 'Vale',
  'alimentacao': 'Vale Alimentação',
  'alimentação': 'Vale Alimentação',
  'refeicao': 'Vale Refeição',
  'refeição': 'Vale Refeição',
  'sodexo': 'Sodexo',
  'sodx': 'Sodexo',
  'alelo': 'Alelo',
  'ticket': 'Ticket',
  'vr': 'VR',
  'ben': 'Ben',
  'flash': 'Flash',
  'up': 'Up',
  
  // Bancos específicos
  'nubank': 'Cartão Nubank',
  'nu': 'Cartão Nubank',
  'itau': 'Cartão Itaú',
  'itaú': 'Cartão Itaú',
  'santander': 'Cartão Santander',
  'bradesco': 'Cartão Bradesco',
  'caixa': 'Cartão Caixa',
  'cxa': 'Cartão Caixa',
  'bb': 'Cartão Banco do Brasil',
  'c6': 'Cartão C6 Bank',
  'inter': 'Cartão Inter',
  'next': 'Cartão Next',
  'neon': 'Cartão Neon',
  
  // Transferências
  'transferencia': 'Transferência Bancária',
  'transferência': 'Transferência Bancária',
  'ted': 'TED',
  'doc': 'DOC',
  
  // Outros
  'cheque': 'Cheque',
  'automatico': 'Débito Automático',
  'automático': 'Débito Automático',
  'conta': 'Débito em Conta'
};

// Palavras que indicam frases naturais para filtrar
const NATURAL_WORDS = [
  'gastei', 'paguei', 'comprei', 'pago', 'gasto', 'compra',
  'no', 'na', 'do', 'da', 'com', 'via', 'pelo', 'pela',
  'hoje', 'ontem', 'amanha', 'amanhã', 'semana', 'mês', 'mes',
  'reais', 'real', 'r$', 'rs', 'brl',
  'pagamento', 'transação', 'transacao', 'valor'
];

export function parseTransactionMessage(message: string): { 
  descricao: string; 
  valor: number; 
  formaPagamento?: string;
  categoria: string;
  icone: string;
  cor: string;
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
  
  // Identificar forma de pagamento
  let formaPagamento: string | undefined;
  let paymentTokens: string[] = [];
  let descriptionTokens: string[] = [];
  
  for (const token of tokens) {
    let foundPayment = false;
    
    // Verificar correspondência exata
    if (PAYMENT_KEYWORDS[token]) {
      paymentTokens.push(token);
      foundPayment = true;
    } else {
      // Verificar correspondência parcial
      for (const [key, payment] of Object.entries(PAYMENT_KEYWORDS)) {
        if (token.includes(key) || key.includes(token)) {
          paymentTokens.push(token);
          foundPayment = true;
          break;
        }
      }
    }
    
    if (!foundPayment) {
      descriptionTokens.push(token);
    }
  }
  
  // Processar forma de pagamento se encontrada
  if (paymentTokens.length > 0) {
    formaPagamento = processPaymentMethod(paymentTokens.join(' '));
    console.log('💳 Forma de pagamento identificada:', formaPagamento);
  }
  
  // Criar descrição a partir dos tokens restantes
  let descricao = descriptionTokens.join(' ').trim();
  
  // Se não há descrição, usar uma genérica baseada na categoria
  if (!descricao) {
    const categoriaInfo = findCategory('gasto');
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
    formaPagamento,
    ...categoriaInfo
  };
  
  console.log('✅ Resultado final:', result);
  return result;
}

function processPaymentMethod(rawPayment: string): string {
  console.log('🔧 Processando forma de pagamento:', rawPayment);
  
  const tokens = rawPayment.toLowerCase().split(/\s+/);
  let result = '';
  
  // Identificar o tipo principal de pagamento
  for (const token of tokens) {
    if (PAYMENT_KEYWORDS[token]) {
      result = PAYMENT_KEYWORDS[token];
      break;
    }
    
    // Verificar correspondência parcial
    for (const [key, payment] of Object.entries(PAYMENT_KEYWORDS)) {
      if (token.includes(key) || key.includes(token)) {
        result = payment;
        break;
      }
    }
    
    if (result) break;
  }
  
  // Se não encontrou nada específico, usar o primeiro token capitalizado
  if (!result) {
    result = tokens[0]?.charAt(0).toUpperCase() + tokens[0]?.slice(1) || 'Outros';
  }
  
  // Ajustar para incluir informações de banco se mencionado
  const bankTokens = tokens.filter(t => 
    ['nubank', 'nu', 'itau', 'itaú', 'santander', 'bradesco', 'caixa', 'cxa', 'inter', 'c6', 'bb'].includes(t)
  );
  
  if (bankTokens.length > 0 && !result.includes('Cartão')) {
    const bank = PAYMENT_KEYWORDS[bankTokens[0]];
    if (bank) {
      result = bank;
    }
  }
  
  console.log('💳 Forma de pagamento processada:', result);
  return result;
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
