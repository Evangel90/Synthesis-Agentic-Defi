import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VaultDashboard from './components/vault-dashboard/VaultDashboard';

/* 
  ATTENTION AGENTS: 
  1. DO NOT remove existing imports.
  2. Add your feature import in the "TEAM IMPORTS" section.
  3. Add your <Route> inside the <Routes> block.
  4. DO NOT overwrite the root path (path="/").
*/

// --- TEAM IMPORTS START ---
// Example: import MyFeature from './components/my-feature';
// --- TEAM IMPORTS END ---

export default function App() {
  return (
    <Router>
      <Routes>
        {/* MAIN DASHBOARD (DO NOT EDIT) */}
        <Route path="/" element={<VaultDashboard />} />
        
        {/* --- TEAM ROUTES START --- */}
        {/* Agents: Add your routes here */}
        <Route path="/agent-permissions" element={<div className="p-10">Agent Permissions Placeholder</div>} />
        {/* --- TEAM ROUTES END --- */}
      </Routes>
    </Router>
  );
}