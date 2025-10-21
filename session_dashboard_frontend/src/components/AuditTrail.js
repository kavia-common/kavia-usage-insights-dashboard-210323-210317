// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-017
// User Story: Display audit trail with CSV export capability
// GxP Impact: YES - Core audit trail functionality
// Risk Level: HIGH
// ============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAudit } from '../context/AuditContext';
import { exportAuditTrailToCSV } from '../utils/csvExporter';
import { logCsvExport } from '../utils/auditLogger';
import '../styles/Visualizations.css';

// PUBLIC_INTERFACE
/**
 * Audit Trail Component
 * Displays all audited actions with CSV export capability
 * 
 * @component
 * 
 * Features:
 * - Display all audit entries
 * - Filter by action type
 * - Export to CSV with electronic signature placeholder
 * 
 * GxP Critical: YES - Displays complete audit trail
 */
const AuditTrail = () => {
  const { user } = useAuth();
  const { auditEntries, addAuditEntry } = useAudit();
  const [filterAction, setFilterAction] = useState('');

  // Get unique action types
  const actionTypes = [...new Set(auditEntries.map(entry => entry.action))];

  // Filter audit entries
  const filteredEntries = filterAction
    ? auditEntries.filter(entry => entry.action === filterAction)
    : auditEntries;

  // PUBLIC_INTERFACE
  /**
   * Handle CSV export
   * 
   * GxP Critical: YES - Exports audit trail with electronic signature placeholder
   */
  const handleExport = () => {
    try {
      const result = exportAuditTrailToCSV(
        filteredEntries,
        user?.username || 'admin',
        'Regular audit review and compliance verification'
      );

      if (result.success) {
        // Log the export action
        const auditEntry = logCsvExport(
          user?.username || 'admin',
          'Audit Trail',
          result.recordCount
        );
        addAuditEntry(auditEntry);

        alert(`Successfully exported ${result.recordCount} audit entries`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export audit trail: ' + error.message);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Format action type for display
   */
  const formatActionType = (action) => {
    return action.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // PUBLIC_INTERFACE
  /**
   * Get action badge color
   */
  const getActionColor = (action) => {
    if (action.includes('SUCCESS')) return '#06b6d4';
    if (action.includes('FAILED')) return '#EF4444';
    if (action.includes('EXPORT')) return '#8b5cf6';
    if (action.includes('FILTER')) return '#3b82f6';
    return '#64748b';
  };

  return (
    <div className="visualization-container">
      <div className="viz-header">
        <h2 className="viz-title">Audit Trail</h2>
        <p className="viz-subtitle">Complete record of all system actions (ALCOA+ compliant)</p>
      </div>

      {/* Controls */}
      <div className="audit-controls">
        <div className="audit-filter">
          <label htmlFor="filterAction" className="filter-label">Filter by Action:</label>
          <select
            id="filterAction"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="select"
          >
            <option value="">All Actions</option>
            {actionTypes.map(action => (
              <option key={action} value={action}>{formatActionType(action)}</option>
            ))}
          </select>
        </div>

        <button onClick={handleExport} className="btn btn-success">
          📥 Export to CSV
        </button>
      </div>

      {/* Audit Entries Count */}
      <div className="audit-summary">
        <span className="audit-count">
          Showing {filteredEntries.length} of {auditEntries.length} entries
        </span>
      </div>

      {/* Audit Trail Table */}
      <div className="table-container audit-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User</th>
              <th>Details</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No audit entries found
                </td>
              </tr>
            ) : (
              filteredEntries.slice().reverse().map(entry => (
                <tr key={entry.id}>
                  <td className="audit-timestamp">
                    {new Date(entry.timestamp).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td>
                    <span 
                      className="action-badge" 
                      style={{ backgroundColor: getActionColor(entry.action) }}
                    >
                      {formatActionType(entry.action)}
                    </span>
                  </td>
                  <td className="audit-user">{entry.user}</td>
                  <td className="audit-details">{entry.details}</td>
                  <td className="audit-id">{entry.id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* GxP Compliance Notice */}
      <div className="gxp-notice">
        <strong>GxP Compliance:</strong> This audit trail is maintained in accordance with ALCOA+ principles. 
        All entries are Attributable, Legible, Contemporaneous, Original, Accurate, Complete, Consistent, 
        Enduring, and Available. Exported audit trails include electronic signature placeholders for 
        regulatory compliance.
      </div>
    </div>
  );
};

export default AuditTrail;
