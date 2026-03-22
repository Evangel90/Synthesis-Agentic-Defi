# Log: feat-justice

**Feature Folder:** `frontend/src/components/Sign`
**Agent:** Codex
**Human Partner:** Justice Sunday

## Milestone: Sign Feature Wiring

### Problem & Context
The sign feature was pasted into its own component folder and needed to be integrated without breaking the team's conflict-proof architecture.

### Decisions
- Added the feature import only inside the `TEAM IMPORTS` section in `frontend/src/App.tsx`.
- Added the route only inside the `TEAM ROUTES` section in `frontend/src/App.tsx`.
- Left the root route `/` untouched.
- Kept `src/index.css` theme intact and imported the feature stylesheet only at the bottom.
- Added the Wagmi and React Query providers in `frontend/src/main.tsx` because the sign feature uses Wagmi hooks.

### Implementation Notes
- Wired `SignIn` to `/sign-in`.
- Added `frontend/src/wagmi.ts` for the shared Wagmi config.
- Reduced `frontend/src/components/Sign/signStyle.css` to feature-local styles only.

## Milestone: Backend-Owned Google Auth

### Problem & Context
The Google button should not depend on a frontend-only `VITE_GOOGLE_CLIENT_ID` warning path if the team plans to complete Google auth on the backend.

### Decisions
- Removed the frontend-managed Google Identity Services setup from the Sign feature.
- Treated Google sign-in as a backend redirect flow instead.
- Kept wallet connect and disconnect in the frontend.

### Implementation Notes
- Updated `frontend/src/components/Sign/sign.tsx` so the Google button redirects to `${VITE_API_BASE_URL}/auth/google` when the backend URL is provided.
- Replaced the old client-ID warning with a backend integration message so local UI does not depend on `VITE_GOOGLE_CLIENT_ID`.
