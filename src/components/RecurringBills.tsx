import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, ToggleLeft, ToggleRight, Trash2, Camera, Edit, CreditCard, CheckCircle, Circle, Bell, BellOff, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecurringBillsStore } from '@/stores/recurringBillsStore';
import { RecurringBillForm } from '@/components/RecurringBillForm';
import { ParcelaForm } from '@/components/ParcelaForm';
import { ImageUpload } from '@/components/ImageUpload';
import { useAlerts } from '@/hooks/useAlerts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RecurringBills() {
  const { bills, toggleBillStatus, deleteBill, addImageToBill, markAsPaid } = useRecurringBillsStore();
  const [showForm, setShowForm] = useState(false);
  const [showParcelaForm, setShowParcelaForm] = useState(false);
  const [editingBill, setEditingBill] = useState<string | null>(null);
  const { checkAlerts } = useAlerts();

  const handleImageUpload = (billId: string, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    addImageToBill(billId, imageUrl);
  };

  const activeBills = bills.filter(bill => bill.ativo);
  const inactiveBills = bills.filter(bill => !bill.ativo);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Moradia': 'bg-blue-100 text-blue-800',
      'Energia Elétrica': 'bg-yellow-100 text-yellow-800',
      'Água e Esgoto': 'bg-cyan-100 text-cyan-800',
      'Gás': 'bg-orange-100 text-orange-800',
      'Internet': 'bg-purple-100 text-purple-800',
      'Telefone': 'bg-green-100 text-green-800',
      'TV por Assinatura': 'bg-indigo-100 text-indigo-800',
      'Streaming': 'bg-pink-100 text-pink-800',
      'Transporte': 'bg-green-100 text-green-800',
      'Saúde': 'bg-red-100 text-red-800',
      'Educação': 'bg-blue-100 text-blue-800',
      'Financeiro': 'bg-orange-100 text-orange-800',
      'Seguros': 'bg-gray-100 text-gray-800',
      'Lazer': 'bg-purple-100 text-purple-800',
      'Beleza': 'bg-pink-100 text-pink-800',
      'Vestuário': 'bg-indigo-100 text-indigo-800',
      'Casa': 'bg-amber-100 text-amber-800',
      'Animais': 'bg-emerald-100 text-emerald-800',
      'Trabalho': 'bg-slate-100 text-slate-800',
      'Tecnologia': 'bg-violet-100 text-violet-800',
      'Outros': 'bg-gray-100 text-gray-800'
    };
    return colors[categoria] || colors['Outros'];
  };

  const renderBillCard = (bill: any, isActive: boolean = true) => (
    <Card key={bill.id} className={`border-l-4 ${isActive ? 'border-l-green-500' : 'border-l-gray-400 opacity-75'}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className={`text-lg ${!isActive ? 'text-gray-600' : ''}`}>
                {bill.nome}
              </CardTitle>
              {bill.ehParcelado && (
                <Badge variant="outline" className="text-xs">
                  <CreditCard className="w-3 h-3 mr-1" />
                  Parcela
                </Badge>
              )}
            </div>
            {bill.descricao && <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-500'}`}>{bill.descricao}</p>}
          </div>
          <div className="flex gap-2">
            {isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAsPaid(bill.id)}
                className={bill.statusPagamento === 'pago' ? 'bg-green-50 border-green-200' : ''}
              >
                {bill.statusPagamento === 'pago' ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> : 
                  <Circle className="w-4 h-4" />
                }
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingBill(bill.id);
                setShowForm(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleBillStatus(bill.id)}
            >
              {isActive ? 
                <ToggleRight className="w-4 h-4 text-green-600" /> : 
                <ToggleLeft className="w-4 h-4 text-gray-600" />
              }
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteBill(bill.id)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className={`font-semibold ${bill.statusPagamento === 'pago' ? 'line-through text-gray-500' : ''}`}>
              {formatCurrency(bill.valor)}
            </span>
            {bill.statusPagamento === 'pago' && (
              <Badge className="bg-green-100 text-green-800">Pago</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Dia {bill.dataVencimento}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <Badge className={getCategoryColor(bill.categoria)}>
            {bill.categoria}
          </Badge>
          <span className="text-sm text-gray-600">
            Próximo: {format(bill.proximoVencimento, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-2">
            {bill.alertaUmDia && (
              <Badge variant="outline" className="text-xs">
                <Bell className="w-3 h-3 mr-1" />
                1 dia antes
              </Badge>
            )}
            {bill.alertaDiaVencimento && (
              <Badge variant="outline" className="text-xs">
                <Bell className="w-3 h-3 mr-1" />
                No dia
              </Badge>
            )}
            {!bill.alertaUmDia && !bill.alertaDiaVencimento && (
              <Badge variant="outline" className="text-xs">
                <BellOff className="w-3 h-3 mr-1" />
                Sem alertas
              </Badge>
            )}
          </div>
          
          {bill.ehParcelado && (
            <Badge variant="secondary" className="text-xs">
              {bill.parcelaAtual}/{bill.numeroParcelas}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center">
          {bill.imagemBoleto ? (
            <div className="flex items-center gap-2">
              <img 
                src={bill.imagemBoleto} 
                alt="Boleto" 
                className="w-12 h-12 object-cover rounded border cursor-pointer"
                onClick={() => window.open(bill.imagemBoleto, '_blank')}
              />
              <span className="text-sm text-green-600">Boleto anexado</span>
            </div>
          ) : (
            <ImageUpload
              onImageSelected={(file) => handleImageUpload(bill.id, file)}
              disabled={false}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contas Recorrentes</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowParcelaForm(true)}
            variant="outline"
            className="whatsapp-green text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Nova Parcela
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="whatsapp-green text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

      {showForm && (
        <RecurringBillForm
          onClose={() => setShowForm(false)}
          editingId={editingBill}
          onSuccess={() => {
            setShowForm(false);
            setEditingBill(null);
          }}
        />
      )}

      {showParcelaForm && (
        <ParcelaForm
          onClose={() => setShowParcelaForm(false)}
          onSuccess={() => {
            setShowParcelaForm(false);
          }}
        />
      )}

      {/* Contas Ativas */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Contas Ativas ({activeBills.length})</h3>
        {activeBills.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Nenhuma conta recorrente ativa. Adicione sua primeira conta!
            </CardContent>
          </Card>
        ) : (
          activeBills.map((bill) => renderBillCard(bill, true))
        )}
      </div>

      {/* Contas Inativas */}
      {inactiveBills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Contas Inativas ({inactiveBills.length})</h3>
          {inactiveBills.map((bill) => renderBillCard(bill, false))}
        </div>
      )}
    </div>
  );
}
