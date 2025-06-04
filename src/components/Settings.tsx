
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Bell, 
  DollarSign, 
  Target, 
  Trash2, 
  Download,
  Moon,
  Sun
} from 'lucide-react';
import { useTransactionStore } from '../stores/transactionStore';
import { formatCurrency } from '../utils/transactionParser';

export function Settings() {
  const { transactions } = useTransactionStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [budgetLimit, setBudgetLimit] = React.useState([1000]);

  const handleExportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financeiro-backup.json';
    link.click();
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('transaction-store');
      window.location.reload();
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes diários</p>
              <p className="text-sm text-gray-500">Receba um lembrete para registrar seus gastos</p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de limite</p>
              <p className="text-sm text-gray-500">Notificação quando atingir o limite de gastos</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Limites e Metas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Limites e Metas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Limite mensal de gastos</p>
              <span className="font-bold text-lg">{formatCurrency(budgetLimit[0])}</span>
            </div>
            <Slider
              value={budgetLimit}
              onValueChange={setBudgetLimit}
              max={5000}
              min={100}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>R$ 100</span>
              <span>R$ 5.000</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-sm">Alimentação</span>
              </div>
              <p className="text-2xl font-bold text-red-700">R$ 400</p>
              <p className="text-xs text-red-600">Limite mensal</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-sm">Transporte</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">R$ 200</p>
              <p className="text-xs text-blue-600">Limite mensal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modo escuro</p>
              <p className="text-sm text-gray-500">Alterna entre tema claro e escuro</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados e Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Dados e Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Dados
            </Button>
            
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Tudo
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Total de transações:</strong> {transactions.length}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Seus dados são armazenados localmente no seu dispositivo e nunca são enviados para servidores externos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
