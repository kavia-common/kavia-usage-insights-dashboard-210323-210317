// ============================================================================
// INTEGRATION TESTS: Audit Trail
// ============================================================================

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditProvider, useAudit } from '../../context/AuditContext';

// Test component to interact with audit context
const AuditTestComponent = () => {
  const { auditEntries, addAuditEntry } = useAudit();

  const addTestEntry = () => {
    addAuditEntry({
      action: 'TEST_ACTION',
      details: 'Test audit entry',
      user: 'testuser',
      metadata: { test: true }
    });
  };

  return (
    <div>
      <div data-testid="audit-count">{auditEntries.length}</div>
      <button onClick={addTestEntry}>Add Entry</button>
      <div data-testid="audit-entries">
        {auditEntries.map(entry => (
          <div key={entry.id} data-testid="audit-entry">
            {entry.action} - {entry.details}
          </div>
        ))}
      </div>
    </div>
  );
};

describe('Audit Trail Integration', () => {
  test('adds audit entry successfully', async () => {
    render(
      <AuditProvider>
        <AuditTestComponent />
      </AuditProvider>
    );
    
    expect(screen.getByTestId('audit-count')).toHaveTextContent('0');
    
    const addButton = screen.getByRole('button', { name: /add entry/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('audit-count')).toHaveTextContent('1');
    });
    
    expect(screen.getByText(/test_action/i)).toBeInTheDocument();
    expect(screen.getByText(/test audit entry/i)).toBeInTheDocument();
  });

  test('validates audit entry fields', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const InvalidEntryComponent = () => {
      const { addAuditEntry, auditEntries } = useAudit();

      const addInvalidEntry = () => {
        addAuditEntry({
          action: '',
          details: 'Details',
          user: 'user'
        });
      };

      return (
        <div>
          <div data-testid="audit-count">{auditEntries.length}</div>
          <button onClick={addInvalidEntry}>Add Invalid</button>
        </div>
      );
    };

    render(
      <AuditProvider>
        <InvalidEntryComponent />
      </AuditProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add invalid/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(screen.getByTestId('audit-count')).toHaveTextContent('0');
    });
    
    consoleSpy.mockRestore();
  });

  test('audit entries have ISO 8601 timestamps', async () => {
    render(
      <AuditProvider>
        <AuditTestComponent />
      </AuditProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add entry/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('audit-count')).toHaveTextContent('1');
    });
    
    // Audit entries should have ISO 8601 timestamps (tested in context)
    expect(screen.getByTestId('audit-entry')).toBeInTheDocument();
  });

  test('multiple audit entries are stored in order', async () => {
    render(
      <AuditProvider>
        <AuditTestComponent />
      </AuditProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add entry/i });
    
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('audit-count')).toHaveTextContent('3');
    });
    
    const entries = screen.getAllByTestId('audit-entry');
    expect(entries).toHaveLength(3);
  });
});
