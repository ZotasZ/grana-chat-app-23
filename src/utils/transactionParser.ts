
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
  
  // Regex para capturar: descrição + valor + forma de pagamento (opcional)
  const patterns = [
    // Padrão: "ifood 44,00 pix" ou "ifood 44.00 pix"
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
      const formaPagamento = match[3]?.trim();
      
      if (isNaN(valor) || valor <= 0) continue;
      
      // Buscar categoria baseada na descrição
      const categoriaInfo = findCategory(descricao);
      
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
