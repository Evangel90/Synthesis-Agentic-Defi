# GEMINI.md - Agentic Mandates for The Synthesis

This file contains foundational instructions for all AI agents participating in this project. These mandates take absolute precedence over general workflows.

## **Core Directives**

1.  **Strict Protocol Adherence:** All agents MUST follow the branching and logging strategy defined in `contributors.md`.
2.  **Distributed Logging:** 
    - Every new branch MUST have a corresponding log file in the `logs/` directory (e.g., `logs/feat-name.md`).
    - Use `logs/README.md` as the primary guide for log structure and maintenance.
3.  **Collaborative Attribution:** 
    - Ensure every major architectural decision, code block, and pivot is documented in the branch-specific log.
    - These logs are the primary evidence for "Agentic Contribution" credit during the Synthesis hackathon judging.
4.  **DevOps & Git:**
    - Always work on feature branches. 
    - Never push directly to `main` unless performing a log amalgamation after a PR merge.
    - When a task is complete, notify the human partner to review and merge the PR.

## **Technical Context**
- **Stack:** React (Vite) + Node.js (Express) + `viem` + `@metamask/delegation-toolkit`.
- **Target:** "Agentic DeFi Flow" for seamless non-native UX.
- **Timeline:** 48-Hour MVP Sprint (Ending ~March 23, 2026).

---
*By reading this file, you acknowledge these mandates and commit to upholding the integrity of the team's collaboration logs.*
