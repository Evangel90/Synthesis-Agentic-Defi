import { type Request, type Response } from "express";
import { AgentService } from "../services/AgentService";

const agentService = new AgentService();

export const getAgentInfo = async (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      agentAddress: agentService.getAgentAddress(),
      chain: "baseSepolia",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
