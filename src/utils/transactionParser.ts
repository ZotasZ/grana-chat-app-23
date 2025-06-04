
import { Transaction } from '../types/Transaction';

const CATEGORIAS: Record<string, { categoria: string; icone: string; cor: string }> = {
  // Alimentação
  'ifood': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'uber eats': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'restaurante': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'lanche': { categoria: 'Alimentação', icone: '🥪', cor: '#FF6B6B' },
  'pizza': { categoria: 'Alimentação', icone: '🍕', cor: '#FF6B6B' },
  'mercado': { categoria: 'Alimentação', icone: '🛒', cor: '#FF6B6B' },
  'supermercado': { categoria: 'Alimentação', icone: '🛒', cor: '#FF6B6B' },
  'padaria': { categoria: 'Alimentação', icone: '🥖', cor: '#FF6B6B' },
  
  // Transporte
  'uber': { categoria: 'Transporte', icone: '🚗', cor: '#4ECDC4' },
  '99': { categoria: 'Transporte', icone: '🚗', cor: '#4ECDC4' },
  'taxi': { categoria: 'Transporte', icone: '🚕', cor: '#4ECDC4' },
  'gasolina': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'combustível': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'ônibus': { categoria: 'Transporte', icone: '🚌', cor: '#4ECDC4' },
  'metro': { categoria: 'Transporte', icone: '🚇', cor: '#4ECDC4' },
  'estacionamento': { categoria: 'Transporte', icone: '🅿️', cor: '#4ECDC4' },
  
  // Saúde
  'farmácia': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  'médico': { categoria: 'Saúde', icone: '👨‍⚕️', cor: '#45B7D1' },
  'dentista': { categoria: 'Saúde', icone: '🦷', cor: '#45B7D1' },
  'exame': { categoria: 'Saúde', icone: '🔬', cor: '#45B7D1' },
  'remédio': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  
  // Lazer
  'cinema': { categoria: 'Lazer', icone: '🎬', cor: '#F7DC6F' },
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
  'internet': { categoria: 'Casa', icone: '📶', cor: '#82E0AA' },
  'limpeza': { categoria: 'Casa', icone: '🧽', cor: '#82E0AA' },
};

// Mapas para normalizar formas de pagamento
const PAYMENT_KEYWORDS = {
  // Cartão de Crédito
  'credito': 'crédito',
  'crédito': 'crédito',
  'credit': 'crédito',
  
  // Cartão de Débito  
  'debito': 'débito',
  'débito': 'débito',
  'debit': 'débito',
  
  // PIX
  'pix': 'pix',
  
  // Dinheiro
  'dinheiro': 'dinheiro',
  'especie': 'dinheiro',
  'espécie': 'dinheiro',
  'cash': 'dinheiro',
  
  // Boleto
  'boleto': 'boleto',
  'bancario': 'boleto bancário',
  'bancário': 'boleto bancário',
  
  // Débito em conta
  'automatico': 'débito automático',
  'automático': 'débito automático',
  'conta': 'débito em conta',
  
  // Carteiras digitais
  'mercado pago': 'Mercado Pago',
  'picpay': 'PicPay',
  'paypal': 'PayPal',
  'pagseguro': 'PagSeguro',
  'google pay': 'Google Pay',
  'apple pay': 'Apple Pay',
  'samsung pay': 'Samsung Pay',
  'ame': 'Ame Digital',
  'ame digital': 'Ame Digital',
  'inter pay': 'Inter Pay',
  'recarga pay': 'Recarga Pay',
  
  // Vales
  'vale': 'vale',
  'alimentacao': 'vale alimentação',
  'alimentação': 'vale alimentação',
  'refeicao': 'vale refeição',
  'refeição': 'vale refeição',
  'sodexo': 'Sodexo',
  'alelo': 'Alelo',
  'ticket': 'Ticket',
  'vr': 'VR',
  'ben': 'Ben',
  'flash': 'Flash',
  'up brasil': 'Up Brasil',
  
  // Bancos
  'nubank': 'Nubank',
  'inter': 'Inter',
  'itau': 'Itaú',
  'itaú': 'Itaú',
  'santander': 'Santander',
  'bradesco': 'Bradesco',
  'caixa': 'Caixa',
  'bb': 'Banco do Brasil',
  'banco do brasil': 'Banco do Brasil',
  'c6': 'C6 Bank',
  'original': 'Original',
  'next': 'Next',
  'neon': 'Neon',
  'picpay': 'PicPay',
  
  // Bandeiras
  'visa': 'Visa',
  'mastercard': 'Mastercard',
  'elo': 'Elo',
  'amex': 'American Express',
  'hipercard': 'Hipercard',
  
  // Outros
  'transferencia': 'transferência bancária',
  'transferência': 'transferência bancária',
  'cheque': 'cheque',
  'saldo': 'saldo',
  'cashback': 'cashback',
  'credito loja': 'crédito loja',
  'crédito loja': 'crédito loja',
  'virtual': 'virtual'
};

export function parseTransactionMessage(message: string): { 
  descricao: string; 
  valor: number; 
  formaPagamento?: string;
  categoria: string;
  icone: string;
  cor: string;
} | null {
  // Remove espaços extras e converte para minúsculas
  const cleanMessage = message.trim().toLowerCase();
  
  // Regex mais flexível para capturar: descrição + valor + forma de pagamento (múltiplas palavras)
  const patterns = [
    // Padrão: "ifood 44,00 cartao inter credito" ou qualquer coisa após o valor
    /^(.+?)\s+([\d,\.]+)\s+(.+)$/,
    // Padrão: "ifood 44,00" ou "ifood 44.00"
    /^(.+?)\s+([\d,\.]+)$/,
  ];
  
  for (const pattern of patterns) {
    const match = cleanMessage.match(pattern);
    if (match) {
      const descricao = match[1].trim();
      const valorStr = match[2].replace(',', '.');
      const valor = parseFloat(valorStr);
      const formaPagamentoRaw = match[3]?.trim();
      
      if (isNaN(valor) || valor <= 0) continue;
      
      // Buscar categoria baseada na descrição
      const categoriaInfo = findCategory(descricao);
      
      // Processar forma de pagamento se fornecida
      const formaPagamento = formaPagamentoRaw ? processPaymentMethod(formaPagamentoRaw) : undefined;
      
      return {
        descricao,
        valor,
        formaPagamento,
        ...categoriaInfo
      };
    }
  }
  
  return null;
}

function processPaymentMethod(rawPayment: string): string {
  const tokens = rawPayment.toLowerCase().split(/\s+/);
  const processedTokens: string[] = [];
  
  // Primeiro passo: identificar e normalizar palavras-chave conhecidas
  for (const token of tokens) {
    const normalized = PAYMENT_KEYWORDS[token];
    if (normalized) {
      processedTokens.push(normalized);
    } else {
      // Manter tokens não reconhecidos mas capitalizar primeira letra
      processedTokens.push(token.charAt(0).toUpperCase() + token.slice(1));
    }
  }
  
  // Segundo passo: formar a descrição final da forma de pagamento
  let result = processedTokens.join(' ');
  
  // Casos especiais para cartões
  if (result.includes('crédito') || result.includes('débito')) {
    // Se tem banco + tipo: "Inter crédito" -> "Cartão Inter Crédito"
    // Se tem bandeira + tipo: "Visa crédito" -> "Cartão Visa Crédito"  
    // Se só tem tipo: "crédito" -> "Cartão de Crédito"
    
    if (!result.toLowerCase().includes('cartão') && !result.toLowerCase().includes('cartao')) {
      if (processedTokens.length === 1) {
        result = `Cartão de ${result}`;
      } else {
        result = `Cartão ${result}`;
      }
    }
  }
  
  // Casos especiais para PIX
  if (result.toLowerCase().includes('pix') && processedTokens.length > 1) {
    // "pix inter" -> "PIX Inter"
    result = result.replace(/pix/i, 'PIX');
  } else if (result.toLowerCase() === 'pix') {
    result = 'PIX';
  }
  
  return result;
}

function findCategory(descricao: string): { categoria: string; icone: string; cor: string } {
  const descricaoLower = descricao.toLowerCase();
  
  // Buscar correspondência exata ou parcial
  for (const [key, info] of Object.entries(CATEGORIAS)) {
    if (descricaoLower.includes(key) || key.includes(descricaoLower)) {
      return info;
    }
  }
  
  // Categoria padrão
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
