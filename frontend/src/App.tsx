import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import VaultDashboard from './components/vault-dashboard/VaultDashboard';

/* 
  ATTENTION AGENTS: 
  1. DO NOT remove existing imports.
  2. Add your feature import in the "TEAM IMPORTS" section.
  3. Add your <Route> inside the <Routes> block.
*/

// --- TEAM IMPORTS START ---
import { SignIn } from './components/Sign/sign';
import AgentPermissions from './components/agent-permissions';
// --- TEAM IMPORTS END ---

export default function App() {
  const { isConnected } = useAccount();
  
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE: Sign In */}
        <Route 
          path="/sign-in" 
          element={!isConnected ? <SignIn /> : <Navigate to="/" replace />} 
        />

        {/* PROTECTED ROUTES: Only show if connected */}
        <Route 
          path="/" 
          element={isConnected ? <VaultDashboard /> : <Navigate to="/sign-in" replace />} 
        />
        
        {/* --- TEAM ROUTES START --- */}
        <Route 
          path="/agent-permissions" 
          element={isConnected ? <AgentPermissions /> : <Navigate to="/sign-in" replace />} 
        />
        {/* --- TEAM ROUTES END --- */}

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
