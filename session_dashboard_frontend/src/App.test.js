// ============================================================================
// COMPONENT TESTS: App component
// ============================================================================

import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders login page when not authenticated', () => {
    render(<App />);
    
    // Should render login form
    expect(screen.getByText(/kavia usage insights/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('wraps app with necessary providers', () => {
    render(<App />);
    
    // Should have the login form which means providers are working
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
