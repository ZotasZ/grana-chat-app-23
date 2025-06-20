
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useRecurringBillsStore } from '@/stores/recurringBillsStore';
import { RecurringBillFormData } from '@/types/RecurringBill';

interface RecurringBillFormProps {
  onClose: () => void;
  editingId?: string | null;
  onSuccess: () => void;
}

const categorias = [
  // Alimentação
  'Alimentação',
  'Supermercado',
  'Delivery',
  'Restaurante',
  'Padaria',
  'Açougue',
  'Hortifruti',
  
  // Casa e Moradia
  'Moradia',
  'Aluguel',
  'Energia Elétrica',
  'Água e Esgoto',
  'Gás',
  'Internet',
  'Telefone',
  'TV por Assinatura',
  'Condomínio',
  'IPTU',
  'Móveis',
  'Eletrodomésticos',
  'Decoração',
  'Limpeza',
  'Manutenção',
  
  // Transporte
  'Transporte',
  'Combustível',
  'Estacionamento',
  'Pedágio',
  'Seguro Veículo',
  'IPVA',
  'Financiamento Veículo',
  'Consórcio',
  'Uber/99',
  'Transporte Público',
  
  // Saúde
  'Saúde',
  'Plano de Saúde',
  'Medicamentos',
  'Consultas',
  'Exames',
  'Dentista',
  'Farmácia',
  'Academia',
  'Fisioterapia',
  
  // Educação
  'Educação',
  'Mensalidade Escolar',
  'Curso',
  'Livros',
  'Material Escolar',
  'Faculdade',
  'Pós-graduação',
  
  // Financeiro
  'Financeiro',
  'Empréstimo',
  'Financiamento',
  'Cartão de Crédito',
  'Conta Bancária',
  'Investimentos',
  'Anuidade',
  'Taxas Bancárias',
  
  // Seguros
  'Seguros',
  'Seguro Vida',
  'Seguro Residencial',
  'Seguro Saúde',
  
  // Lazer e Entretenimento
  'Lazer',
  'Streaming',
  'Netflix',
  'Spotify',
  'Cinema',
  'Shows',
  'Viagens',
  'Games',
  'Clube',
  
  // Vestuário e Beleza
  'Vestuário',
  'Roupas',
  'Calçados',
  'Acessórios',
  'Beleza',
  'Salão',
  'Produtos de Beleza',
  'Perfumaria',
  
  // Tecnologia
  'Tecnologia',
  'Software',
  'Aplicativos',
  'Equipamentos',
  'Celular',
  'Assinatura Digital',
  
  // Trabalho
  'Trabalho',
  'Material de Escritório',
  'Transporte Trabalho',
  'Almoço Trabalho',
  'Cursos Profissionais',
  
  // Pets
  'Pets',
  'Veterinário',
  'Ração',
  'Pet Shop',
  'Vacinas',
  'Banho e Tosa',
  
  // Presentes e Ocasiões
  'Presentes',
  'Aniversários',
  'Datas Comemorativas',
  'Flores',
  'Cartões',
  
  // Outros
  'Outros',
  'Doações',
  'Caridade',
  'Impostos',
  'Multas',
  'Serviços Diversos'
];

export function RecurringBillForm({ onClose, editingId, onSuccess }: RecurringBillFormProps) {
  const { addBill, updateBill, bills } = useRecurringBillsStore();
  const [formData, setFormData] = useState<RecurringBillFormData>({
    nome: '',
    valor: 0,
    categoria: '',
    dataVencimento: 1,
    descricao: '',
    alertaUmDia: true,
    alertaDiaVencimento: true
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
          alertaUmDia: bill.alertaUmDia ?? true,
          alertaDiaVencimento: bill.alertaDiaVencimento ?? true
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
        ativo: true,
        statusPagamento: 'pendente'
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
                <SelectContent className="max-h-60 overflow-y-auto">
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
              {editingId ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
