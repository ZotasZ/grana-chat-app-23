import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, 
  TrendingDown, 
  CreditCard, 
  Calendar,
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTransactionStore } from '../stores/transactionStore';
import { formatCurrency } from '../utils/transactionParser';

export function Dashboard() {
  const { 
    transactions, 
    selectedMonth,
    setSelectedMonth,
    getTransactionsByCategory, 
    getTotalByPeriod,
    getTransactionsByMonth,
    getNextMonthsWithTransactions
  } = useTransactionStore();

  const currentMonth = selectedMonth;
  const availableMonths = getNextMonthsWithTransactions();
  const currentMonthTransactions = getTransactionsByMonth(currentMonth);

  // Dados do mês selecionado
  const totalMes = currentMonthTransactions.reduce((sum, t) => sum + t.valor, 0);
  const totalSemana = getTotalByPeriod(7, new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0));
  const totalHoje = getTotalByPeriod(1);
  const totalTransacoes = currentMonthTransactions.length;

  // Navegação entre meses
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setSelectedMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setSelectedMonth(newMonth);
  };

  // Dados por categoria para gráfico de pizza (mês atual)
  const categoriaData = Object.entries(getTransactionsByCategory(currentMonth)).map(([categoria, trans]) => ({
    name: categoria,
    value: trans.reduce((sum, t) => sum + t.valor, 0),
    count: trans.length
  }));

  // Dados dos últimos 7 dias do mês selecionado para gráfico de barras
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentMonth);
    date.setDate(date.getDate() - i);
    const dayTransactions = currentMonthTransactions.filter(t => {
      const tDate = new Date(t.data);
      return tDate.toDateString() === date.toDateString();
    });
    
    return {
      day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      gastos: dayTransactions.reduce((sum, t) => sum + t.valor, 0)
    };
  }).reverse();

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE', '#82E0AA', '#95A5A6'];

  // Transações recentes do mês
  const recentTransactions = currentMonthTransactions
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 8);

  // Função para formatar o nome do mês
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header com navegação de mês */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {formatMonthYear(currentMonth)}
          </h2>
          <p className="text-sm text-gray-600">
            {currentMonthTransactions.filter(t => t.parcelado).length > 0 && 
              `${currentMonthTransactions.filter(t => t.parcelado).length} parcela(s) programada(s)`
            }
          </p>
        </div>
        
        <Button variant="outline" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Meses disponíveis */}
      {availableMonths.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableMonths.map((month) => (
            <Button
              key={month.toISOString()}
              variant={
                month.getMonth() === currentMonth.getMonth() && 
                month.getFullYear() === currentMonth.getFullYear() 
                  ? "default" 
                  : "outline"
              }
              size="sm"
              onClick={() => setSelectedMonth(month)}
              className="whitespace-nowrap"
            >
              {month.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}
            </Button>
          ))}
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalMes)}</div>
            <p className="text-xs text-muted-foreground">
              {formatMonthYear(currentMonth)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalSemana)}</div>
            <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalHoje)}</div>
            <p className="text-xs text-muted-foreground">Gastos de hoje</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <ShoppingBag className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalTransacoes}</div>
            <p className="text-xs text-muted-foreground">Neste mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Últimos 7 dias */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos dos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Gastos']}
                  labelStyle={{ color: '#333' }}
                />
                <Bar dataKey="gastos" fill="var(--whatsapp-green)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoriaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoriaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoriaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum gasto registrado ainda</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Transações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Transações do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                      {transaction.categoria === 'Alimentação' && '🍔'}
                      {transaction.categoria === 'Transporte' && '🚗'}
                      {transaction.categoria === 'Saúde' && '💊'}
                      {transaction.categoria === 'Lazer' && '🎬'}
                      {transaction.categoria === 'Casa' && '🏠'}
                      {transaction.categoria === 'Presentes' && '🎁'}
                      {!['Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Casa', 'Presentes'].includes(transaction.categoria) && '💸'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.descricao}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.categoria}
                        {transaction.formaPagamento && ` • ${transaction.formaPagamento}`}
                        {transaction.parcelado && ` • ${transaction.parcelaAtual}/${transaction.totalParcelas}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatCurrency(transaction.valor)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma transação encontrada</p>
              <p className="text-sm mt-2">Comece registrando seus gastos no chat!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
