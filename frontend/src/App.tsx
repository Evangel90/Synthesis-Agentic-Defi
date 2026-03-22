import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VaultDashboard from './components/vault-dashboard/VaultDashboard';

// Placeholder for team members' components
const AgentPermissionsPlaceholder = () => (
  <div className="p-10">
    <h1 className="text-2xl font-bold">Agent Permissions</h1>
    <p className="mt-4">This route is reserved for the Agent Permissions feature.</p>
    <a href="/" className="text-primary hover:underline mt-4 block">← Back to Dashboard</a>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Entry Point: Your responsive dashboard */}
        <Route path="/" element={<VaultDashboard />} />
        
        {/* Team features: They will add their routes here */}
        <Route path="/agent-permissions" element={<AgentPermissionsPlaceholder />} />
      </Routes>
    </Router>
  );
}