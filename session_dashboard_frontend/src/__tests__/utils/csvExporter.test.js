// ============================================================================
// UNIT TESTS: csvExporter utility
// ============================================================================

import { arrayToCSV, exportAuditTrailToCSV, exportSessionDataToCSV } from '../../utils/csvExporter';

// Mock DOM methods
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('csvExporter', () => {
  let mockLink;

  beforeEach(() => {
    // Mock document methods
    mockLink = {
      setAttribute: jest.fn(),
      click: jest.fn(),
      style: {}
    };
    document.createElement = jest.fn(() => mockLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  // Test arrayToCSV
  describe('arrayToCSV', () => {
    test('should convert array to CSV string', () => {
      const data = [
        { name: 'Alice', age: 30, city: 'NYC' },
        { name: 'Bob', age: 25, city: 'LA' }
      ];
      const headers = ['name', 'age', 'city'];
      
      const csv = arrayToCSV(data, headers);
      
      expect(csv).toContain('name,age,city');
      expect(csv).toContain('Alice,30,NYC');
      expect(csv).toContain('Bob,25,LA');
    });

    test('should handle empty array', () => {
      const csv = arrayToCSV([], ['header1', 'header2']);
      
      expect(csv).toBe('');
    });

    test('should handle null values', () => {
      const data = [{ name: 'Alice', age: null }];
      const headers = ['name', 'age'];
      
      const csv = arrayToCSV(data, headers);
      
      expect(csv).toContain('Alice,');
    });

    test('should escape quotes and commas', () => {
      const data = [{ name: 'Alice, Smith', note: 'She said "hello"' }];
      const headers = ['name', 'note'];
      
      const csv = arrayToCSV(data, headers);
      
      expect(csv).toContain('"Alice, Smith"');
      expect(csv).toContain('She said ""hello""');
    });
  });

  // Test exportAuditTrailToCSV
  describe('exportAuditTrailToCSV', () => {
    test('should export audit trail with electronic signature', () => {
      const auditEntries = [
        {
          id: 'audit-1',
          timestamp: '2024-01-01T12:00:00Z',
          action: 'LOGIN_SUCCESS',
          user: 'admin',
          details: 'User logged in',
          metadata: { role: 'admin' }
        }
      ];

      const result = exportAuditTrailToCSV(auditEntries, 'admin', 'Test export');

      expect(result.success).toBe(true);
      expect(result.recordCount).toBe(1);
      expect(result.timestamp).toBeDefined();
      expect(mockLink.click).toHaveBeenCalled();
    });

    test('should throw error for invalid audit entries', () => {
      expect(() => {
        exportAuditTrailToCSV(null, 'admin');
      }).toThrow('Invalid audit entries data');
    });

    test('should throw error for missing username', () => {
      expect(() => {
        exportAuditTrailToCSV([], null);
      }).toThrow('Valid username is required');
    });
  });

  // Test exportSessionDataToCSV
  describe('exportSessionDataToCSV', () => {
    test('should export session data successfully', () => {
      const sessionData = [
        {
          userId: 'user001',
          username: 'Alice',
          team: 'Backend Team',
          projectId: 'proj-1',
          sessionType: 'CodeWriting',
          agentsUsed: ['CodeAgent'],
          featuresUsed: ['Code Gen'],
          tokenUsage: 1000,
          startTime: '2024-01-01T12:00:00Z',
          duration: 30,
          outputs: { documentsGenerated: 1, codeFilesUpdated: 5, prsCreated: 1 }
        }
      ];

      const result = exportSessionDataToCSV(sessionData, 'admin');

      expect(result.success).toBe(true);
      expect(result.recordCount).toBe(1);
      expect(mockLink.click).toHaveBeenCalled();
    });

    test('should throw error for invalid session data', () => {
      expect(() => {
        exportSessionDataToCSV(null, 'admin');
      }).toThrow('Invalid session data');
    });
  });
});
