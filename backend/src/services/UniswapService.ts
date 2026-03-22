import { createPublicClient, http, parseAbi, type Address, formatUnits } from "viem";
import { base, celo, baseSepolia, celoSepolia } from "viem/chains";

const QUOTER_V2_ABI = parseAbi([
  "function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96)) public returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)",
]);

const CONTRACTS = {
  base: {
    quoterV2: "0x3d146FcE6c1006857750cBe8aF44f76a28041CCc" as Address,
  },
  celo: {
    quoterV2: "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8" as Address,
  },
  baseSepolia: {
    // quoterV2: "0x3d146FcE6c1006857750cBe8aF44f76a28041CCc" as Address,
    quoterV2: "0xC5290058841028F1614F3A6F0F5816cAd0df5E27" as Address,
  },
  celoSepolia: {
    quoterV2: "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8" as Address,
  },
};

export class UniswapService {
  private clients: Record<string, any>;

  constructor() {
    this.clients = {
      base: createPublicClient({
        chain: base,
        transport: http(),
      }),
      celo: createPublicClient({
        chain: celo,
        transport: http(),
      }),
      baseSepolia: createPublicClient({
        chain: baseSepolia,
        transport: http(),
      }),
      celoSepolia: createPublicClient({
        chain: celoSepolia,
        transport: http(),
      }),
    };
  }

  async getQuote(params: {
    chain: "base" | "celo" | "baseSepolia" | "celoSepolia";
    tokenIn: Address;
    tokenOut: Address;
    amountIn: bigint;
    fee?: number;
  }) {
    const { chain, tokenIn, tokenOut, amountIn, fee = 3000 } = params;
    const client = this.clients[chain];
    const quoterAddress = CONTRACTS[chain].quoterV2;

    try {
      const { result } = await client.simulateContract({
        address: quoterAddress,
        abi: QUOTER_V2_ABI,
        functionName: "quoteExactInputSingle",
        args: [
          {
            tokenIn,
            tokenOut,
            amountIn,
            fee,
            sqrtPriceLimitX96: 0n,
          },
        ],
      });

      const [amountOut, sqrtPriceX96After, initializedTicksCrossed, gasEstimate] = result as [
        bigint,
        bigint,
        number,
        bigint
      ];

      return {
        amountOut,
        sqrtPriceX96After,
        initializedTicksCrossed,
        gasEstimate,
      };
    } catch (error) {
      console.error(`Error fetching quote on ${chain}:`, error);
      throw new Error(`Failed to fetch quote from Uniswap V3 on ${chain}. Ensure QuoterV2 is deployed.`);
    }
  }
}
