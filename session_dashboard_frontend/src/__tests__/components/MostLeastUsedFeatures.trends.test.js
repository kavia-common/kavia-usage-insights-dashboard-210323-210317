import React from 'react';
import { render, screen } from '@testing-library/react';
import MostLeastUsedFeatures from '../../components/MostLeastUsedFeatures';
import mockSessionData from '../../data/mockSessionData';

describe('MostLeastUsedFeatures Trends', () => {
  test('renders feature trend chart when data present', () => {
    render(<MostLeastUsedFeatures data={mockSessionData} />);
    const chart = screen.getByTestId('feature-trend-chart');
    expect(chart).toBeInTheDocument();
  });

  test('renders helpful empty state with no data', () => {
    render(<MostLeastUsedFeatures data={[]} />);
    expect(screen.getByText(/no data available for feature trends/i)).toBeInTheDocument();
  });
});
