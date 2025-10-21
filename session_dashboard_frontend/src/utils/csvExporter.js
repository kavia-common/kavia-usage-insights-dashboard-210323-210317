// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-006
// User Story: Export audit trail and data as CSV files
// Acceptance Criteria:
//   - Export audit trail with all fields
//   - Include electronic signature placeholder
//   - Generate proper CSV format
// GxP Impact: YES - Data export must maintain integrity
// Risk Level: HIGH
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Convert array of objects to CSV string
 * 
 * @param {Array<Object>} data - Array of data objects
 * @param {string[]} headers - Array of header names
 * @returns {string} CSV formatted string
 * 
 * GxP Critical: YES - Ensures data integrity during export
 */
export const arrayToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return '';
  }

  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma or quote
      if (value === null || value === undefined) {
        return '';
      }
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

// PUBLIC_INTERFACE
/**
 * Export audit trail to CSV file
 * 
 * @param {Array<Object>} auditEntries - Array of audit entries
 * @param {string} username - Username performing the export
 * @param {string} purpose - Purpose of the export
 * 
 * GxP Critical: YES - Includes electronic signature placeholder
 * 
 * Electronic Signature Format:
 * - Username of person exporting
 * - Timestamp of export
 * - Purpose of export
 */
export const exportAuditTrailToCSV = (auditEntries, username, purpose = 'Audit Review') => {
  // Validate inputs
  if (!auditEntries || !Array.isArray(auditEntries)) {
    throw new Error('Invalid audit entries data');
  }

  if (!username || typeof username !== 'string') {
    throw new Error('Valid username is required for export');
  }

  // Prepare audit data with flattened metadata
  const exportData = auditEntries.map(entry => ({
    id: entry.id,
    timestamp: entry.timestamp,
    action: entry.action,
    user: entry.user,
    details: entry.details,
    metadata: JSON.stringify(entry.metadata || {})
  }));

  const headers = ['id', 'timestamp', 'action', 'user', 'details', 'metadata'];
  const csvContent = arrayToCSV(exportData, headers);

  // Add electronic signature placeholder
  const exportTimestamp = new Date().toISOString();
  const signature = `\n\n--- ELECTRONIC SIGNATURE ---\nExported By: ${username}\nExport Timestamp: ${exportTimestamp}\nPurpose: ${purpose}\nTotal Records: ${auditEntries.length}\nSignature: [Placeholder for digital signature]\n`;

  const finalContent = csvContent + signature;

  // Create and trigger download
  const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `audit_trail_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    success: true,
    recordCount: auditEntries.length,
    timestamp: exportTimestamp
  };
};

// PUBLIC_INTERFACE
/**
 * Export session data to CSV file
 * 
 * @param {Array<Object>} sessionData - Array of session data
 * @param {string} username - Username performing the export
 * 
 * GxP Critical: NO - But maintains consistency with audit export
 */
export const exportSessionDataToCSV = (sessionData, username) => {
  if (!sessionData || !Array.isArray(sessionData)) {
    throw new Error('Invalid session data');
  }

  // Prepare session data with flattened structure
  const exportData = sessionData.map(session => ({
    userId: session.userId,
    username: session.username,
    team: session.team,
    projectId: session.projectId,
    sessionType: session.sessionType,
    agentsUsed: session.agentsUsed.join('; '),
    featuresUsed: session.featuresUsed.join('; '),
    tokenUsage: session.tokenUsage,
    startTime: session.startTime,
    duration: session.duration,
    documentsGenerated: session.outputs.documentsGenerated,
    codeFilesUpdated: session.outputs.codeFilesUpdated,
    prsCreated: session.outputs.prsCreated
  }));

  const headers = [
    'userId', 'username', 'team', 'projectId', 'sessionType', 
    'agentsUsed', 'featuresUsed', 'tokenUsage', 'startTime', 'duration',
    'documentsGenerated', 'codeFilesUpdated', 'prsCreated'
  ];

  const csvContent = arrayToCSV(exportData, headers);

  // Add export metadata
  const exportTimestamp = new Date().toISOString();
  const metadata = `\n\n--- EXPORT METADATA ---\nExported By: ${username}\nExport Timestamp: ${exportTimestamp}\nTotal Records: ${sessionData.length}\n`;

  const finalContent = csvContent + metadata;

  // Create and trigger download
  const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `session_data_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    success: true,
    recordCount: sessionData.length,
    timestamp: exportTimestamp
  };
};
