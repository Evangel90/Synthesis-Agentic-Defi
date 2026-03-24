import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http, isHex } from "viem";
import { baseSepolia } from "viem/chains";
import { toMetaMaskSmartAccount, Implementation } from "@metamask/smart-accounts-kit";
import dotenv from "dotenv";

dotenv.config();

async function generateKeys() {
  // 1. Check if keys exist and are valid hex strings
  const rawUserPK = process.env.USER_PRIVATE_KEY;
  const rawAgentPK = process.env.AGENT_PRIVATE_KEY;

  const keysMissing = !rawUserPK || !rawAgentPK || !isHex(rawUserPK) || !isHex(rawAgentPK);

  if (keysMissing) {
    console.log("⚠️  KEYS MISSING: Generating new keys for your .env file...\n");
    const newUserPK = generatePrivateKey();
    const newAgentPK = generatePrivateKey();

    console.log("--- COPY AND PASTE THESE INTO YOUR .env FILE ---");
    console.log(`USER_PRIVATE_KEY=${newUserPK}`);
    console.log(`AGENT_PRIVATE_KEY=${newAgentPK}`);
    console.log("------------------------------------------------\n");
    console.log("After pasting, run this script again to see your Smart Account addresses.");
    return; // Stop execution here so it doesn't crash on 'slice'
  }

  // 2. If we got here, keys exist. Proceed with Smart Account logic.
  const userPK = rawUserPK as `0x${string}`;
  const agentPK = rawAgentPK as `0x${string}`;

  const userEOA = privateKeyToAccount(userPK);
  const agentEOA = privateKeyToAccount(agentPK);

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

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

  console.log("✅ Smart Accounts Derived Successfully");
  console.log(`User Smart Account:  ${userSA.address}`);
  console.log(`Agent Smart Account: ${agentSA.address}`);
}

generateKeys().catch((err) => {
    console.error("Critical Failure:", err.message);
});