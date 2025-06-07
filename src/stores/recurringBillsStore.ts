
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RecurringBill, ParcelaFormData } from '../types/RecurringBill';

interface RecurringBillsStore {
  bills: RecurringBill[];
  addBill: (bill: Omit<RecurringBill, 'id' | 'criadoEm' | 'proximoVencimento'>) => void;
  addParceladoBill: (data: ParcelaFormData) => void;
  updateBill: (id: string, updates: Partial<RecurringBill>) => void;
  deleteBill: (id: string) => void;
  toggleBillStatus: (id: string) => void;
  markAsPaid: (id: string) => void;
  getActiveBills: () => RecurringBill[];
  getBillsToPayThisMonth: () => RecurringBill[];
  getParcelasByGroup: (grupoId: string) => RecurringBill[];
  addImageToBill: (id: string, imageUrl: string) => void;
}

const calculateNextDueDate = (dayOfMonth: number, monthOffset: number = 0): Date => {
  const now = new Date();
  const nextDue = new Date(now.getFullYear(), now.getMonth() + monthOffset, dayOfMonth);
  
  if (nextDue < now && monthOffset === 0) {
    nextDue.setMonth(nextDue.getMonth() + 1);
  }
  
  return nextDue;
};

export const useRecurringBillsStore = create<RecurringBillsStore>()(
  persist(
    (set, get) => ({
      bills: [],
      
      addBill: (billData) => {
        const newBill: RecurringBill = {
          ...billData,
          id: `bill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          criadoEm: new Date(),
          proximoVencimento: calculateNextDueDate(billData.dataVencimento),
          statusPagamento: 'pendente',
        };
        
        set((state) => ({
          bills: [...state.bills, newBill],
        }));
      },

      addParceladoBill: (data) => {
        const grupoParcelaId = `parcela-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const parcelas: RecurringBill[] = [];

        for (let i = 0; i < data.numeroParcelas; i++) {
          const parcela: RecurringBill = {
            id: `${grupoParcelaId}-${i + 1}`,
            nome: `${data.nome} (${i + 1}/${data.numeroParcelas})`,
            valor: data.valorTotal / data.numeroParcelas,
            categoria: data.categoria,
            dataVencimento: data.dataVencimento,
            descricao: data.descricao,
            ativo: true,
            criadoEm: new Date(),
            proximoVencimento: calculateNextDueDate(data.dataVencimento, i),
            alertaUmDia: data.alertaUmDia,
            alertaDiaVencimento: data.alertaDiaVencimento,
            ehParcelado: true,
            valorTotal: data.valorTotal,
            numeroParcelas: data.numeroParcelas,
            parcelaAtual: i + 1,
            grupoParcelaId: grupoParcelaId,
            statusPagamento: 'pendente',
          };
          
          parcelas.push(parcela);
        }

        set((state) => ({
          bills: [...state.bills, ...parcelas],
        }));
      },

      updateBill: (id, updates) => {
        set((state) => ({
          bills: state.bills.map(bill => {
            if (bill.id === id) {
              const updatedBill = { ...bill, ...updates };
              
              if (updates.dataVencimento) {
                updatedBill.proximoVencimento = calculateNextDueDate(updates.dataVencimento);
              }
              
              return updatedBill;
            }
            return bill;
          })
        }));
      },

      deleteBill: (id) => {
        set((state) => ({
          bills: state.bills.filter(bill => bill.id !== id)
        }));
      },

      toggleBillStatus: (id) => {
        set((state) => ({
          bills: state.bills.map(bill =>
            bill.id === id ? { ...bill, ativo: !bill.ativo } : bill
          )
        }));
      },

      markAsPaid: (id) => {
        set((state) => ({
          bills: state.bills.map(bill =>
            bill.id === id ? { 
              ...bill, 
              statusPagamento: bill.statusPagamento === 'pago' ? 'pendente' : 'pago' 
            } : bill
          )
        }));
      },

      getActiveBills: () => {
        return get().bills.filter(bill => bill.ativo);
      },

      getBillsToPayThisMonth: () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return get().bills.filter(bill => {
          if (!bill.ativo) return false;
          const dueDate = bill.proximoVencimento;
          return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
        });
      },

      getParcelasByGroup: (grupoId) => {
        return get().bills
          .filter(bill => bill.grupoParcelaId === grupoId)
          .sort((a, b) => (a.parcelaAtual || 0) - (b.parcelaAtual || 0));
      },

      addImageToBill: (id, imageUrl) => {
        set((state) => ({
          bills: state.bills.map(bill =>
            bill.id === id ? { ...bill, imagemBoleto: imageUrl } : bill
          )
        }));
      }
    }),
    {
      name: 'recurring-bills-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const data = JSON.parse(str);
            if (data.state?.bills) {
              data.state.bills = data.state.bills.map((bill: any) => ({
                ...bill,
                criadoEm: new Date(bill.criadoEm),
                proximoVencimento: new Date(bill.proximoVencimento)
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
