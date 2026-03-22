import { useState, useEffect } from 'react';

export type VaultChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  type?: 'progress' | 'text';
};

export const useVaultLogic = () => {
  // --- Portfolio State ---
  const [portfolioValue, setPortfolioValue] = useState(12450.00);
  const [dailyChange, setDailyChange] = useState(4.2);

  // Simulate small price fluctuations every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() * 10 - 5));
      setDailyChange(prev => {
        const next = prev + (Math.random() * 0.6 - 0.3);
        return Number(next.toFixed(2));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Chat State ---
  const [messages, setMessages] = useState<VaultChatMessage[]>([
    { role: 'user', content: 'Send $10 to my mum' },
    { role: 'assistant', content: 'Processing transaction...', type: 'progress' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response after 1.5 seconds
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've analyzed your request to "${text}". How would you like to proceed?`,
        type: 'text'
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return {
    portfolioValue,
    dailyChange,
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isTyping
  };
};
