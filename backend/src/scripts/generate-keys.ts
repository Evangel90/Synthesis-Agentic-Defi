import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

function generateKeys() {
  const userPK = generatePrivateKey();
  const agentPK = generatePrivateKey();

  const userAccount = privateKeyToAccount(userPK);
  const agentAccount = privateKeyToAccount(agentPK);

  console.log("\n====================================================");
  console.log("   SYNTHESIS HACKATHON: TEST KEY GENERATOR");
  console.log("====================================================\n");

  console.log("1. HUMAN USER (The Delegator)");
  console.log(`   Address:     ${userAccount.address}`);
  console.log(`   Private Key: ${userPK}`);
  console.log("   Action:      Fund this address with Base Sepolia ETH.\n");

  console.log("2. AI AGENT (The Delegate)");
  console.log(`   Address:     ${agentAccount.address}`);
  console.log(`   Private Key: ${agentPK}`);
  console.log("   Action:      Fund this address with Base Sepolia ETH (for gas).\n");

  console.log("====================================================");
  console.log("   COPY THE PRIVATE KEYS INTO backend/.env");
  console.log("====================================================\n");
}

generateKeys();
