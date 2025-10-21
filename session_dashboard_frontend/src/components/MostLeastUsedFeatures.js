// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-014
// User Story: Display most and least used features
// GxP Impact: NO - Visualization only
// Risk Level: LOW
// ============================================================================

import React from 'react';
import { getMostUsedFeatures, getLeastUsedFeatures } from '../utils/dataProcessing';
import '../styles/Visualizations.css';

// PUBLIC_INTERFACE
/**
 * Most/Least Used Features Component
 * Displays top and bottom features by usage count
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.data - Filtered session data
 * 
 * GxP Critical: NO - Visualization component
 */
const MostLeastUsedFeatures = ({ data }) => {
  const mostUsed = getMostUsedFeatures(data, 10);
  const leastUsed = getLeastUsedFeatures(data, 10);

  const maxCount = mostUsed.length > 0 ? mostUsed[0].count : 1;

  return (
    <div className="visualization-container">
      <div className="viz-header">
        <h2 className="viz-title">Feature Usage Analysis</h2>
        <p className="viz-subtitle">Most and least frequently used features</p>
      </div>

      <div className="features-layout">
        {/* Most Used Features */}
        <div className="features-section">
          <h3 className="section-title">🏆 Most Used Features</h3>
          <div className="features-list">
            {mostUsed.map((item, index) => {
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={item.feature} className="feature-item">
                  <div className="feature-rank">#{index + 1}</div>
                  <div className="feature-content">
                    <div className="feature-header">
                      <span className="feature-name">{item.feature}</span>
                      <span className="feature-count">{item.count} uses</span>
                    </div>
                    <div className="feature-bar-bg">
                      <div 
                        className="feature-bar most-used" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Least Used Features */}
        <div className="features-section">
          <h3 className="section-title">📉 Least Used Features</h3>
          <div className="features-list">
            {leastUsed.map((item, index) => {
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={item.feature} className="feature-item">
                  <div className="feature-rank">#{index + 1}</div>
                  <div className="feature-content">
                    <div className="feature-header">
                      <span className="feature-name">{item.feature}</span>
                      <span className="feature-count">{item.count} uses</span>
                    </div>
                    <div className="feature-bar-bg">
                      <div 
                        className="feature-bar least-used" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-item">
          <div className="stat-label">Total Unique Features</div>
          <div className="stat-value">{mostUsed.length + leastUsed.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Total Feature Uses</div>
          <div className="stat-value">
            {mostUsed.reduce((sum, item) => sum + item.count, 0)}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Average Uses per Feature</div>
          <div className="stat-value">
            {(mostUsed.reduce((sum, item) => sum + item.count, 0) / mostUsed.length).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostLeastUsedFeatures;
