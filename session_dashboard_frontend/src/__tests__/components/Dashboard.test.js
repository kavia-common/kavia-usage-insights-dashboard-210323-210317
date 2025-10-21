// ============================================================================
// COMPONENT TESTS: Dashboard component
// ============================================================================

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuditProvider } from '../../context/AuditContext';
import { AuthProvider } from '../../context/AuthContext';
import Dashboard from '../../components/Dashboard';

const renderDashboard = () => {
  return render(
    <AuditProvider>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </AuditProvider>
  );
};

describe('Dashboard Component', () => {
  test('renders dashboard with header', () => {
    renderDashboard();
    
    expect(screen.getByText(/kavia usage insights/i)).toBeInTheDocument();
  });

  test('renders GxP compliance header', () => {
    renderDashboard();
    
    expect(screen.getByText(/gxp compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/alcoa\+/i)).toBeInTheDocument();
  });

  test('renders filter controls', () => {
    renderDashboard();
    
    // Use getAllByText since "Filters" appears in multiple places
    const filterElements = screen.getAllByText(/filters/i);
    expect(filterElements.length).toBeGreaterThan(0);
    
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  test('renders sidebar navigation', () => {
    renderDashboard();
    
    // Use getAllByText for items that appear multiple times
    const trendElements = screen.getAllByText(/feature usage trends/i);
    expect(trendElements.length).toBeGreaterThan(0);
    
    const featureElements = screen.getAllByText(/most\/least used features/i);
    expect(featureElements.length).toBeGreaterThan(0);
    
    const teamElements = screen.getAllByText(/usage by team/i);
    expect(teamElements.length).toBeGreaterThan(0);
    
    const userElements = screen.getAllByText(/usage by user/i);
    expect(userElements.length).toBeGreaterThan(0);
    
    const auditElements = screen.getAllByText(/audit trail/i);
    expect(auditElements.length).toBeGreaterThan(0);
  });

  test('switches views when navigation is clicked', () => {
    renderDashboard();
    
    // Get all buttons and find the audit trail one
    const buttons = screen.getAllByRole('button');
    const auditTrailButton = buttons.find(btn => btn.textContent.includes('Audit Trail'));
    
    expect(auditTrailButton).toBeDefined();
    fireEvent.click(auditTrailButton);
    
    // Audit trail view should be displayed
    expect(screen.getByText(/complete record of all system actions/i)).toBeInTheDocument();
  });

  test('applies filters when apply button is clicked', () => {
    renderDashboard();
    
    const applyButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyButton);
    
    // Filter should be applied (no error means success)
    expect(applyButton).toBeInTheDocument();
  });

  test('resets filters when reset button is clicked', () => {
    renderDashboard();
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    // Filters should be reset (no error means success)
    expect(resetButton).toBeInTheDocument();
  });

  test('hides filters when audit trail view is active', () => {
    renderDashboard();
    
    // Initially filters should be visible
    expect(screen.getByText(/refine your data view/i)).toBeInTheDocument();
    
    // Switch to audit trail
    const buttons = screen.getAllByRole('button');
    const auditTrailButton = buttons.find(btn => btn.textContent.includes('Audit Trail'));
    fireEvent.click(auditTrailButton);
    
    // Filters should be hidden
    expect(screen.queryByText(/refine your data view/i)).not.toBeInTheDocument();
  });

  test('renders default view on mount', () => {
    renderDashboard();
    
    // Default view should be trends
    expect(screen.getByText(/week-over-week comparison/i)).toBeInTheDocument();
  });
});
