// ============================================================================
// INTEGRATION TESTS: Authentication Flow
// ============================================================================

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditProvider } from '../../context/AuditContext';
import { AuthProvider } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import { useAudit } from '../../context/AuditContext';

// Test component to access context
const TestComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const { auditEntries } = useAudit();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user-info">{user?.username || 'No user'}</div>
      <div data-testid="audit-count">{auditEntries.length}</div>
      <button onClick={() => login('admin', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderTestComponent = () => {
  return render(
    <AuditProvider>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </AuditProvider>
  );
};

describe('Authentication Flow Integration', () => {
  test('successful login updates auth state and creates audit entry', async () => {
    renderTestComponent();
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('admin');
    });
    
    // Check audit entry was created
    const auditCount = screen.getByTestId('audit-count');
    expect(parseInt(auditCount.textContent)).toBeGreaterThan(0);
  });

  test('logout updates auth state and creates audit entry', async () => {
    renderTestComponent();
    
    // Login first
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    const initialAuditCount = parseInt(screen.getByTestId('audit-count').textContent);
    
    // Logout
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    });
    
    // Check new audit entry was created
    const finalAuditCount = parseInt(screen.getByTestId('audit-count').textContent);
    expect(finalAuditCount).toBeGreaterThan(initialAuditCount);
  });

  test('failed login creates audit entry', async () => {
    const FailedLoginComponent = () => {
      const { login } = useAuth();
      const { auditEntries } = useAudit();

      return (
        <div>
          <div data-testid="audit-count">{auditEntries.length}</div>
          <button onClick={() => login('wrong', 'credentials')}>Bad Login</button>
        </div>
      );
    };

    render(
      <AuditProvider>
        <AuthProvider>
          <FailedLoginComponent />
        </AuthProvider>
      </AuditProvider>
    );
    
    const initialAuditCount = parseInt(screen.getByTestId('audit-count').textContent);
    
    const badLoginButton = screen.getByRole('button', { name: /bad login/i });
    fireEvent.click(badLoginButton);
    
    await waitFor(() => {
      const finalAuditCount = parseInt(screen.getByTestId('audit-count').textContent);
      expect(finalAuditCount).toBeGreaterThan(initialAuditCount);
    });
  });
});
