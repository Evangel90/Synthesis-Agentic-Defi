import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Auth, useWeb3AuthDisconnect } from '@web3auth/modal/react';
import VaultDashboard from './components/vault-dashboard/VaultDashboard';
import { AuthSessionProvider, useAuthSession } from './auth-session';

/* 
  ATTENTION AGENTS: 
  1. DO NOT remove existing imports.
  2. Add your feature import in the "TEAM IMPORTS" section.
  3. Add your <Route> inside the <Routes> block.
*/

// --- TEAM IMPORTS START ---
import { SignIn, SignInWithWeb3Auth } from './components/Sign/sign';
import AgentPermissions from './components/agent-permissions';
// --- TEAM IMPORTS END ---

function AppRoutes({
  SignInComponent,
}: {
  SignInComponent: typeof SignIn;
}) {
  const { isAuthenticated } = useAuthSession();
  const SignComponent = SignInComponent;

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE: Sign In */}
        <Route 
          path="/sign-in" 
          element={!isAuthenticated ? <SignComponent /> : <Navigate to="/" replace />} 
        />

        {/* PROTECTED ROUTES: Only show if connected */}
        <Route 
          path="/" 
          element={isAuthenticated ? <VaultDashboard /> : <Navigate to="/sign-in" replace />} 
        />
        
        {/* --- TEAM ROUTES START --- */}
        <Route 
          path="/agent-permissions" 
          element={isAuthenticated ? <AgentPermissions /> : <Navigate to="/sign-in" replace />} 
        />
        {/* --- TEAM ROUTES END --- */}

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();

  return (
    <AuthSessionProvider
      metamaskConnected={Boolean(isConnected && address)}
      googleConnected={false}
      onSignOut={disconnectAsync}
    >
      <AppRoutes SignInComponent={SignIn} />
    </AuthSessionProvider>
  );
}

export function AppWithWeb3Auth() {
  const { isConnected: wagmiConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { isConnected: web3AuthConnected } = useWeb3Auth();
  const { disconnect: disconnectWeb3Auth } = useWeb3AuthDisconnect();

  const handleSignOut = async () => {
    await Promise.allSettled([
      disconnectAsync(),
      disconnectWeb3Auth(),
    ]);
  };

  return (
    <AuthSessionProvider
      metamaskConnected={Boolean(wagmiConnected && address)}
      googleConnected={web3AuthConnected}
      onSignOut={handleSignOut}
    >
      <AppRoutes SignInComponent={SignInWithWeb3Auth} />
    </AuthSessionProvider>
  );
}
