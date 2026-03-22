# Frontend Integration Guide - Agentic DeFi Flow

This document explains how the frontend should interact with the backend API to enable delegated, autonomous swaps.

## **1. Base URL**
Local Development: `http://localhost:3000`

---

## **2. Get a Quote**
Before asking the user for a delegation, fetch a quote to show the expected output and estimated gas.

### **Endpoint:** `GET /api/quote`

### **Query Parameters:**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `chain` | string | Yes | `base` or `celo` |
| `tokenIn` | string | Yes | Address of the input token |
| `tokenOut` | string | Yes | Address of the output token |
| `amountIn` | string | Yes | Amount to swap (human-readable, e.g., "0.1") |
| `decimalsIn`| number | Yes | Decimals of the input token |
| `decimalsOut`| number | Yes | Decimals of the output token |
| `fee` | number | No | Uniswap fee tier (default: `3000` / 0.3%) |

### **Example Response:**
```json
{
  "success": true,
  "quote": {
    "amountOut": "1234567890",
    "amountOutFormatted": "123.45",
    "gasEstimate": "150000",
    "sqrtPriceX96After": "..."
  }
}
```

---

## **3. Execute a Delegated Swap**
Once the user expresses an intent, the frontend must:
1.  **Create a Delegation:** Using the `@metamask/delegation-toolkit`.
2.  **Sign the Delegation:** The user signs the delegation request.
3.  **Redeem:** Send the signed delegation to the backend for execution.

### **Endpoint:** `POST /api/redeem`

### **Request Body:**
```json
{
  "chain": "base",
  "tokenIn": "0x...",
  "tokenOut": "0x...",
  "amountIn": "0.1",
  "decimalsIn": 18,
  "delegator": "0xUserWalletAddress",
  "delegation": {
    "delegate": "0xAgentWalletAddress",
    "authority": "0x00...00",
    "salt": "...",
    "caveats": [
      { "enforcer": "0xAllowedContractEnforcer", "terms": "0xUniswapRouter" }
    ],
    "signature": "0x..."
  }
}
```

---

## **4. Frontend Code Example (Using MetaMask Toolkit)**

```typescript
import { createDelegation } from "@metamask/delegation-toolkit";

// 1. Setup the delegation
const delegation = createDelegation({
  delegate: AGENT_ADDRESS, // Get from backend or config
  authority: "0x0000000000000000000000000000000000000000",
  caveats: [
    {
      enforcer: ALLOWED_CONTRACT_ENFORCER_ADDRESS,
      terms: UNISWAP_ROUTER_ADDRESS,
    },
  ],
  salt: BigInt(Math.floor(Math.random() * 1000000)),
});

// 2. User signs the delegation (using wagmi/viem)
const signature = await walletClient.signTypedData({
  domain: DELEGATION_DOMAIN,
  types: DELEGATION_TYPES,
  primaryType: "Delegation",
  message: delegation,
});

// 3. Send to backend
const response = await axios.post("/api/redeem", {
  ...params,
  delegation: { ...delegation, signature },
});
```

---

## **Important Addresses**
| Chain | DelegationManager | Uniswap Router |
| :--- | :--- | :--- |
| **Base** | `0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3` | `0x2626664c2603336E57B271c5C0b26F421741e481` |
| **Celo** | `0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3` | `0x5615CDAb10dc425a742d643d949a7F474C01abc4` |
