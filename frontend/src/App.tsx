import React from 'react';
import { Sidebar } from './components/DashboardFolder/Sidebar';
import { MainContent } from './components/DashboardFolder/MainContent';
import { ChatAssistant } from './components/DashboardFolder/ChatAssistant';

const App: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden font-body">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Dashboard Layout */}
      <main className="flex-1 flex ml-64 overflow-hidden relative">
        <MainContent />
        <ChatAssistant />

        {/* Global Background Decorations */}
        <div className="fixed top-0 right-0 w-[60%] h-[40%] bg-linear-to-bl from-primary/5 to-transparent pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-64 w-[30%] h-[30%] bg-linear-to-tr from-secondary/5 to-transparent pointer-events-none -z-10" />
      </main>
    </div>
  );
};

export default App;