import { useEffect, useRef } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "progress" | "swap_init";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  swapData?: Record<string, any>;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  inputValue: string;
  setInputValue: (v: string) => void;
  onSendMessage: (text: string) => void;
  onExecuteSwap?: () => void;
  onClearChat?: () => void;
  isTyping: boolean;
}

export default function ChatPanel({ 
  isOpen, 
  onClose, 
  messages, 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  onExecuteSwap,
  onClearChat,
  isTyping 
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
            {onClearChat && (
              <button 
                onClick={onClearChat}
                className="text-on-surface-variant/40 hover:text-error transition-colors p-2 rounded-full hover:bg-error/10"
                title="Clear Chat"
              >
                <span className="material-symbols-outlined">delete_sweep</span>
              </button>
            )}
            <button 
              className="lg:hidden text-on-surface-variant/40 hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant/30"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="bg-primary text-on-primary px-4 md:px-5 py-2.5 md:py-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
                  <p className="text-xs md:text-sm font-medium">{msg.content}</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-[95%] sm:max-w-[90%] w-full">
                  <div className="flex space-x-2 md:space-x-3 items-end">
                    <div className="w-6 h-6 rounded-full bg-primary-container hidden xs:flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[10px] text-on-primary-container">smart_toy</span>
                    </div>
                    {msg.type === 'progress' ? (
                      <div className="bg-surface-container-lowest border border-outline-variant/10 p-4 md:p-5 rounded-2xl xs:rounded-bl-none shadow-sm w-full">
                        <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-3 md:mb-4">Transaction Progress</h4>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex items-start text-xs md:text-sm font-medium text-on-surface/80">
                            <span className="material-symbols-outlined text-tertiary mr-2 md:mr-3 text-base md:text-lg shrink-0">check_circle</span>
                            <span className="mt-0.5">Executing transaction on chain...</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 w-full">
                        <div className="bg-surface-container-lowest border border-outline-variant/10 p-4 md:p-5 rounded-2xl xs:rounded-bl-none shadow-sm inline-block">
                          <p className="text-xs md:text-sm text-on-surface font-medium leading-relaxed">{msg.content}</p>
                        </div>
                        {msg.type === 'swap_init' && (
                          <div className="bg-primary-container/30 border border-primary/10 p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase text-primary">Swap Confirmation</span>
                              <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded text-primary">{msg.swapData?.chain}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-medium">
                              <span>{msg.swapData?.amountIn} {msg.swapData?.tokenIn}</span>
                              <span className="material-symbols-outlined text-xs">arrow_forward</span>
                              <span>{msg.swapData?.tokenOut}</span>
                            </div>
                            <button 
                              onClick={onExecuteSwap}
                              className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary/90 transition-all"
                            >
                              Confirm and Execute Swap
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface-container-lowest border border-outline-variant/10 px-4 py-2 rounded-2xl animate-pulse text-xs text-on-surface-variant">
                Assistant Thinking
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-8 bg-surface-container-low/80 backdrop-blur-md border-t border-outline-variant/10">
          <form 
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-1.5 md:p-2 flex items-center focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              onSendMessage(inputValue);
            }}
          >
            <input 
              className="flex-1 bg-transparent border-0 focus:ring-0 text-xs md:text-sm py-2.5 px-3 md:px-4 text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
              placeholder="How can I help you swap?" 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              type="submit"
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:brightness-110 transition-all shrink-0 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm md:text-base">send</span>
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
