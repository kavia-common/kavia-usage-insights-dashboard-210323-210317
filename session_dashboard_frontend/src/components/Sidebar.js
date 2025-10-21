// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-010
// User Story: Provide sidebar navigation for dashboard views
// GxP Impact: YES - View changes are audited
// Risk Level: LOW
// ============================================================================

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAudit } from '../context/AuditContext';
import { logViewSwitch } from '../utils/auditLogger';
import '../styles/Sidebar.css';

// PUBLIC_INTERFACE
/**
 * Sidebar Component
 * Provides navigation between different dashboard views
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.currentView - Currently active view
 * @param {Function} props.onViewChange - Callback when view changes
 * 
 * GxP Critical: YES - View changes are audited
 */
const Sidebar = ({ currentView, onViewChange }) => {
  const { user } = useAuth();
  const { addAuditEntry } = useAudit();

  const views = [
    { id: 'trends', label: 'Feature Usage Trends', icon: '📈' },
    { id: 'features', label: 'Most/Least Used Features', icon: '🎯' },
    { id: 'teams', label: 'Usage by Team', icon: '👥' },
    { id: 'users', label: 'Usage by User', icon: '👤' },
    { id: 'success', label: 'Success Tracking', icon: '✅' },
    { id: 'audit', label: 'Audit Trail', icon: '📋' }
  ];

  // PUBLIC_INTERFACE
  /**
   * Handle view change with audit logging
   * 
   * @param {string} viewId - ID of the new view
   */
  const handleViewChange = (viewId) => {
    if (viewId !== currentView) {
      const fromView = views.find(v => v.id === currentView)?.label || currentView;
      const toView = views.find(v => v.id === viewId)?.label || viewId;
      
      // Log view switch to audit trail
      const auditEntry = logViewSwitch(user?.username || 'admin', fromView, toView);
      addAuditEntry(auditEntry);
      
      onViewChange(viewId);
    }
  };

  return (
    <nav className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-content">
        <ul className="nav-list">
          {views.map(view => (
            <li key={view.id} className="nav-item">
              <button
                className={`nav-button ${currentView === view.id ? 'active' : ''}`}
                onClick={() => handleViewChange(view.id)}
                aria-current={currentView === view.id ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">{view.icon}</span>
                <span className="nav-label">{view.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
