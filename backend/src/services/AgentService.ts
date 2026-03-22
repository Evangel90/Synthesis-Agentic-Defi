import { createWalletClient, http, type Address, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, celo, baseSepolia, celoSepolia } from "viem/chains";

export const DELEGATION_MANAGER_ADDRESS = "0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3" as Address;

const DELEGATION_MANAGER_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "delegate", type: "address" },
          { name: "delegator", type: "address" },
          { name: "authority", type: "bytes32" },
          { name: "salt", type: "uint256" },
          {
            components: [
              { name: "enforcer", type: "address" },
              { name: "terms", type: "bytes" },
            ],
            name: "caveats",
            type: "tuple[]",
          },
          { name: "signature", type: "bytes" },
        ],
        name: "delegations",
        type: "tuple[]",
      },
      {
        components: [
          { name: "target", type: "address" },
          { name: "value", type: "uint256" },
          { name: "callData", type: "bytes" },
        ],
        name: "executions",
        type: "tuple[]",
      },
    ],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class AgentService {
  private agentAccount: any;
  private clients: Record<string, any>;

  constructor() {
    const privateKey = process.env.AGENT_PRIVATE_KEY as `0x${string}`;
    if (!privateKey) {
      throw new Error("AGENT_PRIVATE_KEY not found in environment variables");
    }

    this.agentAccount = privateKeyToAccount(privateKey);

    this.clients = {
      base: createWalletClient({
        account: this.agentAccount,
        chain: base,
        transport: http(),
      }),
      celo: createWalletClient({
        account: this.agentAccount,
        chain: celo,
        transport: http(),
      }),
      // Adding testnets for development
      baseSepolia: createWalletClient({
        account: this.agentAccount,
        chain: baseSepolia,
        transport: http(),
      }),
      celoSepolia: createWalletClient({
        account: this.agentAccount,
        chain: celoSepolia,
        transport: http(),
      }),
    };
  }

  getAgentAddress(): Address {
    return this.agentAccount.address;
  }

  async redeemDelegation(params: {
    chain: "base" | "celo" | "baseSepolia" | "celoSepolia";
    delegations: any[];
    executions: any[];
  }) {
    const { chain, delegations, executions } = params;
    const walletClient = this.clients[chain];

    // We need a public client for simulation
    const publicClient = createPublicClient({
      chain: walletClient.chain,
      transport: http(),
    });

    try {
      console.log("Simulating redeem transaction...");
      await publicClient.simulateContract({
        address: DELEGATION_MANAGER_ADDRESS,
        abi: DELEGATION_MANAGER_ABI,
        functionName: "redeem",
        args: [delegations, executions],
        account: this.agentAccount,
      });

      console.log("Simulation successful. Broadcasting...");
      const hash = await walletClient.writeContract({
        address: DELEGATION_MANAGER_ADDRESS,
        abi: DELEGATION_MANAGER_ABI,
        functionName: "redeem",
        args: [delegations, executions],
      });

      return {
        success: true,
        transactionHash: hash,
      };
    } catch (error: any) {
      // Extract detailed revert reason if available
      const reason = error.shortMessage || error.message;
      console.error(`Error redeeming delegation on ${chain}:`, reason);
      throw new Error(`Execution Reverted: ${reason}`);
    }
  }

}
