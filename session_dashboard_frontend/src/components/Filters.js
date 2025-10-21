// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-012
// User Story: Provide filter controls for data visualization
// GxP Impact: YES - Filter changes are audited
// Risk Level: HIGH
// ============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAudit } from '../context/AuditContext';
import { validateDateRange } from '../utils/validation';
import { logFilterChange, logFilterReset } from '../utils/auditLogger';
import { getUniqueTeams, getUniqueUsers, getUniqueFeatures } from '../data/mockSessionData';
import '../styles/Filters.css';

// PUBLIC_INTERFACE
/**
 * Filters Component
 * Provides filtering controls for session data
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onApply - Callback when filters are applied
 * @param {Function} props.onReset - Callback when filters are reset
 * @param {Object} props.currentFilters - Currently applied filters
 * 
 * GxP Critical: YES - All filter changes are audited
 */
const Filters = ({ onApply, onReset, currentFilters }) => {
  const { user } = useAuth();
  const { addAuditEntry } = useAudit();

  const [startDate, setStartDate] = useState(currentFilters.startDate || '');
  const [endDate, setEndDate] = useState(currentFilters.endDate || '');
  const [team, setTeam] = useState(currentFilters.team || '');
  const [feature, setFeature] = useState(currentFilters.feature || '');
  const [userId, setUserId] = useState(currentFilters.userId || '');
  const [errors, setErrors] = useState({});

  const teams = getUniqueTeams();
  const users = getUniqueUsers();
  const features = getUniqueFeatures();

  // PUBLIC_INTERFACE
  /**
   * Handle filter application with validation
   * 
   * Validation:
   * - Date range must be valid
   * - Start date must be before end date
   * 
   * Audit: Logs filter application
   */
  const handleApply = () => {
    setErrors({});

    // Validate date range if both dates are provided
    if (startDate && endDate) {
      const dateValidation = validateDateRange(startDate, endDate);
      if (!dateValidation.isValid) {
        setErrors({ dateRange: dateValidation.message });
        return;
      }
    }

    const filters = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      team: team || undefined,
      feature: feature || undefined,
      userId: userId || undefined
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    // Log filter application
    const auditEntry = logFilterChange(user?.username || 'admin', filters);
    addAuditEntry(auditEntry);

    onApply(filters);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle filter reset
   * 
   * Audit: Logs filter reset
   */
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setTeam('');
    setFeature('');
    setUserId('');
    setErrors({});

    // Log filter reset
    const auditEntry = logFilterReset(user?.username || 'admin');
    addAuditEntry(auditEntry);

    onReset();
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3 className="filters-title">Filters</h3>
        <p className="filters-subtitle">Refine your data view</p>
      </div>

      <div className="filters-grid">
        {/* Date Range Filters */}
        <div className="filter-group">
          <label htmlFor="startDate" className="filter-label">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`input ${errors.dateRange ? 'input-error' : ''}`}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="endDate" className="filter-label">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`input ${errors.dateRange ? 'input-error' : ''}`}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Team Filter */}
        <div className="filter-group">
          <label htmlFor="team" className="filter-label">Team</label>
          <select
            id="team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="select"
          >
            <option value="">All Teams</option>
            {teams.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Feature Filter */}
        <div className="filter-group">
          <label htmlFor="feature" className="filter-label">Feature</label>
          <select
            id="feature"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="select"
          >
            <option value="">All Features</option>
            {features.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* User Filter */}
        <div className="filter-group">
          <label htmlFor="userId" className="filter-label">User</label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="select"
          >
            <option value="">All Users</option>
            {users.map(u => (
              <option key={u.userId} value={u.userId}>{u.username}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button onClick={handleApply} className="btn btn-primary">
            Apply Filters
          </button>
          <button onClick={handleReset} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </div>

      {/* Error Display */}
      {errors.dateRange && (
        <div className="filter-error" role="alert">
          {errors.dateRange}
        </div>
      )}
    </div>
  );
};

export default Filters;
