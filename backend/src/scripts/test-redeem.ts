import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, type Address } from "viem";
import { baseSepolia } from "viem/chains";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * BASE SEPOLIA ADDRESSES
 */
const WETH = "0x4200000000000000000000000000000000000006" as Address;
const USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as Address;
const DELEGATION_MANAGER = "0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3" as Address;

const DELEGATION_DOMAIN = {
  name: "DelegationManager",
  version: "1",
  chainId: baseSepolia.id,
  verifyingContract: DELEGATION_MANAGER,
};

const DELEGATION_TYPES = {
  Delegation: [
    { name: "delegate", type: "address" },
    { name: "delegator", type: "address" },
    { name: "authority", type: "bytes32" },
    { name: "salt", type: "uint256" },
    { name: "caveats", type: "Caveat[]" },
  ],
  Caveat: [
    { name: "enforcer", type: "address" },
    { name: "terms", type: "bytes" },
  ],
};

async function testRedeem() {
  const userPrivateKey = process.env.USER_PRIVATE_KEY as `0x${string}`;
  const agentPrivateKey = process.env.AGENT_PRIVATE_KEY as `0x${string}`;

  if (!userPrivateKey || !agentPrivateKey) {
    throw new Error("USER_PRIVATE_KEY and AGENT_PRIVATE_KEY must be in .env");
  }

  const userAccount = privateKeyToAccount(userPrivateKey);
  const agentAccount = privateKeyToAccount(agentPrivateKey);

  console.log(`\nNetwork: Base Sepolia`);
  console.log(`User:    ${userAccount.address}`);
  console.log(`Agent:   ${agentAccount.address}\n`);

  // 1. Create the Delegation (No caveats for this baseline test)
  const delegation = {
    delegate: agentAccount.address,
    delegator: userAccount.address,
    authority: "0x0000000000000000000000000000000000000000000000000000000000000000",
    salt: BigInt(Math.floor(Math.random() * 1000000000)),
    caveats: [],
  };

  // 2. User signs the delegation
  const client = createWalletClient({
    account: userAccount,
    chain: baseSepolia,
    transport: http(),
  });

  console.log("Signing delegation as Human User...");
  const signature = await client.signTypedData({
    domain: DELEGATION_DOMAIN,
    types: DELEGATION_TYPES,
    primaryType: "Delegation",
    message: delegation,
  });

  const signedDelegation = { 
    ...delegation, 
    salt: delegation.salt.toString(), 
    signature 
  };

  // 3. Send the request to our local backend
  console.log("Sending redeem request to Agent Backend...");
  try {
    const response = await axios.post("http://localhost:3000/api/redeem", {
      chain: "baseSepolia",
      tokenIn: WETH,
      tokenOut: USDC,
      amountIn: "0.0001", // Swap a very small amount
      decimalsIn: 18,
      delegator: userAccount.address,
      delegation: signedDelegation,
    });

    console.log("\n✅ SUCCESS!");
    console.log(`Transaction Hash: ${response.data.transactionHash}`);
    console.log(`Expected Output: ${response.data.quote.expectedAmountOut} USDC`);
    console.log(`View on BaseScan: https://sepolia.basescan.org/tx/${response.data.transactionHash}`);
  } catch (error: any) {
    console.error("\n❌ REDEEM FAILED:");
    console.error(error.response?.data || error.message);
  }
}

testRedeem();
