
// Palavras que indicam frases naturais para filtrar
const NATURAL_WORDS = [
  'gastei', 'paguei', 'comprei', 'pago', 'gasto', 'compra',
  'no', 'na', 'do', 'da', 'com', 'via', 'pelo', 'pela',
  'hoje', 'ontem', 'amanha', 'amanhã', 'semana', 'mês', 'mes',
  'reais', 'real', 'r$', 'rs', 'brl',
  'pagamento', 'transação', 'transacao', 'valor', 'cartao', 'cartão'
];

export interface ParsedMessageData {
  valor: number;
  totalParcelas: number;
  tokens: string[];
  cleanMessage: string;
}

export function parseMessageData(message: string): ParsedMessageData {
  // Limpar e normalizar a mensagem
  let cleanMessage = message.trim().toLowerCase();
  
  // Verificar se há informação de parcelas (ex: "2x", "3x", "10x")
  const parcelaMatch = cleanMessage.match(/(\d{1,2})x\b/);
  let totalParcelas = 1;
  
  if (parcelaMatch) {
    totalParcelas = parseInt(parcelaMatch[1]);
    cleanMessage = cleanMessage.replace(parcelaMatch[0], '').trim();
  }
  
  // Remover símbolos de moeda
  cleanMessage = cleanMessage.replace(/r\$\s*/g, '');
  
  // Extrair valor usando regex mais robusta
  const valorMatches = cleanMessage.match(/\b(\d{1,6}(?:[,\.]\d{1,2})?)\b/g);
  let valor = 0;
  let valorStr = '';
  
  if (valorMatches && valorMatches.length > 0) {
    valorStr = valorMatches[0].replace(',', '.');
    valor = parseFloat(valorStr);
  }
  
  // Remover o valor da mensagem para processar o resto
  let remainingMessage = cleanMessage;
  if (valorStr) {
    remainingMessage = cleanMessage.replace(valorStr.replace('.', ','), '').replace(valorStr, '');
  }
  
  // Dividir em tokens válidos
  const tokens = remainingMessage
    .split(/\s+/)
    .filter(token => 
      token.length > 0 && 
      !NATURAL_WORDS.includes(token) &&
      token !== valorStr &&
      token !== valorStr.replace('.', ',')
    );
  
  return {
    valor,
    totalParcelas,
    tokens,
    cleanMessage: remainingMessage
  };
}
