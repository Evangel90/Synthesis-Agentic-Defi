import { type Request, type Response } from "express";
import { UniswapService } from "../services/UniswapService";
import { SwapService, UNIVERSAL_ROUTER_ADDRESSES } from "../services/SwapService";
import { AgentService } from "../services/AgentService";
import { type Address, parseUnits } from "viem";

const uniswapService = new UniswapService();
const swapService = new SwapService();
const agentService = new AgentService();

export const redeemSwap = async (req: Request, res: Response) => {
  const { 
    chain, 
    tokenIn, 
    tokenOut, 
    amountIn, 
    decimalsIn, 
    fee, 
    delegation, // The signed delegation object from the frontend
    delegator // The user's address
  } = req.body;

  if (!chain || !tokenIn || !tokenOut || !amountIn || !decimalsIn || !delegation || !delegator) {
    return res.status(400).json({ error: "Missing required body parameters" });
  }

  try {
    const amountInBigInt = parseUnits(amountIn as string, Number(decimalsIn));
    
    // 1. Get the current quote to determine amountOutMinimum (e.g., 0.5% slippage)
    const quote = await uniswapService.getQuote({
      chain: (chain as "base" | "celo" | "baseSepolia" | "celoSepolia"),
      tokenIn: tokenIn as Address,
      tokenOut: tokenOut as Address,
      amountIn: amountInBigInt,
      fee: fee ? Number(fee) : 3000,
    });

    const amountOutMinimum = (quote.amountOut * 995n) / 1000n; // 0.5% slippage

    // 2. Generate the Uniswap execution calldata
    const executionCallData = await swapService.getSwapCallData({
      tokenIn: tokenIn as Address,
      tokenOut: tokenOut as Address,
      fee: fee ? Number(fee) : 3000,
      recipient: delegator as Address, // Swap back to the user's address
      amountIn: amountInBigInt,
      amountOutMinimum,
    });

    // 3. Prepare the execution struct for the DelegationManager
    const execution = {
      target: UNIVERSAL_ROUTER_ADDRESSES[chain as "base" | "celo" | "baseSepolia" | "celoSepolia"],
      value: BigInt(0),
      callData: executionCallData,
    };

    // 4. Properly format the delegation (convert string salt back to BigInt)
    const formattedDelegation = {
      ...delegation,
      salt: BigInt(delegation.salt),
      caveats: delegation.caveats.map((c: any) => ({
        enforcer: c.enforcer as Address,
        terms: c.terms as `0x${string}`,
      })),
    };

    // 5. Redeem the delegation and broadcast the transaction
    const result = await agentService.redeemDelegation({
      chain: (chain as "base" | "celo" | "baseSepolia" | "celoSepolia"),
      delegations: [formattedDelegation],
      executions: [execution],
    });


    res.json({
      success: true,
      transactionHash: result.transactionHash,
      quote: {
        expectedAmountOut: quote.amountOut.toString(),
        amountOutMinimum: amountOutMinimum.toString(),
      }
    });
  } catch (error: any) {
    console.error("Redeem swap failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
