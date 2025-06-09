
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RecurringBill, ParcelaFormData } from '../types/RecurringBill';
import { supabase } from '@/integrations/supabase/client';

interface RecurringBillsStore {
  bills: RecurringBill[];
  loading: boolean;
  addBill: (bill: Omit<RecurringBill, 'id' | 'criadoEm' | 'proximoVencimento'>) => Promise<void>;
  addParceladoBill: (data: ParcelaFormData) => Promise<void>;
  updateBill: (id: string, updates: Partial<RecurringBill>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  toggleBillStatus: (id: string) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
  fetchBills: () => Promise<void>;
  getActiveBills: () => RecurringBill[];
  getBillsToPayThisMonth: () => RecurringBill[];
  getParcelasByGroup: (grupoId: string) => RecurringBill[];
  addImageToBill: (id: string, imageUrl: string) => Promise<void>;
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
      loading: false,
      
      fetchBills: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from('recurring_bills')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching bills:', error);
            return;
          }

          const bills = data.map(bill => ({
            id: bill.id,
            nome: bill.nome,
            valor: parseFloat(bill.valor.toString()),
            categoria: bill.categoria,
            dataVencimento: bill.data_vencimento,
            descricao: bill.descricao,
            imagemBoleto: bill.imagem_boleto,
            ativo: bill.ativo,
            criadoEm: new Date(bill.criado_em),
            proximoVencimento: new Date(bill.proximo_vencimento),
            alertaUmDia: bill.alerta_um_dia,
            alertaDiaVencimento: bill.alerta_dia_vencimento,
            ehParcelado: bill.eh_parcelado,
            valorTotal: bill.valor_total ? parseFloat(bill.valor_total.toString()) : undefined,
            numeroParcelas: bill.numero_parcelas,
            parcelaAtual: bill.parcela_atual,
            grupoParcelaId: bill.grupo_parcela_id,
            statusPagamento: bill.status_pagamento as 'pendente' | 'pago',
          }));

          set({ bills });
        } catch (error) {
          console.error('Error fetching bills:', error);
        } finally {
          set({ loading: false });
        }
      },
      
      addBill: async (billData) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const proximoVencimento = calculateNextDueDate(billData.dataVencimento);
        
        try {
          const { data, error } = await supabase
            .from('recurring_bills')
            .insert({
              user_id: user.id,
              nome: billData.nome,
              valor: billData.valor,
              categoria: billData.categoria,
              data_vencimento: billData.dataVencimento,
              descricao: billData.descricao,
              ativo: billData.ativo,
              proximo_vencimento: proximoVencimento.toISOString().split('T')[0],
              alerta_um_dia: billData.alertaUmDia,
              alerta_dia_vencimento: billData.alertaDiaVencimento,
              eh_parcelado: billData.ehParcelado,
              valor_total: billData.valorTotal,
              numero_parcelas: billData.numeroParcelas,
              parcela_atual: billData.parcelaAtual,
              grupo_parcela_id: billData.grupoParcelaId,
              status_pagamento: 'pendente'
            })
            .select()
            .single();

          if (error) {
            console.error('Error adding bill:', error);
            return;
          }

          // Refresh bills
          await get().fetchBills();
        } catch (error) {
          console.error('Error adding bill:', error);
        }
      },

      addParceladoBill: async (data) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const grupoParcelaId = `parcela-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const parcelas = [];

        for (let i = 0; i < data.numeroParcelas; i++) {
          const proximoVencimento = calculateNextDueDate(data.dataVencimento, i);
          
          parcelas.push({
            user_id: user.id,
            nome: `${data.nome} (${i + 1}/${data.numeroParcelas})`,
            valor: data.valorTotal / data.numeroParcelas,
            categoria: data.categoria,
            data_vencimento: data.dataVencimento,
            descricao: data.descricao,
            ativo: true,
            proximo_vencimento: proximoVencimento.toISOString().split('T')[0],
            alerta_um_dia: data.alertaUmDia,
            alerta_dia_vencimento: data.alertaDiaVencimento,
            eh_parcelado: true,
            valor_total: data.valorTotal,
            numero_parcelas: data.numeroParcelas,
            parcela_atual: i + 1,
            grupo_parcela_id: grupoParcelaId,
            status_pagamento: 'pendente'
          });
        }

        try {
          const { error } = await supabase
            .from('recurring_bills')
            .insert(parcelas);

          if (error) {
            console.error('Error adding parceled bill:', error);
            return;
          }

          // Refresh bills
          await get().fetchBills();
        } catch (error) {
          console.error('Error adding parceled bill:', error);
        }
      },

      updateBill: async (id, updates) => {
        try {
          const updateData: any = {};
          
          if (updates.nome) updateData.nome = updates.nome;
          if (updates.valor !== undefined) updateData.valor = updates.valor;
          if (updates.categoria) updateData.categoria = updates.categoria;
          if (updates.dataVencimento) {
            updateData.data_vencimento = updates.dataVencimento;
            updateData.proximo_vencimento = calculateNextDueDate(updates.dataVencimento).toISOString().split('T')[0];
          }
          if (updates.descricao !== undefined) updateData.descricao = updates.descricao;
          if (updates.ativo !== undefined) updateData.ativo = updates.ativo;
          if (updates.alertaUmDia !== undefined) updateData.alerta_um_dia = updates.alertaUmDia;
          if (updates.alertaDiaVencimento !== undefined) updateData.alerta_dia_vencimento = updates.alertaDiaVencimento;
          if (updates.statusPagamento) updateData.status_pagamento = updates.statusPagamento;
          if (updates.imagemBoleto !== undefined) updateData.imagem_boleto = updates.imagemBoleto;

          const { error } = await supabase
            .from('recurring_bills')
            .update(updateData)
            .eq('id', id);

          if (error) {
            console.error('Error updating bill:', error);
            return;
          }

          // Refresh bills
          await get().fetchBills();
        } catch (error) {
          console.error('Error updating bill:', error);
        }
      },

      deleteBill: async (id) => {
        try {
          const { error } = await supabase
            .from('recurring_bills')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting bill:', error);
            return;
          }

          // Refresh bills
          await get().fetchBills();
        } catch (error) {
          console.error('Error deleting bill:', error);
        }
      },

      toggleBillStatus: async (id) => {
        const bill = get().bills.find(b => b.id === id);
        if (!bill) return;

        await get().updateBill(id, { ativo: !bill.ativo });
      },

      markAsPaid: async (id) => {
        const bill = get().bills.find(b => b.id === id);
        if (!bill) return;

        const newStatus = bill.statusPagamento === 'pago' ? 'pendente' : 'pago';
        await get().updateBill(id, { statusPagamento: newStatus });
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

      addImageToBill: async (id, imageUrl) => {
        await get().updateBill(id, { imagemBoleto: imageUrl });
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
