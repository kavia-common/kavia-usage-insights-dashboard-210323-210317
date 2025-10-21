import React from 'react';
import { render, screen } from '@testing-library/react';
import UsageByUser from '../../components/UsageByUser';
import mockSessionData from '../../data/mockSessionData';
import { getWeeklyTrendSeriesByUser } from '../../utils/dataProcessing';

describe('UsageByUser Weekly Trends', () => {
  test('getWeeklyTrendSeriesByUser returns non-empty series and keys', () => {
    const { series, keys } = getWeeklyTrendSeriesByUser(mockSessionData, 5, 8);
    expect(Array.isArray(series)).toBe(true);
    expect(Array.isArray(keys)).toBe(true);
    expect(series.length).toBeGreaterThan(0);
    expect(keys.length).toBeGreaterThan(0);

    // Totals should generally trend upwards across the weeks due to the generator
    const totals = series.map(point => keys.reduce((sum, k) => sum + (point[k] || 0), 0));
    // Ensure we have some increasing pattern (last >= first)
    expect(totals[totals.length - 1]).toBeGreaterThanOrEqual(totals[0]);
  });

  test('renders user trend chart when data present', () => {
    render(<UsageByUser data={mockSessionData} />);
    const chart = screen.getByTestId('user-trend-chart');
    expect(chart).toBeInTheDocument();
  });

  test('renders helpful empty state with no data', () => {
    render(<UsageByUser data={[]} />);
    expect(screen.getByText(/no data available for weekly user trends/i)).toBeInTheDocument();
  });
});
