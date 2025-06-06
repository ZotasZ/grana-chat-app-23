
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRecurringBillsStore } from '@/stores/recurringBillsStore';
import { RecurringBillFormData } from '@/types/RecurringBill';

interface RecurringBillFormProps {
  onClose: () => void;
  editingId?: string | null;
  onSuccess: () => void;
}

const categorias = [
  'Moradia',
  'Transporte', 
  'Serviços',
  'Financeiro',
  'Outros'
];

const formasPagamento = [
  'Débito Automático',
  'Boleto',
  'PIX',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Dinheiro',
  'Transferência Bancária'
];

export function RecurringBillForm({ onClose, editingId, onSuccess }: RecurringBillFormProps) {
  const { addBill, updateBill, bills } = useRecurringBillsStore();
  const [formData, setFormData] = useState<RecurringBillFormData>({
    nome: '',
    valor: 0,
    categoria: '',
    dataVencimento: 1,
    descricao: '',
    formaPagamento: '',
    banco: '',
    codigoBarras: ''
  });

  useEffect(() => {
    if (editingId) {
      const bill = bills.find(b => b.id === editingId);
      if (bill) {
        setFormData({
          nome: bill.nome,
          valor: bill.valor,
          categoria: bill.categoria,
          dataVencimento: bill.dataVencimento,
          descricao: bill.descricao || '',
          formaPagamento: bill.formaPagamento || '',
          banco: bill.banco || '',
          codigoBarras: bill.codigoBarras || ''
        });
      }
    }
  }, [editingId, bills]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || formData.valor <= 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingId) {
      updateBill(editingId, formData);
    } else {
      addBill({
        ...formData,
        ativo: true
      });
    }

    onSuccess();
  };

  const handleInputChange = (field: keyof RecurringBillFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {editingId ? 'Editar Conta Recorrente' : 'Nova Conta Recorrente'}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome da Conta *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Conta de Luz"
                required
              />
            </div>

            <div>
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => handleInputChange('valor', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria *</Label>
              <Select 
                value={formData.categoria} 
                onValueChange={(value) => handleInputChange('categoria', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dataVencimento">Dia do Vencimento *</Label>
              <Select 
                value={formData.dataVencimento.toString()} 
                onValueChange={(value) => handleInputChange('dataVencimento', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dia do mês" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Informações adicionais sobre a conta"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Select 
                value={formData.formaPagamento} 
                onValueChange={(value) => handleInputChange('formaPagamento', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Como você paga?" />
                </SelectTrigger>
                <SelectContent>
                  {formasPagamento.map(forma => (
                    <SelectItem key={forma} value={forma}>
                      {forma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="banco">Banco/Empresa</Label>
              <Input
                id="banco"
                value={formData.banco}
                onChange={(e) => handleInputChange('banco', e.target.value)}
                placeholder="Ex: CPFL, Sabesp, Itaú"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="codigoBarras">Código de Barras</Label>
            <Input
              id="codigoBarras"
              value={formData.codigoBarras}
              onChange={(e) => handleInputChange('codigoBarras', e.target.value)}
              placeholder="Cole aqui o código de barras do boleto"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 whatsapp-green text-white">
              <Save className="w-4 h-4 mr-2" />
              {editingId ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
