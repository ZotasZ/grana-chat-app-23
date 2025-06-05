
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/Dashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { Settings } from "@/components/Settings";
import UserProfile from "@/components/UserProfile";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Tabs defaultValue="dashboard" className="w-full flex flex-col h-screen">
        {/* Header fixo com as abas - otimizado para mobile */}
        <div className="bg-white border-b border-gray-200 px-2 py-2 shadow-sm sticky top-0 z-50">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="dashboard" 
              className="text-xs font-medium px-2 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="text-xs font-medium px-2 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Chat IA
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="text-xs font-medium px-2 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Perfil
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="text-xs font-medium px-2 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Config
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Conteúdo das abas - otimizado para mobile */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="dashboard" className="h-full m-0 p-3">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="chat" className="h-full m-0">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="profile" className="h-full m-0 p-3">
            <UserProfile />
          </TabsContent>
          
          <TabsContent value="settings" className="h-full m-0 p-3">
            <Settings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
