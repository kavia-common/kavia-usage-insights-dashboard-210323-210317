// ============================================================================
// UNIT TESTS: validation utility
// ============================================================================

import {
  validateUsername,
  validatePassword,
  validateDateRange,
  validateFilterSelection,
  validateFilters
} from '../../utils/validation';

describe('validation', () => {
  // Test validateUsername
  describe('validateUsername', () => {
    test('should validate correct username', () => {
      const result = validateUsername('admin');
      
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('should reject empty username', () => {
      const result = validateUsername('');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('required');
    });

    test('should reject short username', () => {
      const result = validateUsername('ab');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('at least 3 characters');
    });

    test('should reject non-alphanumeric username', () => {
      const result = validateUsername('admin@123');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('letters and numbers');
    });

    test('should reject null username', () => {
      const result = validateUsername(null);
      
      expect(result.isValid).toBe(false);
    });
  });

  // Test validatePassword
  describe('validatePassword', () => {
    test('should validate correct password', () => {
      const result = validatePassword('password123');
      
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('should reject empty password', () => {
      const result = validatePassword('');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('required');
    });

    test('should reject short password', () => {
      const result = validatePassword('12345');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('at least 6 characters');
    });

    test('should reject null password', () => {
      const result = validatePassword(null);
      
      expect(result.isValid).toBe(false);
    });
  });

  // Test validateDateRange
  describe('validateDateRange', () => {
    test('should validate correct date range', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      
      const result = validateDateRange(startDate, endDate);
      
      expect(result.isValid).toBe(true);
    });

    test('should reject missing dates', () => {
      const result = validateDateRange(null, null);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('required');
    });

    test('should reject invalid start date', () => {
      const result = validateDateRange('invalid', '2024-01-31');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Start date is invalid');
    });

    test('should reject start date after end date', () => {
      const result = validateDateRange('2024-01-31', '2024-01-01');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('before or equal to end date');
    });

    test('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      
      const result = validateDateRange(futureDate.toISOString().split('T')[0], futureDate.toISOString().split('T')[0]);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('cannot be in the future');
    });
  });

  // Test validateFilterSelection
  describe('validateFilterSelection', () => {
    test('should validate correct filter selection', () => {
      const result = validateFilterSelection('option1', ['option1', 'option2', 'option3']);
      
      expect(result.isValid).toBe(true);
    });

    test('should accept empty filter value', () => {
      const result = validateFilterSelection('', ['option1', 'option2']);
      
      expect(result.isValid).toBe(true);
    });

    test('should reject invalid selection', () => {
      const result = validateFilterSelection('invalid', ['option1', 'option2']);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid filter selection');
    });
  });

  // Test validateFilters
  describe('validateFilters', () => {
    test('should validate correct filters', () => {
      const filters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        team: 'Backend Team'
      };
      
      const result = validateFilters(filters);
      
      expect(result.isValid).toBe(true);
    });

    test('should detect invalid date range', () => {
      const filters = {
        startDate: '2024-01-31',
        endDate: '2024-01-01'
      };
      
      const result = validateFilters(filters);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('dateRange');
    });
  });
});
