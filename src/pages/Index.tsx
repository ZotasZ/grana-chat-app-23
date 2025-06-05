
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/Dashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { Settings } from "@/components/Settings";
import UserProfile from "@/components/UserProfile";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Tabs defaultValue="dashboard" className="w-full flex flex-col h-screen">
        {/* Header fixo com as abas */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-50">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs sm:text-sm">Chat IA</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Perfil</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Configurações</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Conteúdo das abas */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="dashboard" className="h-full m-0 p-4">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="chat" className="h-full m-0">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="profile" className="h-full m-0 p-4">
            <UserProfile />
          </TabsContent>
          
          <TabsContent value="settings" className="h-full m-0 p-4">
            <Settings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
