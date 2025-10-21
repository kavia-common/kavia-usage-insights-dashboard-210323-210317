// ============================================================================
// COMPONENT TESTS: AuditTrail component
// ============================================================================

import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuditProvider } from '../../context/AuditContext';
import { AuthProvider } from '../../context/AuthContext';
import AuditTrail from '../../components/AuditTrail';

const renderAuditTrail = () => {
  return render(
    <AuditProvider>
      <AuthProvider>
        <AuditTrail />
      </AuthProvider>
    </AuditProvider>
  );
};

describe('AuditTrail Component', () => {
  test('renders audit trail', () => {
    renderAuditTrail();
    
    // Use getAllByText since "Audit Trail" appears in both title and breadcrumb
    const auditTrailElements = screen.getAllByText(/audit trail/i);
    expect(auditTrailElements.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/complete record of all system actions/i)).toBeInTheDocument();
  });

  test('displays GxP compliance notice', () => {
    renderAuditTrail();
    
    expect(screen.getByText(/gxp compliance/i)).toBeInTheDocument();
    expect(screen.getByText(/alcoa\+ principles/i)).toBeInTheDocument();
  });

  test('displays filter controls', () => {
    renderAuditTrail();
    
    expect(screen.getByLabelText(/filter by action/i)).toBeInTheDocument();
  });

  test('displays export button', () => {
    renderAuditTrail();
    
    expect(screen.getByRole('button', { name: /export to csv/i })).toBeInTheDocument();
  });

  test('displays audit entries count', () => {
    renderAuditTrail();
    
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });

  test('displays audit table', () => {
    renderAuditTrail();
    
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('shows no entries message when audit trail is empty', () => {
    renderAuditTrail();
    
    expect(screen.getByText(/no audit entries found/i)).toBeInTheDocument();
  });
});
