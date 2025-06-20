
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, ChatMessage } from '../types/Transaction';

interface TransactionStore {
  transactions: Transaction[];
  chatMessages: ChatMessage[];
  selectedMonth: Date;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addParceladoTransaction: (transaction: Omit<Transaction, 'id'>, totalParcelas: number) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  getTransactionsByCategory: (month?: Date) => Record<string, Transaction[]>;
  getRecentTransactions: (limit?: number) => Transaction[];
  getTotalByPeriod: (days: number, fromDate?: Date) => number;
  getTransactionsByMonth: (month: Date) => Transaction[];
  setSelectedMonth: (month: Date) => void;
  getNextMonthsWithTransactions: () => Date[];
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      chatMessages: [],
      selectedMonth: new Date(),
      
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      addParceladoTransaction: (baseTransaction, totalParcelas) => {
        const grupoParcelaId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const transactions: Transaction[] = [];
        
        for (let i = 0; i < totalParcelas; i++) {
          const dataTransacao = new Date();
          dataTransacao.setMonth(dataTransacao.getMonth() + i + 1);
          
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
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
        }));
      },
      
      getTransactionsByCategory: (month?: Date) => {
        const { transactions } = get();
        let filteredTransactions = transactions;
        
        if (month) {
          const monthDate = month instanceof Date ? month : new Date(month);
          filteredTransactions = transactions.filter(t => {
            const tDate = new Date(t.data);
            return tDate.getMonth() === monthDate.getMonth() && 
                   tDate.getFullYear() === monthDate.getFullYear();
          });
        }
        
        return filteredTransactions.reduce((acc, transaction) => {
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
      
      getTotalByPeriod: (days, fromDate = new Date()) => {
        const { transactions } = get();
        const cutoffDate = new Date(fromDate);
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return transactions
          .filter((t) => {
            const tDate = new Date(t.data);
            return tDate >= cutoffDate && tDate <= fromDate && t.tipo === 'gasto';
          })
          .reduce((sum, t) => sum + t.valor, 0);
      },

      getTransactionsByMonth: (month: Date) => {
        const { transactions } = get();
        const monthDate = month instanceof Date ? month : new Date(month);
        return transactions.filter(t => {
          const tDate = new Date(t.data);
          return tDate.getMonth() === monthDate.getMonth() && 
                 tDate.getFullYear() === monthDate.getFullYear();
        });
      },

      setSelectedMonth: (month: Date) => {
        const dateObject = month instanceof Date ? month : new Date(month);
        set({ selectedMonth: dateObject });
      },

      getNextMonthsWithTransactions: () => {
        const { transactions } = get();
        const months = new Set<string>();
        const currentDate = new Date();
        
        transactions.forEach(t => {
          const tDate = new Date(t.data);
          if (tDate >= currentDate || 
              (tDate.getMonth() === currentDate.getMonth() && 
               tDate.getFullYear() === currentDate.getFullYear())) {
            const monthKey = `${tDate.getFullYear()}-${tDate.getMonth()}`;
            months.add(monthKey);
          }
        });

        return Array.from(months)
          .map(key => {
            const [year, month] = key.split('-');
            return new Date(parseInt(year), parseInt(month), 1);
          })
          .sort((a, b) => a.getTime() - b.getTime());
      },

      deleteTransaction: (id: string) => {
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }));
      },

      updateTransaction: (id: string, updates: Partial<Transaction>) => {
        set((state) => ({
          transactions: state.transactions.map(t => 
            t.id === id ? { ...t, ...updates } : t
          )
        }));
      }
    }),
    {
      name: 'transaction-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const data = JSON.parse(str);
            if (data.state?.selectedMonth) {
              data.state.selectedMonth = new Date(data.state.selectedMonth);
            }
            if (data.state?.transactions) {
              data.state.transactions = data.state.transactions.map((t: any) => ({
                ...t,
                data: new Date(t.data)
              }));
            }
            if (data.state?.chatMessages) {
              data.state.chatMessages = data.state.chatMessages.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp)
              }));
            }
            return data;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
