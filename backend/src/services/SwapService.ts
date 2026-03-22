import { encodeFunctionData, type Address, encodeAbiParameters, parseAbiParameters, concat, numberToHex } from "viem";

/**
 * Universal Router ABI (Simplified for the 'execute' function)
 */
const UNIVERSAL_ROUTER_ABI = [
  {
    inputs: [
      { name: "commands", type: "bytes" },
      { name: "inputs", type: "bytes[]" },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

/**
 * Universal Router Addresses (Canonical)
 */
export const UNIVERSAL_ROUTER_ADDRESSES = {
  base: "0x6fF5693b99212Da76ad316178A184AB56D299b43" as Address,
  celo: "0x643770E279d5D0733F21d6DC03A8efbABf3255B4" as Address,
  baseSepolia: "0x492E6456D9528771018DeB9E87ef7750EF184104" as Address,
  celoSepolia: "0x84904B9E85F76a421223565be7b596d7d9A8b8Ce" as Address,
};

/**
 * Universal Router Command IDs
 * Reference: https://github.com/Uniswap/universal-router/blob/main/contracts/libraries/Commands.sol
 */
const COMMANDS = {
  V3_SWAP_EXACT_IN: "0x00" as `0x${string}`,
};

export class SwapService {
  /**
   * Encodes a Uniswap V3 Exact Input Single swap for the Universal Router.
   */
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
      // 1. Encode the V3 Path: [tokenIn (20 bytes)][fee (3 bytes)][tokenOut (20 bytes)]
      const encodedPath = concat([
        tokenIn,
        numberToHex(fee, { size: 3 }),
        tokenOut,
      ]);

      // 2. Encode the Inputs for V3_SWAP_EXACT_IN
      // Struct: address recipient, uint256 amountIn, uint256 amountOutMin, bytes path, bool payerIsUser
      const encodedInput = encodeAbiParameters(
        parseAbiParameters("address, uint256, uint256, bytes, bool"),
        [
          recipient, 
          amountIn, 
          amountOutMinimum, 
          encodedPath, 
          true // payerIsUser = true (tokens come from the user's wallet via Permit2/Allowance)
        ]
      );

      // 3. Final CallData for the 'execute' function
      const callData = encodeFunctionData({
        abi: UNIVERSAL_ROUTER_ABI,
        functionName: "execute",
        args: [
          COMMANDS.V3_SWAP_EXACT_IN, // commands
          [encodedInput],            // inputs
        ],
      });

      return callData;
    } catch (error: any) {
      console.error("Error encoding Universal Router callData:", error);
      throw new Error(`Failed to encode swap callData: ${error.message}`);
    }
  }
}
