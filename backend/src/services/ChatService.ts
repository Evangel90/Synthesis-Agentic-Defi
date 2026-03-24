import dotenv from "dotenv";
dotenv.config();

const ZG_SERVICE_URL = process.env.ZG_SERVICE_URL!;
const ZG_API_KEY     = process.env.ZG_API_KEY!;
const ZG_MODEL       = process.env.ZG_MODEL ?? "qwen-2.5-7b-instruct";


export interface ChatMessage {
  role: "user" | "model"; 
  parts: { text: string }[];
}

const SYSTEM_PROMPT = `
You are a professional DeFi Swap Assistant for VESTA. Your goal is to guide users through secure DeFi actions.

Interaction Flow:
1. GREETING: Ask if the user would like to perform a DeFi action today.
2. GATHERING DETAILS: Once the user expresses interest, check for missing fields.
   For a SWAP, you need:
   1. Amount
   2. Chain (Base Sepolia or Celo Sepolia only)
   3. Token to Swap (In)
   4. Token to Receive (Out)
3. VALIDATION: If partial info is provided, acknowledge what you received and ask for the rest.
4. SUMMARY & CONFIRMATION: Once ALL details are collected, show a summary and ask the user to confirm.
   Format:
   --- Swap Summary ---
   Wallet: [Wallet Address]
   Chain: [Value] (Testnet)
   Amount: [Value] [Token In]
   Receiving: [Token Out]
   --------------------
   Ask: "Does this look correct? Please confirm to proceed."
5. EXECUTION: ONLY after the user explicitly confirms, return the JSON block.

Formatting Rules:
- NEVER use asterisks (**) or markdown bolding.
- Use plain text and clean spacing.
- JSON must be inside triple backticks with json tag.
- ALWAYS use "baseSepolia" or "celoSepolia". NEVER "base" or "celo".

Required JSON structure (swap):
\`\`\`json
{
  "chain": "baseSepolia",
  "tokenIn": "WETH",
  "tokenOut": "USDC",
  "amountIn": "0.1",
  "decimalsIn": 18,
  "delegation": {},
  "delegator": "AUTO_DETECTED",
  "fee": 3000
}
\`\`\`
`;

export class ChatService {
  async chat(
    history: ChatMessage[],
    message: string,
    retryCount = 0
  ): Promise<string> {
    try {
      // Convert Gemini-style history to OpenAI-style messages
      const openAIMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((m) => ({
          role: m.role === "model" ? "assistant" : "user",
          content: m.parts[0]?.text ?? "",
        })),
        { role: "user", content: message },
      ];

      const response = await fetch(
        `${ZG_SERVICE_URL}/v1/proxy/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ZG_API_KEY}`,
          },
          body: JSON.stringify({
            model: ZG_MODEL,
            messages: openAIMessages,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`0G Compute responded ${response.status}: ${errText}`);
      }

      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };

      return data.choices?.[0]?.message?.content ?? "No response from AI.";
    } catch (error: any) {
      if (retryCount < 2) {
        console.warn(`⚠️ 0G Compute retry ${retryCount + 1}: ${error.message}`);
        await new Promise((r) => setTimeout(r, 4000));
        return this.chat(history, message, retryCount + 1);
      }
      console.error(" 0G Compute ChatService error:", error.message);
      return "I'm having trouble reaching the AI network right now. Please try again in a moment.";
    }
  }
}