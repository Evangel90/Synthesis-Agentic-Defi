# MVP Architecture: Agentic DeFi Flow for Seamless UX

## **Core Objective**
To build a system where a non-native web3 user can express an **intent** (e.g., "I want to swap $10 ETH to USDC") and an **agent** executes it autonomously using a **delegation framework**, removing the friction of manual signing for every step.

---

## **1. System Components**

### **A. Frontend (The "Human" Interface)**
- **Tech:** React (Vite) + Tailwind CSS + `wagmi/viem`.
- **Features:**
  - Simple "Intent Input" (Natural language or structured form).
  - "Delegation Portal": A one-time signature to authorize the agent for specific actions (using MetaMask Delegation Framework or EIP-712 signatures).
  - "Agent Status": A live feed of what the agent is currently doing (e.g., "Finding best Uniswap route...", "Executing swap...").

### **B. Backend (The "Agent" Logic)**
- **Tech:** Node.js (Express) + `viem` + `@metamask/delegation-toolkit`.
- **Features:**
  - **Intent Parser:** Converts user commands into executable DeFi actions.
  - **Delegation Manager:** Handles delegation requests, caveat validation, and execution using the MetaMask Delegation Toolkit.
  - **Uniswap Integrator:** Uses Uniswap SDK/API for routing and transaction preparation.

### **C. On-Chain (The "Settlement" Layer)**
- **Network:** Base or Celo (Mainnet/Testnet).
- **Protocols:** Uniswap V3 (Execution), MetaMask Delegation Framework (Authorization).

---

## **2. 48-Hour Sprint Roadmap**

### **Phase 1: Foundation (Next 12-18 Hours)**
- [ ] Scaffold project: Mono-repo with `/frontend` and `/backend`.
- [ ] Implement "Connect Wallet" and a basic "Intent UI".
- [ ] Backend: Set up a basic Uniswap "Quote" service.
- [ ] Research & implement a simple "Delegation" prototype (User signs a permit for the agent).

### **Phase 2: Execution (18-36 Hours)**
- [ ] Connect Frontend "Intent" to Backend "Execution Engine".
- [ ] Implement the full "Swap" loop: Intent -> Quote -> Signed Tx (via Delegation) -> Broadcast.
- [ ] Build the "Agent Live Feedback" component in the UI.
- [ ] Test on Base Sepolia.

### **Phase 3: Polishing & Submission (36-48 Hours)**
- [ ] Handle error states (e.g., insufficient liquidity, expired delegation).
- [ ] Finalize `submissionMetadata` and `conversationLog`.
- [ ] Complete **Self-Custody Transfer** for the agent identity.
- [ ] Create a GitHub repo and publish the project.

---

## **3. Success Metrics for MVP**
1. User can authorize the agent once.
2. User can trigger a swap via a natural language command.
3. Agent executes the swap autonomously without further user signing.
4. Transaction is verifiable on Basescan with the agent's identity.
