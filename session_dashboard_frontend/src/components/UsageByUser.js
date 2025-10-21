// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-016
// User Story: Display usage statistics by individual user
// GxP Impact: NO - Visualization only
// Risk Level: LOW
// ============================================================================

import React, { useState } from 'react';
import { calculateUsageByUser, getWeeklyTrendSeriesByUser } from '../utils/dataProcessing';
import '../styles/Visualizations.css';
import ChartCard from './ChartCard';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

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
  const { series: weeklySeries, keys: userKeys } = getWeeklyTrendSeriesByUser(data, 5, 8);

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

      <ChartCard
        title="Weekly User Usage (Top 5 Users • Last 8 Weeks)"
        subtitle="Line chart of weekly session counts per top users. Hover for details."
      >
        {weeklySeries && weeklySeries.length > 0 && userKeys.length > 0 ? (
          <div className="chart-responsive" data-testid="user-trend-chart">
            <ResponsiveContainer>
              <LineChart data={weeklySeries} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
                <XAxis dataKey="weekStart" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8 }}
                  labelStyle={{ color: '#111827', fontWeight: 600 }}
                />
                <Legend />
                {userKeys.map((k, idx) => {
                  const palette = ['#3b82f6', '#06b6d4', '#64748b', '#10b981', '#f59e0b', '#ef4444'];
                  return (
                    <Line
                      key={k}
                      type="monotone"
                      dataKey={k}
                      name={k}
                      stroke={palette[idx % palette.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div role="note" style={{ color: '#64748b' }}>No data available for weekly user trends.</div>
        )}
      </ChartCard>

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
