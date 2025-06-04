
import React from 'react';
import { MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeTab: 'chat' | 'dashboard' | 'settings';
  onTabChange: (tab: 'chat' | 'dashboard' | 'settings') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around max-w-md mx-auto">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('chat')}
          className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
            activeTab === 'chat' 
              ? 'whatsapp-green text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs">Chat</span>
        </Button>

        <Button
          variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
            activeTab === 'dashboard' 
              ? 'whatsapp-green text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">Painel</span>
        </Button>

        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
            activeTab === 'settings' 
              ? 'whatsapp-green text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">Config</span>
        </Button>
      </div>
    </div>
  );
}
