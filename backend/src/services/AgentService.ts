import { createWalletClient, http, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, celo, baseSepolia, celoSepolia } from "viem/chains";
import { DelegationManager } from "@metamask/smart-accounts-kit/contracts";

export const DELEGATION_MANAGER_ADDRESS = "0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3" as Address;

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

    // 2. Specify the standard ERC-7579 execution mode (0x01... = Batch Mode)
    const mode = "0x0100000000000000000000000000000000000000000000000000000000000000" as any;

    try {
      console.log("Simulating redeem transaction...");
      await DelegationManager.simulate.redeemDelegations({
        client: walletClient as any,
        delegationManagerAddress: DELEGATION_MANAGER_ADDRESS,
        delegations: [delegations],
        modes: [mode],
        executions: [executions],
      });

      console.log("Simulation successful. Broadcasting...");
      const hash = await DelegationManager.execute.redeemDelegations({
        client: walletClient as any,
        delegationManagerAddress: DELEGATION_MANAGER_ADDRESS,
        delegations: [delegations],
        modes: [mode],
        executions: [executions],
      });

      return {
        success: true,
        transactionHash: hash,
      };
    } catch (error: any) {
      // Extract precise revert reason from viem's deep simulation trace
      let revertReason = error.shortMessage || error.message;
      if (typeof error.walk === "function") {
        const revertError = error.walk((e: any) => e.name === "ContractFunctionRevertedError");
        if (revertError) {
          revertReason = revertError.data?.errorName || revertError.reason || revertError.shortMessage || revertReason;
        }
      }

      // Decode the raw ERC-7579 ExecutionFailed hash natively
      if (revertReason.includes("0x155ff427")) {
        revertReason = "ExecutionFailed() - A contract call inside your execution batch reverted on-chain.";
      }

      console.error(`\n❌ On-Chain Revert on ${chain}:`, revertReason);
      throw new Error(`Execution Reverted: ${revertReason}`);
    }
  }

}
