
export interface RecurringBill {
  id: string;
  nome: string;
  valor: number;
  categoria: string;
  dataVencimento: number; // dia do mês (1-31)
  descricao?: string;
  imagemBoleto?: string;
  ativo: boolean;
  criadoEm: Date;
  proximoVencimento: Date;
  // Novos campos para alertas
  alertaUmDia?: boolean;
  alertaDiaVencimento?: boolean;
  // Novos campos para parcelas
  ehParcelado?: boolean;
  valorTotal?: number;
  numeroParcelas?: number;
  parcelaAtual?: number;
  grupoParcelaId?: string;
  statusPagamento?: 'pendente' | 'pago';
}

export interface RecurringBillFormData {
  nome: string;
  valor: number;
  categoria: string;
  dataVencimento: number;
  descricao?: string;
  alertaUmDia?: boolean;
  alertaDiaVencimento?: boolean;
  // Campos para parcelas
  ehParcelado?: boolean;
  valorTotal?: number;
  numeroParcelas?: number;
}

export interface ParcelaFormData {
  nome: string;
  valorTotal: number;
  numeroParcelas: number;
  dataVencimento: number;
  categoria: string;
  descricao?: string;
  alertaUmDia?: boolean;
  alertaDiaVencimento?: boolean;
}
