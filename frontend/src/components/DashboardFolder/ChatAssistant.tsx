import React from 'react';

export const ChatAssistant: React.FC = () => {
  return (
    <section className="w-[40%] h-full bg-surface-container-low border-l border-outline-variant/30 flex flex-col relative z-10">
      <header className="h-16 flex items-center justify-between px-8 bg-surface-container-low/50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4caf50] border-2 border-surface-container-low rounded-full"></span>
          </div>
          <span className="font-headline font-bold text-on-surface">AI Assistant</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="flex justify-end">
          <div className="bg-primary text-on-primary px-5 py-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm text-sm">
            Send $10 to my mum
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 rounded-2xl rounded-bl-none shadow-sm w-full max-w-[90%]">
            <h4 className="text-xs font-bold uppercase text-on-surface-variant/60 mb-4">Transaction Progress</h4>
            <div className="bg-error-container/20 border border-error/10 p-4 rounded-xl mb-6 text-sm text-on-error-container font-medium">
              Mum not found. Please paste her wallet address.
            </div>
            <input className="w-full bg-surface text-sm border-0 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 mb-4 outline-none text-on-surface" placeholder="0x..." />
            <button className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl flex items-center justify-center space-x-2">
              <span>Save & Send</span>
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 bg-surface-container-low/80 backdrop-blur-md">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-2 flex items-center">
          <input className="flex-1 bg-transparent border-0 focus:ring-0 text-sm py-3 px-4 text-on-surface outline-none" placeholder="Ask me anything..." />
          <button className="w-10 h-10 rounded-xl bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center">
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </section>
  );
};