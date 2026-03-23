import { useState, useEffect } from 'react';
import { useDelegation } from '../../context/DelegationContext';
import { API_BASE_URL } from '../../config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'progress' | 'swap_init';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  swapData?: Record<string, any>;
}

export const useVaultLogic = () => {
  const { smartAccountAddress, delegationPayload } = useDelegation();
  // --- Portfolio State ---
  const [portfolioValue, setPortfolioValue] = useState(12450.00);
  const [dailyChange] = useState(4.2);

  // --- Identity ---
  const userAddress = smartAccountAddress || '0x0000000000000000000000000000000000000000'; 

  const storageKey = `chat_messages_${userAddress}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() * 10 - 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Chat State Persistence ---
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Hello! I am your DeFi Swap Assistant. How can I help you today?', type: 'text' }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingSwap, setPendingSwap] = useState<Record<string, any> | null>(null);

  // Save messages whenever they change
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  const clearMessages = () => {
    const initialMessage: Message = { 
      role: 'assistant', 
      content: 'Hello! I am your DeFi Swap Assistant. How can I help you today?', 
      type: 'text' 
    };
    setMessages([initialMessage]);
    setPendingSwap(null);
    sessionStorage.removeItem(storageKey);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const currentMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(currentMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const systemContext = `The user is currently logged in with address: ${userAddress}`;
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[SYSTEM CONTEXT: ${systemContext}] 

 User Message: ${text}`,
          history: currentMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        const reply = data.reply;
        const jsonMatch = reply.match(/```json\n([\s\S]*?)\n```/);
        
        const assistantMsg: Message = { 
          role: 'assistant', 
          content: reply.replace(/```json[\s\S]*?```/, '').trim(),
          type: 'text'
        };

        if (jsonMatch) {
          try {
            const parsedData = JSON.parse(jsonMatch[1]);
            
            // Ensure swapData is a complete JSON for the payload
            const completeSwapData = {
              ...parsedData,
              delegator: userAddress,
              delegation: delegationPayload || { salt: '0', caveats: [] }
            };
            
            setPendingSwap(completeSwapData);
            assistantMsg.type = 'swap_init';
            assistantMsg.swapData = completeSwapData;
          } catch (e) {
            console.error("Failed to parse swap JSON", e);
          }
        }

        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}`,
        type: 'text'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const executeSwap = async () => {
    if (!pendingSwap) return;

    if (!delegationPayload) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error: No delegation found. Please grant permissions in the Agent Permissions page first.',
        type: 'text'
      }]);
      return;
    }

    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'Executing swap transaction...', 
      type: 'progress' 
    }]);

    try {
      // Use delegationPayload.delegator as the source of truth for the SA address
      const requestBody = {
        ...pendingSwap,
        delegation: delegationPayload,
        delegator: delegationPayload.delegator 
      };

      console.log("🚀 [useVaultLogic] Dispatching swap request to backend...");
      console.log("📦 Full Payload:", requestBody);

      const response = await fetch(`${API_BASE_URL}/api/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ [useVaultLogic] Backend execution successful:", data.transactionHash);
        
        const explorerBase = requestBody.chain.includes('base') 
            ? 'https://sepolia.basescan.org/tx/' 
            : 'https://celoscan.io/tx/';
        const explorerUrl = `${explorerBase}${data.transactionHash}`;

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ Swap successful! 

Transaction Hash: ${data.transactionHash}

Expected Amount Out: ${data.quote?.amountOutFormatted || data.quote?.expectedAmountOut} tokens.

[Verify on Explorer](${explorerUrl})`,
          type: 'text'
        }]);
        setPendingSwap(null);
      } else {
        throw new Error(data.error || 'Swap execution failed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Swap failed: ${error.message}`,
        type: 'text'
      }]);
    }
  };

  return {
    userAddress,
    portfolioValue,
    dailyChange,
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    executeSwap,
    clearMessages,
    isTyping,
    pendingSwap
  };
};