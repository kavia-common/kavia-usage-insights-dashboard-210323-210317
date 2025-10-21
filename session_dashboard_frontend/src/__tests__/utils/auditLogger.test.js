// ============================================================================
// UNIT TESTS: auditLogger utility
// ============================================================================

import {
  createAuditEntry,
  logFilterChange,
  logViewSwitch,
  logCsvExport,
  logFilterReset,
  formatAuditEntry
} from '../../utils/auditLogger';

describe('auditLogger', () => {
  // Test createAuditEntry
  describe('createAuditEntry', () => {
    test('should create audit entry with all required fields', () => {
      const entry = createAuditEntry('TEST_ACTION', 'Test details', 'testuser', { key: 'value' });
      
      expect(entry).toHaveProperty('action', 'TEST_ACTION');
      expect(entry).toHaveProperty('details', 'Test details');
      expect(entry).toHaveProperty('user', 'testuser');
      expect(entry).toHaveProperty('metadata');
      expect(entry.metadata).toEqual({ key: 'value' });
      expect(entry).toHaveProperty('timestamp');
      expect(new Date(entry.timestamp)).toBeInstanceOf(Date);
    });

    test('should create audit entry with empty metadata if not provided', () => {
      const entry = createAuditEntry('TEST_ACTION', 'Test details', 'testuser');
      
      expect(entry.metadata).toEqual({});
    });

    test('should use ISO 8601 timestamp format', () => {
      const entry = createAuditEntry('TEST_ACTION', 'Test details', 'testuser');
      
      expect(entry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  // Test logFilterChange
  describe('logFilterChange', () => {
    test('should create filter change audit entry', () => {
      const filterChanges = { team: 'Backend Team', startDate: '2024-01-01' };
      const entry = logFilterChange('admin', filterChanges);
      
      expect(entry.action).toBe('FILTER_APPLIED');
      expect(entry.user).toBe('admin');
      expect(entry.details).toContain('Backend Team');
      expect(entry.metadata.filterChanges).toEqual(filterChanges);
    });
  });

  // Test logViewSwitch
  describe('logViewSwitch', () => {
    test('should create view switch audit entry', () => {
      const entry = logViewSwitch('admin', 'Dashboard', 'Audit Trail');
      
      expect(entry.action).toBe('VIEW_CHANGED');
      expect(entry.user).toBe('admin');
      expect(entry.details).toContain('Dashboard');
      expect(entry.details).toContain('Audit Trail');
      expect(entry.metadata.fromView).toBe('Dashboard');
      expect(entry.metadata.toView).toBe('Audit Trail');
    });
  });

  // Test logCsvExport
  describe('logCsvExport', () => {
    test('should create CSV export audit entry', () => {
      const entry = logCsvExport('admin', 'Session Data', 100);
      
      expect(entry.action).toBe('CSV_EXPORT');
      expect(entry.user).toBe('admin');
      expect(entry.details).toContain('Session Data');
      expect(entry.details).toContain('100');
      expect(entry.metadata.exportType).toBe('Session Data');
      expect(entry.metadata.recordCount).toBe(100);
    });
  });

  // Test logFilterReset
  describe('logFilterReset', () => {
    test('should create filter reset audit entry', () => {
      const entry = logFilterReset('admin');
      
      expect(entry.action).toBe('FILTER_RESET');
      expect(entry.user).toBe('admin');
      expect(entry.details).toContain('reset all filters');
      expect(entry.metadata).toEqual({});
    });
  });

  // Test formatAuditEntry
  describe('formatAuditEntry', () => {
    test('should format audit entry as string', () => {
      const entry = {
        timestamp: '2024-01-01T12:00:00.000Z',
        user: 'admin',
        action: 'TEST_ACTION',
        details: 'Test details'
      };
      
      const formatted = formatAuditEntry(entry);
      
      expect(formatted).toContain('admin');
      expect(formatted).toContain('TEST_ACTION');
      expect(formatted).toContain('Test details');
    });
  });
});
