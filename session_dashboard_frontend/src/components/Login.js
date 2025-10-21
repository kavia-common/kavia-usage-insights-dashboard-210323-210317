// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-008
// User Story: Provide login interface for admin authentication
// Acceptance Criteria:
//   - Username and password input fields
//   - Validation with user-friendly error messages
//   - Failed attempts logged to audit trail
//   - Credentials: admin/password
// GxP Impact: YES - Authentication is auditable
// Risk Level: HIGH
// ============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateUsername, validatePassword } from '../utils/validation';
import '../styles/Login.css';

// PUBLIC_INTERFACE
/**
 * Login Component
 * Provides authentication interface for admin users
 * 
 * @component
 * 
 * Features:
 * - Input validation
 * - Error message display
 * - Audit logging of login attempts
 * - Accessible form controls
 * 
 * GxP Critical: YES - All login attempts are audited
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const { login } = useAuth();

  // PUBLIC_INTERFACE
  /**
   * Handle form submission
   * 
   * @param {Event} e - Form submit event
   * 
   * Validation:
   * - Validates username format
   * - Validates password format
   * - Displays user-friendly error messages
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    setLoginError('');

    // Validate inputs
    const usernameValidation = validateUsername(username);
    const passwordValidation = validatePassword(password);

    const newErrors = {};
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.message;
    }
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Attempt login
    const result = login(username, password);
    
    if (!result.success) {
      setLoginError(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Kavia Usage Insights</h1>
          <p className="login-subtitle">Session Visualization Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" aria-label="Login form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? 'input-error' : ''}
              placeholder="Enter username"
              aria-describedby={errors.username ? 'username-error' : undefined}
              aria-invalid={errors.username ? 'true' : 'false'}
            />
            {errors.username && (
              <span id="username-error" className="error-message" role="alert">
                {errors.username}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'input-error' : ''}
              placeholder="Enter password"
              aria-describedby={errors.password ? 'password-error' : undefined}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <span id="password-error" className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {loginError && (
            <div className="login-error" role="alert">
              {loginError}
            </div>
          )}

          <button type="submit" className="login-button">
            Sign In
          </button>

          <div className="login-info">
            <p className="info-text">Demo Credentials: admin / password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
