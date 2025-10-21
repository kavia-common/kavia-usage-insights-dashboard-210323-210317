import React from 'react';
import { render, screen } from '@testing-library/react';
import UsageByTeam from '../../components/UsageByTeam';
import mockSessionData from '../../data/mockSessionData';

describe('UsageByTeam Trends', () => {
  test('renders team trend chart when data present', () => {
    render(<UsageByTeam data={mockSessionData} />);
    // We added a testid on chart wrapper
    const chart = screen.getByTestId('team-trend-chart');
    expect(chart).toBeInTheDocument();
  });

  test('renders helpful empty state with no data', () => {
    render(<UsageByTeam data={[]} />);
    expect(screen.getByText(/no data available for weekly team trends/i)).toBeInTheDocument();
  });
});
