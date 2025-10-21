// ============================================================================
// COMPONENT TESTS: Filters component
// ============================================================================

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuditProvider } from '../../context/AuditContext';
import { AuthProvider } from '../../context/AuthContext';
import Filters from '../../components/Filters';

const mockOnApply = jest.fn();
const mockOnReset = jest.fn();

const renderFilters = (currentFilters = {}) => {
  return render(
    <AuditProvider>
      <AuthProvider>
        <Filters 
          onApply={mockOnApply}
          onReset={mockOnReset}
          currentFilters={currentFilters}
        />
      </AuthProvider>
    </AuditProvider>
  );
};

describe('Filters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all filter controls', () => {
    renderFilters();
    
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/feature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
  });

  test('calls onApply when apply button is clicked', () => {
    renderFilters();
    
    const applyButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyButton);
    
    expect(mockOnApply).toHaveBeenCalled();
  });

  test('calls onReset when reset button is clicked', () => {
    renderFilters();
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    expect(mockOnReset).toHaveBeenCalled();
  });

  test('displays validation error for invalid date range', () => {
    renderFilters();
    
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    const applyButton = screen.getByRole('button', { name: /apply filters/i });
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-31' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-01' } });
    fireEvent.click(applyButton);
    
    expect(screen.getByText(/before or equal to end date/i)).toBeInTheDocument();
    expect(mockOnApply).not.toHaveBeenCalled();
  });

  test('populates filters with current values', () => {
    const currentFilters = {
      team: 'Backend Team',
      startDate: '2024-01-01'
    };
    
    renderFilters(currentFilters);
    
    expect(screen.getByLabelText(/team/i)).toHaveValue('Backend Team');
    expect(screen.getByLabelText(/start date/i)).toHaveValue('2024-01-01');
  });
});
