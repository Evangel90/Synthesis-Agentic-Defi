interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity" 
          onClick={onClose}
        />
      )}

      <section className={`
        fixed inset-y-0 right-0 w-[90%] sm:w-96 lg:static lg:w-[40%] h-full 
        bg-surface-container-low border-l border-outline-variant/30 flex flex-col z-40 
        transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
        lg:translate-x-0
      `}>
        <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-surface-container-low/50 backdrop-blur-md border-b border-outline-variant/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4caf50] border-2 border-surface-container-low rounded-full"></span>
            </div>
            <span className="font-headline font-bold text-on-surface text-sm md:text-base">AI Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-on-surface-variant/40 hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant/30">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
            <button 
              className="lg:hidden text-on-surface-variant/40 hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant/30"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar">
          <div className="flex justify-end">
            <div className="bg-primary text-on-primary px-4 md:px-5 py-2.5 md:py-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
              <p className="text-xs md:text-sm font-medium">Send $10 to my mum</p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="space-y-4 max-w-[95%] sm:max-w-[90%] w-full">
              <div className="flex space-x-2 md:space-x-3 items-end">
                <div className="w-6 h-6 rounded-full bg-primary-container hidden xs:flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[10px] text-on-primary-container">smart_toy</span>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/10 p-4 md:p-5 rounded-2xl xs:rounded-bl-none shadow-sm w-full">
                  <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-3 md:mb-4">Transaction Progress</h4>
                  
                  <div className="space-y-2 md:space-y-3 mb-5 md:mb-6">
                    <div className="flex items-start text-xs md:text-sm font-medium text-on-surface/80">
                      <span className="material-symbols-outlined text-tertiary mr-2 md:mr-3 text-base md:text-lg shrink-0">check_circle</span>
                      <span className="mt-0.5">Checking available balance</span>
                    </div>
                    <div className="flex items-start text-xs md:text-sm font-medium text-error">
                      <span className="material-symbols-outlined mr-2 md:mr-3 text-base md:text-lg shrink-0">cancel</span>
                      <span className="mt-0.5">Checking contacts for 'Mum'</span>
                    </div>
                  </div>

                  <div className="bg-error-container/20 border border-error/10 p-3 md:p-4 rounded-xl mb-5 md:mb-6">
                    <p className="text-xs md:text-sm text-on-error-container font-medium leading-relaxed">
                      Mum not found in your contacts. Please paste her wallet address to save as a beneficiary and proceed.
                    </p>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div className="relative">
                      <input 
                        className="w-full bg-surface text-xs md:text-sm border-0 focus:ring-2 focus:ring-primary rounded-xl px-4 py-2.5 md:py-3 text-on-surface placeholder:text-on-surface-variant/40 outline-none" 
                        placeholder="Paste wallet address (0x...)" 
                        type="text"
                      />
                    </div>
                    <button className="w-full bg-primary text-on-primary font-bold py-2.5 md:py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 shadow-sm">
                      <span className="text-xs md:text-sm">Save &amp; Send</span>
                      <span className="material-symbols-outlined text-sm md:text-base">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 bg-surface-container-low/80 backdrop-blur-md border-t border-outline-variant/10">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-1.5 md:p-2 flex items-center focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
            <input 
              className="flex-1 bg-transparent border-0 focus:ring-0 text-xs md:text-sm py-2.5 px-3 md:px-4 text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
              placeholder="Ask me to swap, send, or invest..." 
              type="text"
            />
            <button className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all shrink-0">
              <span className="material-symbols-outlined text-sm md:text-base">send</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}