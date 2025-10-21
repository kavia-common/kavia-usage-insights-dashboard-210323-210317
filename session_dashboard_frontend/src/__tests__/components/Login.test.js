// ============================================================================
// COMPONENT TESTS: Login component
// ============================================================================

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditProvider } from '../../context/AuditContext';
import { AuthProvider } from '../../context/AuthContext';
import Login from '../../components/Login';

const renderLogin = () => {
  return render(
    <AuditProvider>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </AuditProvider>
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    renderLogin();
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays validation errors for empty fields', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  test('displays validation error for short username', async () => {
    renderLogin();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
  });

  test('displays error for invalid credentials', async () => {
    renderLogin();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  test('accepts valid credentials', async () => {
    renderLogin();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);
    
    // Login should succeed (no error message)
    await waitFor(() => {
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });
  });

  test('displays demo credentials', () => {
    renderLogin();
    
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/admin.*password/i)).toBeInTheDocument();
  });
});
