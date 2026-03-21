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
  - **1. The "Brain" (Intent Parser):** Uses an LLM (e.g., OpenAI API) to turn natural language ("Swap 1 ETH to USDC") into a structured JSON object (`{ action: "swap", tokenIn: "ETH", tokenOut: "USDC", amount: 1 }`).
  - **2. The "Planner" (DeFi Integrator):** Takes the parsed JSON and queries the Uniswap API to find the best trading route and generate the raw smart contract `txData`.
  - **3. The "Hands" (Delegation Executor):** Uses `@metamask/smart-accounts-kit` to wrap the `txData` with the user's signed delegation and broadcast it to the Base blockchain.
  - **4. The "Mouth" (Status Reporter):** Sends updates back to the frontend UI (e.g., "Thinking...", "Found Route...", "Transaction Sent!") so the user is never left in the dark.

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

---

## **4. Target Scenarios**

Using the agentic approach with the MetaMask Delegation Framework enables powerful user experiences by separating *intent* from *execution*:

### **Scenario 1: Complex, Multi-Step Swaps for Best Price**
- **User Intent:** "Swap 1 WETH for the best possible amount of USDC."
- **Agent Action:** Analyzes liquidity sources and executes a multi-hop route (e.g., WETH -> RPL -> USDC) atomically. 
- **Benefit:** Maximized value and gas abstraction without the user needing to manually compare DEXs or understand complex routing.

### **Scenario 2: Automated Concentrated Liquidity Management**
- **User Intent:** "Put $1,000 of my ETH/USDC into a Uniswap V3 liquidity position and keep it in range."
- **Agent Action:** Calculates optimal price ranges and continuously monitors/rebalances the position if it falls out of range.
- **Benefit:** Turns active, stressful LPing into a "fire and forget" passive strategy while keeping assets self-custodial.

### **Scenario 3: Scheduled Transactions & Limit Orders (DCA)**
- **User Intent:** "Sell 0.1 ETH for DAI every Monday for the next 5 weeks."
- **Agent Action:** Uses a long-lived delegation with a strict `spendLimit` caveat to execute scheduled cron jobs on behalf of the user.
- **Benefit:** Reliable, centralized-exchange-like automation executed entirely on-chain with strict security boundaries.
