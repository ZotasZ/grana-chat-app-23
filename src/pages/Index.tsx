
import React, { useState } from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { Dashboard } from '../components/Dashboard';
import { Settings } from '../components/Settings';
import { Navigation } from '../components/Navigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'settings'>('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
