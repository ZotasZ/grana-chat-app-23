
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
  formaPagamento?: string;
  banco?: string;
  codigoBarras?: string;
}

export interface RecurringBillFormData {
  nome: string;
  valor: number;
  categoria: string;
  dataVencimento: number;
  descricao?: string;
  formaPagamento?: string;
  banco?: string;
  codigoBarras?: string;
}
