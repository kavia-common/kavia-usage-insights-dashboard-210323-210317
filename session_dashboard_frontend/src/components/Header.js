// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-009
// User Story: Provide dashboard header with user info and logout
// GxP Impact: YES - Logout action is audited
// Risk Level: MEDIUM
// ============================================================================

import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

// PUBLIC_INTERFACE
/**
 * Header Component
 * Displays application title, user information, and logout button
 * 
 * @component
 * 
 * GxP Critical: YES - Logout action is audited
 */
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dashboard-header" role="banner">
      <div className="header-content">
        <div className="header-title">
          <h1>Kavia Usage Insights</h1>
          <p className="header-subtitle">Session Visualization Dashboard</p>
        </div>
        
        <div className="header-user">
          <div className="user-info">
            <span className="user-name">{user?.username || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Administrator'}</span>
          </div>
          <button 
            className="logout-button" 
            onClick={logout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
