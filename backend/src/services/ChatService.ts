import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Using gemini-flash-latest as confirmed by list-models.ts
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export class ChatService {
  private static systemPrompt = `
You are a professional DeFi Swap Assistant. Your goal is to guide users through a secure token swap process.

Interaction Flow:
1. GREETING: Start by warmly asking the user if they would like to perform a token swap today.
2. GATHERING DETAILS: Once the user expresses interest, check if any of the following details are missing:
   - Chain (e.g., Base, Celo)
   - Token to Swap (Token In)
   - Token to Receive (Token Out)
   - Amount to Swap
   If details are missing, ask for all of them at once in a professional, numbered list format:
   1. Amount
   2. Chain
   3. Token to Swap (In)
   4. Token to Receive (Out)
3. VALIDATION: If the user provides partial info, politely acknowledge what you received and ask for the remaining items using the numbered list.
4. SUMMARY & CONFIRMATION: Once ALL details are collected, provide a professional summary including the user's wallet address (provided in the system context).
   Format:
   --- Swap Summary ---
   Wallet: [Wallet Address]
   Chain: [Value]
   Amount: [Value] [Token In]
   Receiving: [Token Out]
   --------------------
   Ask the user: "Does this look correct? Please confirm to proceed with the transaction."
5. EXECUTION: ONLY after the user explicitly confirms (e.g., "Yes", "Correct", "Confirm"), provide the JSON block.

Formatting Rules:
- NEVER use asterisks (**) or markdown bolding.
- Use plain text and clean spacing.
- Provide the JSON block inside triple backticks (\`\`\`json).

Required JSON structure:
{
  "chain": "base",
  "tokenIn": "WETH",
  "tokenOut": "USDC",
  "amountIn": "0.1",
  "decimalsIn": 18,
  "delegation": {},
  "delegator": "AUTO_DETECTED",
  "fee": 3000
}
`;

  async chat(history: ChatMessage[], message: string, retryCount = 0): Promise<string> {
    try {
      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: ChatService.systemPrompt }] },
          { role: "model", parts: [{ text: "Hello! I am your DeFi Swap Assistant. Would you like to perform a token swap today?" }] },
          ...history
        ],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      // 429 is "Too Many Requests" (Quota exceeded)
      if (error?.status === 429) {
        if (retryCount < 1) {
            console.warn(`Rate limit hit (429). Staying active and retrying in 50 seconds per user requirement...`);
            await new Promise(resolve => setTimeout(resolve, 50000));
            return this.chat(history, message, retryCount + 1);
        } else if (retryCount < 2) {
             console.warn(`Rate limit hit again (429). Final retry attempt in 10 seconds...`);
             await new Promise(resolve => setTimeout(resolve, 10000));
             return this.chat(history, message, retryCount + 1);
        } else {
            return "I apologize, but my message quota is still active. Please give me a minute to refresh and then try sending your message again!";
        }
      }
      
      console.error("Gemini API Error:", error.message);
      return "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!";
    }
  }
}
