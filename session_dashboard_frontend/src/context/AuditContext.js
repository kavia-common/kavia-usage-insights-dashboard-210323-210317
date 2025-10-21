// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-003
// User Story: Provide audit trail context for GxP compliance
// Acceptance Criteria:
//   - Store audit entries with timestamp, action, user, details
//   - Provide method to add audit entries
//   - Support filtering and exporting audit trail
// GxP Impact: YES - Core compliance requirement
// Risk Level: HIGH
// ============================================================================

import React, { createContext, useState, useContext } from 'react';

const AuditContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Audit Context Provider
 * Manages audit trail entries for GxP compliance
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * 
 * GxP Critical: YES - Maintains complete audit trail
 */
export const AuditProvider = ({ children }) => {
  const [auditEntries, setAuditEntries] = useState([]);

  // PUBLIC_INTERFACE
  /**
   * Add a new audit entry
   * 
   * @param {Object} entry - Audit entry object
   * @param {string} entry.action - Action type (e.g., LOGIN_SUCCESS, FILTER_APPLIED)
   * @param {string} entry.details - Detailed description of the action
   * @param {string} entry.user - Username who performed the action
   * @param {Object} [entry.metadata] - Additional metadata
   * 
   * Validation:
   * - Action must be a non-empty string
   * - Details must be a non-empty string
   * - User must be a non-empty string
   * 
   * GxP Critical: YES - All entries are timestamped with ISO 8601 format
   */
  const addAuditEntry = (entry) => {
    // Input validation
    if (!entry.action || typeof entry.action !== 'string') {
      console.error('Audit entry must have a valid action');
      return;
    }

    if (!entry.details || typeof entry.details !== 'string') {
      console.error('Audit entry must have valid details');
      return;
    }

    if (!entry.user || typeof entry.user !== 'string') {
      console.error('Audit entry must have a valid user');
      return;
    }

    // Create audit entry with ISO 8601 timestamp
    const auditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action: entry.action,
      details: entry.details,
      user: entry.user,
      metadata: entry.metadata || {}
    };

    setAuditEntries(prev => [...prev, auditEntry]);
  };

  // PUBLIC_INTERFACE
  /**
   * Get all audit entries
   * @returns {Array} Array of audit entries
   */
  const getAuditEntries = () => {
    return [...auditEntries];
  };

  // PUBLIC_INTERFACE
  /**
   * Clear all audit entries (use with caution)
   * Note: In production GxP environment, audit entries should never be deleted
   */
  const clearAuditEntries = () => {
    setAuditEntries([]);
  };

  const value = {
    auditEntries,
    addAuditEntry,
    getAuditEntries,
    clearAuditEntries
  };

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
};

// PUBLIC_INTERFACE
/**
 * Hook to access audit context
 * @returns {Object} Audit context value
 * @throws {Error} If used outside of AuditProvider
 */
export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};

export default AuditContext;
