// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-001
// User Story: Main application component with authentication and routing
// GxP Impact: YES - Routes require authentication
// Risk Level: HIGH
// ============================================================================

import React from 'react';
import { AuditProvider } from './context/AuditContext';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Protected Route Component
 * Only renders children if user is authenticated
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * 
 * GxP Critical: YES - Ensures only authenticated users access dashboard
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Login />;
};

// PUBLIC_INTERFACE
/**
 * Main Application Component
 * Wraps app with AuditContext and AuthContext providers
 * Implements protected routing for dashboard
 * 
 * @component
 * 
 * GxP Critical: YES - Root authentication and audit context
 */
function App() {
  return (
    <div className="App">
      <AuditProvider>
        <AuthProvider>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </AuthProvider>
      </AuditProvider>
    </div>
  );
}

export default App;
