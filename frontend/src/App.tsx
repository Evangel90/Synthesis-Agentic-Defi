import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VaultDashboard from './components/vault-dashboard/VaultDashboard';
import { SignIn } from './Components/sign';

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
        <Route path="/" element={<VaultDashboard />} />
        <Route path="/agent-permissions" element={<AgentPermissionsPlaceholder />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </Router>
  );
}
