
import { Transaction } from '../types/Transaction';
import { findCategory, getSuggestedValue } from './categoryUtils';
import { validatePaymentMethod, isPaymentToken, PaymentValidationResult } from './paymentMethods';
import { parseMessageData } from './messageParser';

interface ParsedTransaction {
  descricao: string; 
  valor: number; 
  formaPagamento?: string;
  categoria: string;
  icone: string;
  cor: string;
  validacao?: PaymentValidationResult;
  totalParcelas?: number;
  valorParcela?: number;
}

export function parseTransactionMessage(message: string): ParsedTransaction | null {
  console.log('🔍 Parsing message:', message);
  
  const { valor: rawValor, totalParcelas, tokens, cleanMessage } = parseMessageData(message);
  
  console.log('📊 Dados extraídos:', { rawValor, totalParcelas, tokens });
  
  if (tokens.length === 0) {
    console.log('❌ Nenhum token válido encontrado');
    return null;
  }
  
  // Identificar forma de pagamento
  const paymentValidation = validatePaymentMethod(tokens, cleanMessage);
  
  // Remover tokens de pagamento dos tokens de descrição
  const descriptionTokens = paymentValidation.formaPagamento 
    ? tokens.filter(token => !isPaymentToken(token))
    : tokens;
  
  // Criar descrição
  let descricao = descriptionTokens.join(' ').trim();
  
  if (!descricao) {
    descricao = tokens.filter(token => !isPaymentToken(token)).join(' ') || 'Gasto';
  }
  
  // Limpar descrição
  descricao = descricao.replace(/\b(de|do|da|no|na|com|via|pelo|pela)\b/g, '').trim();
  
  console.log('📝 Descrição final:', descricao);
  
  // Buscar categoria
  const categoriaInfo = findCategory(descricao);
  console.log('📂 Categoria identificada:', categoriaInfo.categoria);
  
  // Calcular valores
  let valor = rawValor;
  if (valor === 0) {
    valor = getSuggestedValue(categoriaInfo.categoria);
    console.log('💡 Valor sugerido:', valor);
  }
  
  const valorParcela = totalParcelas > 1 ? valor / totalParcelas : valor;
  
  const result: ParsedTransaction = {
    descricao,
    valor: valorParcela,
    formaPagamento: paymentValidation.formaPagamento,
    validacao: paymentValidation,
    totalParcelas: totalParcelas > 1 ? totalParcelas : undefined,
    valorParcela: totalParcelas > 1 ? valorParcela : undefined,
    ...categoriaInfo
  };
  
  console.log('✅ Resultado final:', result);
  return result;
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
