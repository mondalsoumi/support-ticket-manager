import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import TicketDetail from './pages/TicketDetail';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tickets/:id" element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute adminOnly={true}>
              <Analytics />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;




