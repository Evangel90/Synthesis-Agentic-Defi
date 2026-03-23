import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardPanel from './DashboardPanel';
import ChatPanel from './ChatPanel';
import { useVaultLogic } from './useVaultLogic';

export default function VaultDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const logic = useVaultLogic();

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden font-body relative">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex md:ml-64 overflow-hidden relative z-10 w-full">
        <DashboardPanel 
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          portfolioValue={logic.portfolioValue}
          dailyChange={logic.dailyChange}
          userAddress={logic.userAddress}
          assets={logic.assets}
        />
        
        <ChatPanel 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={logic.messages}
          inputValue={logic.inputValue}
          setInputValue={logic.setInputValue}
          onSendMessage={logic.sendMessage}
          onExecuteSwap={logic.executeSwap}
          onClearChat={logic.clearMessages}
          isTyping={logic.isTyping}
        />
      </main>

      {/* Background Decorations */}
      <div className="fixed top-0 right-0 w-full md:w-[60%] h-[40%] bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 md:left-64 w-full md:w-[30%] h-[30%] bg-gradient-to-tr from-secondary/5 to-transparent pointer-events-none z-0"></div>
    </div>
  );
}