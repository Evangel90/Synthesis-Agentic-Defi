import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, type Address, createPublicClient, formatEther } from "viem";
import { baseSepolia } from "viem/chains";
import { toMetaMaskSmartAccount, Implementation } from "@metamask/smart-accounts-kit";
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

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const userEOA = privateKeyToAccount(userPrivateKey);
  const agentEOA = privateKeyToAccount(agentPrivateKey);

  // 1. Initialize Smart Account for User
  // Casting to 'any' to bypass the mismatched viem versions between the Kit and the Project
  console.log("Initializing User Smart Account...");
  const userSA = await toMetaMaskSmartAccount({
    client: publicClient as any,
    implementation: Implementation.Hybrid,
    signer: { account: userEOA as any },
    deployParams: [userEOA.address, [], [], []],
    deploySalt: "0x0000000000000000000000000000000000000000000000000000000000000000",
  });

  console.log(`\nNetwork:  Base Sepolia`);
  console.log(`User EOA: ${userEOA.address}`);
  console.log(`User SA:  ${userSA.address}`);
  console.log(`Agent:    ${agentEOA.address}\n`);

  // 2. Check Balances
  const balance = await publicClient.getBalance({ address: userSA.address });
  const saCode = await publicClient.getBytecode({ address: userSA.address });

  console.log(`User SA Balance: ${formatEther(balance)} ETH`);
  if (!saCode) {
    console.log("⚠️  User Smart Account is NOT yet deployed on-chain.");
    console.log("   It will be automatically deployed when you send your first transaction.");
    console.log("   Make sure the SA address above has enough ETH for gas!\n");
  }

  // 3. Create the Delegation
  const delegation = {
    delegate: agentEOA.address, 
    delegator: userSA.address, 
    authority: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" as `0x${string}`,
    salt: BigInt(Math.floor(Math.random() * 1000000000)),
    caveats: [],
  };

  // 4. User signs the delegation via the SA Kit utility
  console.log("Signing delegation via Smart Account Kit...");
  const signature = await userSA.signDelegation({
    delegation: delegation as any
  });

  const signedDelegation = { 
    ...delegation, 
    salt: delegation.salt.toString(), 
    signature 
  };

  // 5. Send to Backend
  console.log("Sending redeem request to local backend...");
  try {
    const response = await axios.post("http://localhost:3000/api/redeem", {
      chain: "baseSepolia",
      tokenIn: WETH,
      tokenOut: USDC,
      amountIn: "0.0001",
      decimalsIn: 18,
      delegator: userSA.address,
      delegation: signedDelegation,
    });

    console.log("\n✅ SUCCESS!");
    console.log(`Transaction Hash: ${response.data.transactionHash}`);
    console.log(`Expected Output:  ${response.data.quote.expectedAmountOut} USDC`);
    console.log(`View on Explorer: https://sepolia.basescan.org/tx/${response.data.transactionHash}`);
  } catch (error: any) {
    console.error("\n❌ REDEEM FAILED:");
    console.error(JSON.stringify(error.response?.data || error.message, null, 2));
  }
}

testRedeem();
