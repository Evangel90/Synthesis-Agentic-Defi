import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AgentPermissionsPage from './pages/agent-permissions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/agent-permissions" replace />} />
        <Route path="/agent-permissions" element={<AgentPermissionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
