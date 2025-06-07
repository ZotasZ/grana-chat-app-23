
import React, { useState } from 'react';
import { X, Save, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useRecurringBillsStore } from '@/stores/recurringBillsStore';
import { ParcelaFormData } from '@/types/RecurringBill';

interface ParcelaFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const categorias = [
  'Financiamento', 'Empréstimo', 'Cartão de Crédito', 'Compras',
  'Casa', 'Veículo', 'Educação', 'Saúde', 'Outros'
];

export function ParcelaForm({ onClose, onSuccess }: ParcelaFormProps) {
  const { addParceladoBill } = useRecurringBillsStore();
  const [formData, setFormData] = useState<ParcelaFormData>({
    nome: '',
    valorTotal: 0,
    numeroParcelas: 1,
    dataVencimento: 1,
    categoria: '',
    descricao: '',
    alertaUmDia: true,
    alertaDiaVencimento: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || formData.valorTotal <= 0 || formData.numeroParcelas <= 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    addParceladoBill(formData);
    onSuccess();
  };

  const handleInputChange = (field: keyof ParcelaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const valorParcela = formData.valorTotal / (formData.numeroParcelas || 1);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Nova Dívida Parcelada
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Dívida *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Financiamento do carro"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="valorTotal">Valor Total (R$) *</Label>
              <Input
                id="valorTotal"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorTotal}
                onChange={(e) => handleInputChange('valorTotal', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Label htmlFor="numeroParcelas">Número de Parcelas *</Label>
              <Input
                id="numeroParcelas"
                type="number"
                min="1"
                max="60"
                value={formData.numeroParcelas}
                onChange={(e) => handleInputChange('numeroParcelas', parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div>
              <Label>Valor por Parcela</Label>
              <div className="p-2 bg-gray-50 rounded border text-sm font-medium">
                R$ {valorParcela.toFixed(2).replace('.', ',')}
              </div>
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
              placeholder="Informações adicionais sobre a dívida"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Configurações de Alertas</Label>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alertaUmDia">Alerta 1 dia antes</Label>
                <p className="text-sm text-gray-600">Receber notificação um dia antes do vencimento</p>
              </div>
              <Switch
                id="alertaUmDia"
                checked={formData.alertaUmDia}
                onCheckedChange={(checked) => handleInputChange('alertaUmDia', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alertaDiaVencimento">Alerta no dia</Label>
                <p className="text-sm text-gray-600">Receber notificação no dia do vencimento</p>
              </div>
              <Switch
                id="alertaDiaVencimento"
                checked={formData.alertaDiaVencimento}
                onCheckedChange={(checked) => handleInputChange('alertaDiaVencimento', checked)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 whatsapp-green text-white">
              <Save className="w-4 h-4 mr-2" />
              Criar Parcelas
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
