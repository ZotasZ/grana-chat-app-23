
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/Dashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { Settings } from "@/components/Settings";
import { RecurringBills } from "@/components/RecurringBills";
import UserProfile from "@/components/UserProfile";
import Header from "@/components/Header";
import { useAlerts } from "@/hooks/useAlerts";
import { useRecurringBillsStore } from "@/stores/recurringBillsStore";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const { fetchBills } = useRecurringBillsStore();
  
  // Inicializar sistema de alertas
  useAlerts();

  // Buscar dados do usuário quando logado
  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user, fetchBills]);

  const tabsConfig = [
    { value: "dashboard", label: "Dashboard", icon: "📊" },
    { value: "chat", label: "Chat IA", icon: "💬" },
    { value: "bills", label: "Contas", icon: "💰" },
    { value: "profile", label: "Perfil", icon: "👤" },
    { value: "settings", label: "Config", icon: "⚙️" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Tabs defaultValue="dashboard" className="w-full flex flex-col flex-1">
        {/* Header fixo com as abas - otimizado para mobile */}
        <div className="bg-card border-b border-border px-2 py-2 shadow-sm sticky top-[60px] z-40">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-muted rounded-lg p-1">
            {tabsConfig.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className="text-xs font-medium px-1 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.icon}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* Conteúdo das abas - otimizado para mobile com scroll */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="dashboard" className="h-full m-0 p-3 overflow-y-auto mobile-scroll">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="chat" className="h-full m-0 overflow-y-auto mobile-scroll">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="bills" className="h-full m-0 p-3 overflow-y-auto mobile-scroll">
            <RecurringBills />
          </TabsContent>
          
          <TabsContent value="profile" className="h-full m-0 p-3 overflow-y-auto mobile-scroll">
            <UserProfile />
          </TabsContent>
          
          <TabsContent value="settings" className="h-full m-0 p-3 overflow-y-auto mobile-scroll">
            <Settings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
