// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-016
// User Story: Display usage statistics by individual user
// GxP Impact: NO - Visualization only
// Risk Level: LOW
// ============================================================================

import React, { useState } from 'react';
import { calculateUsageByUser } from '../utils/dataProcessing';
import '../styles/Visualizations.css';

// PUBLIC_INTERFACE
/**
 * Usage By User Component
 * Displays usage statistics aggregated by individual user
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.data - Filtered session data
 * 
 * GxP Critical: NO - Visualization component
 */
const UsageByUser = ({ data }) => {
  const [sortBy, setSortBy] = useState('sessionCount');
  const userStats = calculateUsageByUser(data);

  // Sort users based on selected criteria
  const sortedUsers = [...userStats].sort((a, b) => {
    switch (sortBy) {
      case 'sessionCount':
        return b.sessionCount - a.sessionCount;
      case 'totalTokens':
        return b.totalTokens - a.totalTokens;
      case 'totalDuration':
        return b.totalDuration - a.totalDuration;
      case 'username':
        return a.username.localeCompare(b.username);
      default:
        return b.sessionCount - a.sessionCount;
    }
  });

  const maxSessions = sortedUsers.length > 0 ? sortedUsers[0].sessionCount : 1;

  return (
    <div className="visualization-container">
      <div className="viz-header">
        <h2 className="viz-title">Usage by User</h2>
        <p className="viz-subtitle">Individual user activity and metrics</p>
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <label htmlFor="sortBy" className="sort-label">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select"
        >
          <option value="sessionCount">Most Sessions</option>
          <option value="totalTokens">Most Tokens</option>
          <option value="totalDuration">Most Duration</option>
          <option value="username">Username (A-Z)</option>
        </select>
      </div>

      {/* User Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Team</th>
              <th>Sessions</th>
              <th>Total Tokens</th>
              <th>Total Duration (min)</th>
              <th>Avg Session (min)</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, index) => {
              const avgDuration = (user.totalDuration / user.sessionCount).toFixed(1);
              const activityPercentage = (user.sessionCount / maxSessions) * 100;

              return (
                <tr key={user.userId}>
                  <td className="table-rank">#{index + 1}</td>
                  <td className="table-username">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    {user.username}
                  </td>
                  <td>{user.team}</td>
                  <td>{user.sessionCount}</td>
                  <td>{user.totalTokens.toLocaleString()}</td>
                  <td>{user.totalDuration}</td>
                  <td>{avgDuration}</td>
                  <td>
                    <div className="activity-bar-bg">
                      <div 
                        className="activity-bar" 
                        style={{ width: `${activityPercentage}%` }}
                        title={`${activityPercentage.toFixed(0)}% activity`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-item">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{userStats.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg Sessions per User</div>
          <div className="stat-value">
            {(userStats.reduce((sum, u) => sum + u.sessionCount, 0) / userStats.length).toFixed(1)}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Most Active User</div>
          <div className="stat-value">{sortedUsers[0]?.username || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default UsageByUser;
