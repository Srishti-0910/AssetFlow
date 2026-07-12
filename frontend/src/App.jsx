import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Placeholder({ label }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-muted font-mono text-sm">
      {label} — coming in the next commit
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Placeholder label="Login" />} />
      <Route path="/register" element={<Placeholder label="Register" />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Placeholder label="Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
