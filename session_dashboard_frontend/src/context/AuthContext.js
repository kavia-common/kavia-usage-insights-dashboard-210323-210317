// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-002
// User Story: Provide authentication context for admin user access
// Acceptance Criteria:
//   - Store authentication state (user, role, isAuthenticated)
//   - Provide login/logout functionality
//   - Hard-coded credentials: admin/password
//   - Integrate with audit logging
// GxP Impact: YES - Authentication must be auditable
// Risk Level: HIGH
// ============================================================================

import React, { createContext, useState, useContext } from 'react';
import { useAudit } from './AuditContext';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Authentication Context Provider
 * Manages user authentication state and provides login/logout functionality
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * 
 * GxP Critical: YES - All authentication actions are audited
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { addAuditEntry } = useAudit();

  // PUBLIC_INTERFACE
  /**
   * Authenticate user with username and password
   * 
   * @param {string} username - Username to authenticate
   * @param {string} password - Password to authenticate
   * @returns {Object} Result object with success status and optional message
   * 
   * Validation:
   * - Username and password must be non-empty strings
   * - Only 'admin' with password 'password' is accepted
   * 
   * Audit: Logs both successful and failed login attempts
   */
  const login = (username, password) => {
    // Input validation
    if (!username || typeof username !== 'string') {
      const result = { success: false, message: 'Username is required' };
      addAuditEntry({
        action: 'LOGIN_FAILED',
        details: 'Invalid username format',
        user: 'anonymous',
        metadata: { reason: 'validation_error' }
      });
      return result;
    }

    if (!password || typeof password !== 'string') {
      const result = { success: false, message: 'Password is required' };
      addAuditEntry({
        action: 'LOGIN_FAILED',
        details: `Login failed for user: ${username}`,
        user: 'anonymous',
        metadata: { reason: 'validation_error', username }
      });
      return result;
    }

    // Authentication logic (hard-coded credentials)
    if (username === 'admin' && password === 'password') {
      const authenticatedUser = {
        userId: 'admin',
        username: 'admin',
        role: 'administrator'
      };
      
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      
      // Audit successful login
      addAuditEntry({
        action: 'LOGIN_SUCCESS',
        details: `User ${username} logged in successfully`,
        user: username,
        metadata: { role: 'administrator' }
      });
      
      return { success: true, user: authenticatedUser };
    } else {
      // Audit failed login attempt
      addAuditEntry({
        action: 'LOGIN_FAILED',
        details: `Failed login attempt for user: ${username}`,
        user: 'anonymous',
        metadata: { username, reason: 'invalid_credentials' }
      });
      
      return { success: false, message: 'Invalid username or password' };
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Log out the current user
   * 
   * Audit: Logs logout action
   */
  const logout = () => {
    if (user) {
      // Audit logout
      addAuditEntry({
        action: 'LOGOUT',
        details: `User ${user.username} logged out`,
        user: user.username,
        metadata: { role: user.role }
      });
    }
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// PUBLIC_INTERFACE
/**
 * Hook to access authentication context
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
