// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-015
// User Story: Display usage statistics by team
// GxP Impact: NO - Visualization only
// Risk Level: LOW
// ============================================================================

import React from 'react';
import { calculateUsageByTeam } from '../utils/dataProcessing';
import '../styles/Visualizations.css';

// PUBLIC_INTERFACE
/**
 * Usage By Team Component
 * Displays usage statistics aggregated by team
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.data - Filtered session data
 * 
 * GxP Critical: NO - Visualization component
 */
const UsageByTeam = ({ data }) => {
  const teamStats = calculateUsageByTeam(data);
  const teams = Object.keys(teamStats).sort((a, b) => 
    teamStats[b].sessionCount - teamStats[a].sessionCount
  );

  const maxSessions = teams.length > 0 ? teamStats[teams[0]].sessionCount : 1;

  return (
    <div className="visualization-container">
      <div className="viz-header">
        <h2 className="viz-title">Usage by Team</h2>
        <p className="viz-subtitle">Session activity and metrics per team</p>
      </div>

      {/* Team Cards */}
      <div className="team-grid">
        {teams.map(team => {
          const stats = teamStats[team];
          const percentage = (stats.sessionCount / maxSessions) * 100;

          return (
            <div key={team} className="team-card">
              <div className="team-card-header">
                <h3 className="team-name">👥 {team}</h3>
                <span className="team-badge">{stats.uniqueUsers} users</span>
              </div>

              <div className="team-metrics">
                <div className="team-metric">
                  <div className="team-metric-label">Sessions</div>
                  <div className="team-metric-value">{stats.sessionCount}</div>
                  <div className="team-metric-bar-bg">
                    <div 
                      className="team-metric-bar" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="team-metric">
                  <div className="team-metric-label">Total Tokens</div>
                  <div className="team-metric-value">{stats.totalTokens.toLocaleString()}</div>
                </div>

                <div className="team-metric">
                  <div className="team-metric-label">Total Duration</div>
                  <div className="team-metric-value">{stats.totalDuration} min</div>
                </div>

                <div className="team-metric">
                  <div className="team-metric-label">Avg Session Duration</div>
                  <div className="team-metric-value">
                    {(stats.totalDuration / stats.sessionCount).toFixed(1)} min
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="table-container">
        <h3 className="chart-title">Team Comparison</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Users</th>
              <th>Sessions</th>
              <th>Total Tokens</th>
              <th>Total Duration (min)</th>
              <th>Avg Session (min)</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => {
              const stats = teamStats[team];
              return (
                <tr key={team}>
                  <td className="table-team">{team}</td>
                  <td>{stats.uniqueUsers}</td>
                  <td>{stats.sessionCount}</td>
                  <td>{stats.totalTokens.toLocaleString()}</td>
                  <td>{stats.totalDuration}</td>
                  <td>{(stats.totalDuration / stats.sessionCount).toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsageByTeam;
