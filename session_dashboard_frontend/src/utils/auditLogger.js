// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-005
// User Story: Provide audit logging utilities
// Acceptance Criteria:
//   - Format audit entries consistently
//   - Provide helper functions for common audit actions
//   - Ensure ISO 8601 timestamp format
// GxP Impact: YES - Core audit trail functionality
// Risk Level: HIGH
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Create a standardized audit entry
 * 
 * @param {string} action - Action type
 * @param {string} details - Action details
 * @param {string} user - Username
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Formatted audit entry
 * 
 * GxP Critical: YES - Ensures consistent audit entry format
 */
export const createAuditEntry = (action, details, user, metadata = {}) => {
  return {
    action,
    details,
    user,
    metadata,
    timestamp: new Date().toISOString()
  };
};

// PUBLIC_INTERFACE
/**
 * Log a filter change action
 * 
 * @param {string} user - Username
 * @param {Object} filterChanges - Object describing filter changes
 * @returns {Object} Audit entry for filter change
 * 
 * GxP Critical: YES - Tracks data filtering for compliance
 */
export const logFilterChange = (user, filterChanges) => {
  return createAuditEntry(
    'FILTER_APPLIED',
    `User applied filters: ${JSON.stringify(filterChanges)}`,
    user,
    { filterChanges }
  );
};

// PUBLIC_INTERFACE
/**
 * Log a view switch action
 * 
 * @param {string} user - Username
 * @param {string} fromView - Previous view name
 * @param {string} toView - New view name
 * @returns {Object} Audit entry for view switch
 * 
 * GxP Critical: NO - But useful for usage analytics
 */
export const logViewSwitch = (user, fromView, toView) => {
  return createAuditEntry(
    'VIEW_CHANGED',
    `User switched from ${fromView} to ${toView}`,
    user,
    { fromView, toView }
  );
};

// PUBLIC_INTERFACE
/**
 * Log a CSV export action
 * 
 * @param {string} user - Username
 * @param {string} exportType - Type of data exported
 * @param {number} recordCount - Number of records exported
 * @returns {Object} Audit entry for CSV export
 * 
 * GxP Critical: YES - Tracks data extraction for compliance
 */
export const logCsvExport = (user, exportType, recordCount) => {
  return createAuditEntry(
    'CSV_EXPORT',
    `User exported ${exportType} data (${recordCount} records)`,
    user,
    { exportType, recordCount }
  );
};

// PUBLIC_INTERFACE
/**
 * Log a filter reset action
 * 
 * @param {string} user - Username
 * @returns {Object} Audit entry for filter reset
 * 
 * GxP Critical: YES - Tracks data filtering for compliance
 */
export const logFilterReset = (user) => {
  return createAuditEntry(
    'FILTER_RESET',
    'User reset all filters',
    user,
    {}
  );
};

// PUBLIC_INTERFACE
/**
 * Format audit entry for display
 * 
 * @param {Object} entry - Audit entry
 * @returns {string} Formatted string representation
 */
export const formatAuditEntry = (entry) => {
  const timestamp = new Date(entry.timestamp).toLocaleString();
  return `[${timestamp}] ${entry.user} - ${entry.action}: ${entry.details}`;
};
