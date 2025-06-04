
export interface Transaction {
  id: string;
  valor: number;
  categoria: string;
  descricao: string;
  data: Date;
  tipo: 'gasto' | 'receita';
  formaPagamento?: string;
  // Novos campos para parcelas
  parcelado?: boolean;
  parcelaAtual?: number;
  totalParcelas?: number;
  valorOriginal?: number;
  grupoParcelaId?: string;
}

export interface Category {
  nome: string;
  limite: number;
  cor: string;
  icone: string;
}

export interface Meta {
  nome: string;
  valorAlvo: number;
  valorAtual: number;
  prazo: Date;
}

export interface ChatMessage {
  id: string;
  tipo: 'user' | 'assistant';
  conteudo: string;
  timestamp: Date;
  transacao?: Transaction;
}
