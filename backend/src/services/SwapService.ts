import { encodeFunctionData, type Address } from "viem";

const SWAP_ROUTER_02_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactInputSingle",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export const SWAP_ROUTER_02_ADDRESSES = {
  base: "0x2626664c2603336E57B271c5C0b26F421741e481" as Address,
  celo: "0x5615CDAb10dc425a742d643d949a7F474C01abc4" as Address,
};

export class SwapService {
  async getSwapCallData(params: {
    tokenIn: Address;
    tokenOut: Address;
    fee: number;
    recipient: Address;
    amountIn: bigint;
    amountOutMinimum: bigint;
  }) {
    const { tokenIn, tokenOut, fee, recipient, amountIn, amountOutMinimum } = params;

    try {
      const callData = encodeFunctionData({
        abi: SWAP_ROUTER_02_ABI,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn,
            tokenOut,
            fee,
            recipient,
            amountIn,
            amountOutMinimum,
            sqrtPriceLimitX96: 0n,
          },
        ],
      });

      return callData;
    } catch (error: any) {
      console.error("Error encoding swap callData:", error);
      throw new Error(`Failed to encode swap callData: ${error.message}`);
    }
  }
}
