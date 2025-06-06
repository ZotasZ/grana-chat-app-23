
import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';

export function Settings() {
  const { transactions } = useTransactionStore();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (localStorage.getItem('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [budgetLimit, setBudgetLimit] = useState([1000]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast({
      title: checked ? "Tema escuro ativado" : "Tema claro ativado",
      description: "As cores do app foram atualizadas.",
    });
  };

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(transactions, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'financeiro-backup.json';
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Dados exportados",
        description: "Backup realizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      try {
        localStorage.removeItem('transaction-store');
        localStorage.removeItem('recurring-bills-store');
        toast({
          title: "Dados limpos",
          description: "Todos os dados foram removidos.",
        });
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível limpar os dados.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <h1 className="text-xl font-bold">Configurações</h1>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modo escuro</p>
              <p className="text-sm text-muted-foreground">Alterna entre tema claro e escuro</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes diários</p>
              <p className="text-sm text-muted-foreground">Receba um lembrete para registrar seus gastos</p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de limite</p>
              <p className="text-sm text-muted-foreground">Notificação quando atingir o limite de gastos</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Limites e Metas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
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
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>R$ 100</span>
              <span>R$ 5.000</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-sm">Alimentação</span>
              </div>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">R$ 400</p>
              <p className="text-xs text-red-600 dark:text-red-400">Limite mensal</p>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-sm">Transporte</span>
              </div>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">R$ 200</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Limite mensal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados e Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="w-5 h-5" />
            Dados e Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center gap-2 justify-center"
            >
              <Download className="w-4 h-4" />
              Exportar Dados
            </Button>
            
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="flex items-center gap-2 justify-center"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Tudo
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Total de transações:</strong> {transactions.length}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Seus dados são armazenados localmente no seu dispositivo e nunca são enviados para servidores externos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
