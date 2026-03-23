# Log: ui-update

## Branch Information
- **Branch Name:** `ui-update`
- **Base Branch:** `dev`
- **Status:** Ready for PR
- **Author:** Gemini CLI Agent

## Goals
- Update and polish the frontend UI.
- Ensure consistency across dashboard components.
- Integrate real-time on-chain data for better UX.
- Resolve deployment issues on Vercel.

## Activity Log
### 2026-03-23
- Initialized branch from `dev`.
- Updated branch with latest changes from `origin/dev`.
- **UI Refactor & Design System Update:**
    - Switched from generic Tailwind colors to a semantic design system (Material 3 style: `surface`, `primary`, `on-surface`, etc.).
    - Increased border radius to `2xl` (1rem) for a more modern, friendly look.
    - Updated `Card`, `PolicyGuardrailsCard`, `SpendingLimitCard`, and `YieldOptimizerCard` with new styling.
- **Component Consolidation:**
    - Replaced redundant `TopNav` and `Sidebar` in `AgentPermissions` with the unified `Sidebar` from the vault dashboard.
    - Improved `Sidebar` with active link highlighting and responsive behavior.
- **On-chain Data Integration:**
    - Implemented real balance fetching for ETH, USDC, and WETH on Base Sepolia using `viem` in `useVaultLogic.ts`.
    - Replaced hardcoded portfolio values with dynamic data that refreshes every 15 seconds.
    - Updated `DashboardPanel` to map through real assets instead of static mockups.
- **UX Improvements:**
    - Implemented professional "Copy to clipboard" functionality for the wallet address in the dashboard header.
    - Added "Copied!" feedback and status icons.
- **Chat Enhancement:**
    - Augmented AI agent context with real-time portfolio value and asset breakdown for more accurate responses.
- **Branding:**
    - Updated application name to "VESTA" in the sidebar.
- **Vercel Deployment Fixes:**
    - Added `vercel.json` with SPA rewrite rules to resolve 404 errors on deep-linked routes.
    - Optimized `App.tsx` routing to handle authentication on the root path without unnecessary redirects to `/sign-in`.
- **Merge & Sync:**
    - Successfully merged latest changes from `origin/dev`.
    - Verified all components and fixed JSX/TypeScript errors.
