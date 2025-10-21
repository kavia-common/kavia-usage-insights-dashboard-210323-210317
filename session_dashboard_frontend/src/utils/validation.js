// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-004
// User Story: Provide input validation utilities
// Acceptance Criteria:
//   - Validate login credentials
//   - Validate filter inputs
//   - Return user-friendly error messages
// GxP Impact: YES - Input validation is required for data integrity
// Risk Level: MEDIUM
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Validate username input
 * 
 * @param {string} username - Username to validate
 * @returns {Object} Validation result with isValid and message properties
 * 
 * Validation Rules:
 * - Must be a non-empty string
 * - Must be at least 3 characters long
 * - Must contain only alphanumeric characters
 * 
 * GxP Critical: YES - Ensures data integrity for authentication
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, message: 'Username is required' };
  }

  if (username.trim().length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' };
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return { isValid: false, message: 'Username must contain only letters and numbers' };
  }

  return { isValid: true, message: '' };
};

// PUBLIC_INTERFACE
/**
 * Validate password input
 * 
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message properties
 * 
 * Validation Rules:
 * - Must be a non-empty string
 * - Must be at least 6 characters long
 * 
 * GxP Critical: YES - Ensures data integrity for authentication
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }

  return { isValid: true, message: '' };
};

// PUBLIC_INTERFACE
/**
 * Validate date range
 * 
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Object} Validation result with isValid and message properties
 * 
 * Validation Rules:
 * - Both dates must be valid ISO 8601 strings
 * - Start date must be before or equal to end date
 * - Dates cannot be in the future
 * 
 * GxP Critical: YES - Ensures accurate date filtering for audit trail
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { isValid: false, message: 'Both start and end dates are required' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (isNaN(start.getTime())) {
    return { isValid: false, message: 'Start date is invalid' };
  }

  if (isNaN(end.getTime())) {
    return { isValid: false, message: 'End date is invalid' };
  }

  if (start > end) {
    return { isValid: false, message: 'Start date must be before or equal to end date' };
  }

  if (start > now) {
    return { isValid: false, message: 'Start date cannot be in the future' };
  }

  if (end > now) {
    return { isValid: false, message: 'End date cannot be in the future' };
  }

  return { isValid: true, message: '' };
};

// PUBLIC_INTERFACE
/**
 * Validate filter selection
 * 
 * @param {string} filterValue - Filter value to validate
 * @param {string[]} allowedValues - Array of allowed values
 * @returns {Object} Validation result with isValid and message properties
 * 
 * Validation Rules:
 * - Filter value must be in the allowed values list or empty
 * 
 * GxP Critical: NO - But ensures UI consistency
 */
export const validateFilterSelection = (filterValue, allowedValues) => {
  if (!filterValue || filterValue === '') {
    return { isValid: true, message: '' }; // Empty is allowed (means no filter)
  }

  if (!allowedValues || !Array.isArray(allowedValues)) {
    return { isValid: false, message: 'Invalid filter configuration' };
  }

  if (!allowedValues.includes(filterValue)) {
    return { isValid: false, message: 'Invalid filter selection' };
  }

  return { isValid: true, message: '' };
};

// PUBLIC_INTERFACE
/**
 * Validate multiple filters
 * 
 * @param {Object} filters - Object containing filter values
 * @returns {Object} Validation result with isValid, message, and errors properties
 * 
 * GxP Critical: YES - Ensures filter integrity for audit trail
 */
export const validateFilters = (filters) => {
  const errors = {};
  let isValid = true;

  if (filters.startDate && filters.endDate) {
    const dateValidation = validateDateRange(filters.startDate, filters.endDate);
    if (!dateValidation.isValid) {
      errors.dateRange = dateValidation.message;
      isValid = false;
    }
  }

  return {
    isValid,
    message: isValid ? '' : 'Some filters have validation errors',
    errors
  };
};
