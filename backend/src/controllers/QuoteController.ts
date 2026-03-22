import { type Request, type Response } from "express";
import { UniswapService } from "../services/UniswapService";
import { type Address, parseUnits, formatUnits } from "viem";

const uniswapService = new UniswapService();

export const getQuote = async (req: Request, res: Response) => {
  const { chain, tokenIn, tokenOut, amountIn, decimalsIn, decimalsOut, fee } = req.query;

  if (!chain || !tokenIn || !tokenOut || !amountIn || !decimalsIn || !decimalsOut) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const amountInBigInt = parseUnits(amountIn as string, Number(decimalsIn));
    
    const quote = await uniswapService.getQuote({
      chain: (chain as "base" | "celo" | "baseSepolia" | "celoSepolia"),
      tokenIn: tokenIn as Address,
      tokenOut: tokenOut as Address,
      amountIn: amountInBigInt,
      fee: fee ? Number(fee) : 3000,
    });

    const amountOutFormatted = formatUnits(quote.amountOut, Number(decimalsOut));

    res.json({
      success: true,
      quote: {
        amountOut: quote.amountOut.toString(),
        amountOutFormatted,
        gasEstimate: quote.gasEstimate.toString(),
        sqrtPriceX96After: quote.sqrtPriceX96After.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
