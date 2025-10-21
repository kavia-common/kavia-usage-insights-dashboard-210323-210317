// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-013
// User Story: Display feature usage trends week-over-week
// GxP Impact: NO - Visualization only
// Risk Level: LOW
// ============================================================================

import React, { useMemo, useState } from 'react';
import { calculateWeekOverWeekTrends, groupSessionsByDate, getWeeklyTrendSeries } from '../utils/dataProcessing';
import '../styles/Visualizations.css';

// PUBLIC_INTERFACE
/**
 * Feature Usage Trends Component
 * Displays week-over-week trends for session metrics
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.data - Filtered session data
 * 
 * GxP Critical: NO - Visualization component
 */
const FeatureUsageTrends = ({ data }) => {
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly'
  const trends = calculateWeekOverWeekTrends(data);
  const groupedByDay = useMemo(() => groupSessionsByDate(data, 'day'), [data]);

  // PUBLIC_INTERFACE
  /**
   * Format percentage change with color indicator
   */
  const formatChange = (value) => {
    const sign = value >= 0 ? '+' : '';
    const color = value >= 0 ? '#06b6d4' : '#EF4444';
    return { text: `${sign}${value.toFixed(1)}%`, color };
  };

  const sessionChange = formatChange(trends.trend.sessionCountChange);
  const tokenChange = formatChange(trends.trend.tokenUsageChange);
  const durationChange = formatChange(trends.trend.durationChange);

  // Get last 7 days for chart
  const last7Days = useMemo(() => Object.keys(groupedByDay).sort().slice(-7), [groupedByDay]);

  // Build 4-week weekly series
  const weeklySeries = useMemo(() => getWeeklyTrendSeries(data, 4), [data]);

  return (
    <div className="visualization-container">
      <div className="viz-header">
        <h2 className="viz-title">Feature Usage Trends</h2>
        <div className="viz-toggle" role="tablist" aria-label="Trend view toggle">
          <button
            role="tab"
            aria-selected={viewMode === 'daily'}
            className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            Last 7 Days
          </button>
          <button
            role="tab"
            aria-selected={viewMode === 'weekly'}
            className={`toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            4-Week Weekly
          </button>
        </div>
        <p className="viz-subtitle">Week-over-week comparison</p>
      </div>

      {/* Summary Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Sessions</div>
          <div className="metric-value">{trends.currentWeek.sessionCount}</div>
          <div className="metric-change" style={{ color: sessionChange.color }}>
            {sessionChange.text} vs previous week
          </div>
          <div className="metric-detail">
            Previous week: {trends.previousWeek.sessionCount}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Total Tokens</div>
          <div className="metric-value">{trends.currentWeek.totalTokens.toLocaleString()}</div>
          <div className="metric-change" style={{ color: tokenChange.color }}>
            {tokenChange.text} vs previous week
          </div>
          <div className="metric-detail">
            Previous week: {trends.previousWeek.totalTokens.toLocaleString()}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Total Duration (min)</div>
          <div className="metric-value">{trends.currentWeek.totalDuration}</div>
          <div className="metric-change" style={{ color: durationChange.color }}>
            {durationChange.text} vs previous week
          </div>
          <div className="metric-detail">
            Previous week: {trends.previousWeek.totalDuration}
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      {viewMode === 'daily' ? (
        <div className="chart-container">
          <h3 className="chart-title">Sessions per Day (Last 7 Days)</h3>
          <div className="bar-chart">
            {last7Days.map(date => {
              const sessions = groupedByDay[date] || [];
              const count = sessions.length;
              const maxCount = Math.max(...last7Days.map(d => (groupedByDay[d] || []).length));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;

              const dayLabel = new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: '2-digit',
                day: '2-digit'
              });

              return (
                <div key={date} className="bar-item">
                  <div className="bar-wrapper">
                    <div
                      className="bar"
                      style={{ height: `${height}%` }}
                      title={`${dayLabel} • ${count} sessions`}
                    >
                      <span className="bar-label">{count}</span>
                    </div>
                  </div>
                  <div className="bar-date">
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="chart-container">
          <h3 className="chart-title">Weekly Trend (Last 4 Weeks)</h3>
          <div className="bar-chart">
            {weeklySeries.map(week => {
              const count = week.sessions;
              const maxCount = Math.max(...weeklySeries.map(w => w.sessions));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const tooltip = `${week.label}\nSessions: ${count}\nTokens: ${week.tokens.toLocaleString()}\nDuration: ${week.duration} min`;

              return (
                <div key={week.weekStart} className="bar-item">
                  <div className="bar-wrapper">
                    <div
                      className="bar"
                      style={{ height: `${height}%` }}
                      title={tooltip}
                    >
                      <span className="bar-label">{count}</span>
                    </div>
                  </div>
                  <div className="bar-date">
                    {`Week of ${new Date(week.weekStart).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature Usage Comparison */}
      <div className="feature-comparison">
        <h3 className="chart-title">Feature Usage: Current vs Previous Week</h3>
        <div className="comparison-grid">
          {Object.keys(trends.currentWeek.features).slice(0, 5).map(feature => {
            const current = trends.currentWeek.features[feature] || 0;
            const previous = trends.previousWeek.features[feature] || 0;
            const change = previous > 0 ? ((current - previous) / previous) * 100 : 100;
            const changeFormatted = formatChange(change);

            return (
              <div key={feature} className="comparison-item">
                <div className="comparison-feature">{feature}</div>
                <div className="comparison-values">
                  <span className="comparison-current">{current}</span>
                  <span className="comparison-separator">vs</span>
                  <span className="comparison-previous">{previous}</span>
                </div>
                <div className="comparison-change" style={{ color: changeFormatted.color }}>
                  {changeFormatted.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureUsageTrends;
