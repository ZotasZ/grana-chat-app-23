
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, ChatMessage } from '../types/Transaction';

interface TransactionStore {
  transactions: Transaction[];
  chatMessages: ChatMessage[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addParceladoTransaction: (transaction: Omit<Transaction, 'id'>, totalParcelas: number) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  getTransactionsByCategory: () => Record<string, Transaction[]>;
  getRecentTransactions: (limit?: number) => Transaction[];
  getTotalByPeriod: (days: number) => number;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      chatMessages: [],
      
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      addParceladoTransaction: (baseTransaction, totalParcelas) => {
        const grupoParcelaId = Date.now().toString();
        const transactions: Transaction[] = [];
        
        for (let i = 0; i < totalParcelas; i++) {
          const dataTransacao = new Date();
          dataTransacao.setMonth(dataTransacao.getMonth() + i);
          
          const transaction: Transaction = {
            ...baseTransaction,
            id: `${grupoParcelaId}-${i + 1}`,
            data: dataTransacao,
            parcelado: true,
            parcelaAtual: i + 1,
            totalParcelas: totalParcelas,
            valorOriginal: baseTransaction.valor * totalParcelas,
            grupoParcelaId: grupoParcelaId,
          };
          
          transactions.push(transaction);
        }
        
        set((state) => ({
          transactions: [...state.transactions, ...transactions],
        }));
      },
      
      addChatMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
        }));
      },
      
      getTransactionsByCategory: () => {
        const { transactions } = get();
        return transactions.reduce((acc, transaction) => {
          const category = transaction.categoria;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(transaction);
          return acc;
        }, {} as Record<string, Transaction[]>);
      },
      
      getRecentTransactions: (limit = 10) => {
        const { transactions } = get();
        return transactions
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .slice(0, limit);
      },
      
      getTotalByPeriod: (days) => {
        const { transactions } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return transactions
          .filter((t) => new Date(t.data) >= cutoffDate && t.tipo === 'gasto')
          .reduce((sum, t) => sum + t.valor, 0);
      },
    }),
    {
      name: 'transaction-store',
    }
  )
);
