import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { toMetaMaskSmartAccount, Implementation } from "@metamask/smart-accounts-kit";
import dotenv from "dotenv";

dotenv.config();

async function generateKeys() {
  // const userPK = generatePrivateKey();
  // const agentPK = generatePrivateKey();
  const userPK = process.env.USER_PRIVATE_KEY as `0x${string}`;
  const agentPK = process.env.AGENT_PRIVATE_KEY as `0x${string}`;

  const userEOA = privateKeyToAccount(userPK);
  const agentEOA = privateKeyToAccount(agentPK);

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  // Calculate Smart Account Addresses (Counterfactual)
  const userSA = await toMetaMaskSmartAccount({
    client: publicClient as any,
    implementation: Implementation.Hybrid,
    signer: { account: userEOA as any },
    deployParams: [userEOA.address, [], [], []],
    deploySalt: "0x0000000000000000000000000000000000000000000000000000000000000000",
  });

  const agentSA = await toMetaMaskSmartAccount({
    client: publicClient as any,
    implementation: Implementation.Hybrid,
    signer: { account: agentEOA as any },
    deployParams: [agentEOA.address, [], [], []],
    deploySalt: "0x0000000000000000000000000000000000000000000000000000000000000000",
  });

  console.log("\n====================================================");
  console.log("   SYNTHESIS HACKATHON: SMART ACCOUNT GENERATOR");
  console.log("====================================================\n");

  console.log("1. HUMAN USER (The Delegator)");
  console.log(`   EOA Address:   ${userEOA.address}`);
  console.log(`   Smart Account: ${userSA.address}`);
  console.log(`   Private Key:   ${userPK}`);
  console.log("   Action:        Fund the SMART ACCOUNT with Base Sepolia ETH.\n");

  console.log("2. AI AGENT (The Delegate)");
  console.log(`   EOA Address:   ${agentEOA.address}`);
  console.log(`   Smart Account: ${agentSA.address}`);
  console.log(`   Private Key:   ${agentPK}`);
  console.log("   Action:        Fund the SMART ACCOUNT with Base Sepolia ETH.\n");

  console.log("====================================================");
  console.log("   COPY THE PRIVATE KEYS INTO backend/.env");
  console.log("====================================================\n");
}

generateKeys();
