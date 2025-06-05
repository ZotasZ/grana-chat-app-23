
import { ExtractedReceiptData } from './receiptProcessor';

export function formatReceiptSuggestion(data: ExtractedReceiptData): string {
  const parts: string[] = [];
  
  if (data.recebedor) {
    // Limpar e formatar o nome do recebedor
    const cleanReceiver = data.recebedor
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();
    parts.push(cleanReceiver);
  } else if (data.descricao && !data.descricao.includes('Erro')) {
    parts.push(data.descricao.toLowerCase());
  }
  
  if (data.valor && data.valor > 0) {
    parts.push(data.valor.toString().replace('.', ','));
  }
  
  if (data.formaPagamento) {
    const paymentMethod = data.formaPagamento.toLowerCase();
    parts.push(paymentMethod);
  }
  
  return parts.join(' ').trim();
}

export function createReceiptAnalysisMessage(data: ExtractedReceiptData): string {
  if (data.confianca <= 0.3 || !data.valor) {
    return `🤔 Não consegui extrair informações suficientes do comprovante.\n\nConfiança: ${Math.round(data.confianca * 100)}%\n\n💡 Tente:\n• Tirar uma foto mais nítida\n• Garantir boa iluminação\n• Ou registrar manualmente: "descrição valor forma_pagamento"`;
  }

  const suggestion = formatReceiptSuggestion(data);
  
  let message = `📋 Comprovante analisado!\n\n🔍 **Dados extraídos:**\n`;
  
  if (data.tipo) message += `📝 Tipo: ${data.tipo}\n`;
  if (data.valor) message += `💰 Valor: R$ ${data.valor.toFixed(2).replace('.', ',')}\n`;
  if (data.data) message += `📅 Data: ${data.data}\n`;
  if (data.formaPagamento) message += `💳 Forma: ${data.formaPagamento}\n`;
  if (data.recebedor) message += `🏪 Recebedor: ${data.recebedor}\n`;
  if (data.banco) message += `🏦 Banco: ${data.banco}\n`;
  if (data.codigoTransacao) message += `🔢 Código: ${data.codigoTransacao}\n`;
  
  message += `\n✅ **Sugestão de registro:**\n"${suggestion}"\n\n💡 Digite essa sugestão ou edite conforme necessário para registrar a transação.`;
  
  return message;
}
