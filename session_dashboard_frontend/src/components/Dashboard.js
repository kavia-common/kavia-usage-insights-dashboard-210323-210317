// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-011
// User Story: Main dashboard component with layout and view routing
// GxP Impact: YES - View changes are audited
// Risk Level: MEDIUM
// ============================================================================

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Filters from './Filters';
import FeatureUsageTrends from './FeatureUsageTrends';
import MostLeastUsedFeatures from './MostLeastUsedFeatures';
import UsageByTeam from './UsageByTeam';
import UsageByUser from './UsageByUser';
import AuditTrail from './AuditTrail';
import mockSessionData from '../data/mockSessionData';
import { filterSessions } from '../utils/dataProcessing';
import '../styles/Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Dashboard Component
 * Main dashboard layout with header, sidebar, filters, and content area
 * 
 * @component
 * 
 * Features:
 * - Dynamic view switching
 * - Filter application to visualizations
 * - Responsive layout
 * 
 * GxP Critical: YES - Filter changes are audited
 */
const Dashboard = () => {
  const [currentView, setCurrentView] = useState('trends');
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState(mockSessionData);

  // PUBLIC_INTERFACE
  /**
   * Handle filter application
   * 
   * @param {Object} newFilters - Filter criteria
   */
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    const filtered = filterSessions(mockSessionData, newFilters);
    setFilteredData(filtered);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle filter reset
   */
  const handleFilterReset = () => {
    setFilters({});
    setFilteredData(mockSessionData);
  };

  // PUBLIC_INTERFACE
  /**
   * Render current view component
   */
  const renderView = () => {
    switch (currentView) {
      case 'trends':
        return <FeatureUsageTrends data={filteredData} />;
      case 'features':
        return <MostLeastUsedFeatures data={filteredData} />;
      case 'teams':
        return <UsageByTeam data={filteredData} />;
      case 'users':
        return <UsageByUser data={filteredData} />;
      case 'audit':
        return <AuditTrail />;
      default:
        return <FeatureUsageTrends data={filteredData} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-layout">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        <main className="dashboard-main">
          <div className="dashboard-content">
            {/* GxP Compliance Header */}
            <div className="gxp-header">
              <span className="gxp-badge">GxP Compliant</span>
              <span className="gxp-text">All actions are audited in accordance with ALCOA+ principles</span>
            </div>

            {/* Filters Section */}
            {currentView !== 'audit' && (
              <Filters 
                onApply={handleFilterApply}
                onReset={handleFilterReset}
                currentFilters={filters}
              />
            )}

            {/* Main Content Area */}
            <div className="view-container">
              {renderView()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
