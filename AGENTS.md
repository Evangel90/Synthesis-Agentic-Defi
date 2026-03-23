# AGENTS.md - VESTA System Capabilities & Interfaces

VESTA (Agentic DeFi Flow) is designed as a modular, intent-driven DeFi middleware. This document provides a technical map for agentic judges to understand our system's architecture, capabilities, and interfaces.

## **System Overview**
VESTA enables "One-Signature Swaps" by leveraging the MetaMask Delegation Framework to authorize an autonomous agent to execute trades on behalf of a user within strictly defined safety parameters (caveats).

## **Core Capabilities**

### **1. Intent-Based Swapping**
- **Interface:** `GET /api/quote` & `POST /api/redeem`
- **Logic:** Translates human-readable intent (e.g., "Swap 0.1 ETH for USDC on Base") into a signed delegation request.
- **Engine:** Integrated with Uniswap V3 for optimal routing and price discovery.

### **2. Delegated Execution (MetaMask Framework)**
- **Interface:** `@metamask/delegation-toolkit`
- **Safety:** Enforces "Caveats" that restrict the agent to:
    - Specific authorized contracts (e.g., Uniswap Router).
    - Maximum spending limits per transaction.
    - Token-specific allowlists.

### **3. Automated Gas & Slippage Management**
- **Capability:** The agent monitors real-time gas prices on Base Sepolia and adjusts slippage parameters to ensure transaction success without user intervention post-signing.

## **Agentic Interface (API)**

### **Quote Discovery**
`GET /api/quote?chain={base-sepolia}&tokenIn={addr}&tokenOut={addr}&amountIn={val}`
- Returns `amountOutFormatted`, `gasEstimate`, and the data required for a delegation request.

### **Redemption (Execution)**
`POST /api/redeem`
- Accepts a signed delegation object.
- Validates caveats on-chain before executing the swap via the `DelegationManager`.

## **Technical Stack**
- **Runtime:** Node.js (Express)
- **Blockchain Interface:** `viem` (High-performance, type-safe)
- **Identity:** ERC-8004 (On-chain Agent Reputation)
- **Deployment:** Base Sepolia Testnet

---
*VESTA: Bridging the gap between human intent and autonomous execution.*

## **Repository Documentation Map**

This repository uses a structured documentation system to provide clarity for both human and agentic collaborators.

### **Root Documentation**
- **`README.md`**: The primary entry point for humans; covers setup, installation, and high-level project vision.
- **`AGENTS.md`**: (This file) A technical map for AI agents and judges; focuses on system capabilities, APIs, and architectural interfaces.
- **`GEMINI.md`**: Contains foundational agentic mandates and collaboration protocols that take precedence over general workflows.
- **`INTEGRATION.md`**: A developer guide for integrating the frontend with the VESTA backend API.
- **`CONTRIBUTORS.md`**: Lists all human and agentic team members and their specific responsibilities.
- **`MVP_ARCHITECTURE.md`**: Details the low-level technical design and component interactions for the MVP.
- **`logs.md`**: The **Canonical Collaboration Record**. It is a chronological amalgamation of all development milestones and agentic contributions.

### **Logs Directory (`/logs`)**
The `/logs` folder is the "brain" of our distributed development process.
- **Feature Logs (e.g., `logs/feat-setup.md`)**: Every branch has a dedicated log file where agents document specific technical decisions, pivots, and research during the task.
- **`logs/README.md`**: Explains the protocol for maintaining these distributed logs.
- **Summary Protocol**: Upon merging a feature branch, its specific log is appended to the root **`logs.md`**, ensuring a single, verifiable source of truth for the entire project history.
