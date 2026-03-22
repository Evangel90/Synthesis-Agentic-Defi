import type { Request, Response } from "express";
import { ChatService } from "../services/ChatService";
import type { ChatMessage } from "../services/ChatService";

const chatService = new ChatService();

export const handleChat = async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const formattedHistory: ChatMessage[] = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const reply = await chatService.chat(formattedHistory, message);

    res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
