// ============================================================================
// COMPONENT TESTS: Visualization components
// ============================================================================

import React from 'react';
import { render, screen } from '@testing-library/react';
import FeatureUsageTrends from '../../components/FeatureUsageTrends';
import MostLeastUsedFeatures from '../../components/MostLeastUsedFeatures';
import UsageByTeam from '../../components/UsageByTeam';
import UsageByUser from '../../components/UsageByUser';
import mockSessionData from '../../data/mockSessionData';

describe('FeatureUsageTrends Component', () => {
  test('renders feature usage trends', () => {
    render(<FeatureUsageTrends data={mockSessionData} />);
    
    expect(screen.getByText(/feature usage trends/i)).toBeInTheDocument();
    expect(screen.getByText(/week-over-week comparison/i)).toBeInTheDocument();
  });

  test('displays metrics cards', () => {
    render(<FeatureUsageTrends data={mockSessionData} />);
    
    expect(screen.getByText(/total sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/total tokens/i)).toBeInTheDocument();
    expect(screen.getByText(/total duration/i)).toBeInTheDocument();
  });

  test('renders daily sessions chart', () => {
    render(<FeatureUsageTrends data={mockSessionData} />);
    
    expect(screen.getByText(/sessions per day/i)).toBeInTheDocument();
  });

  test('handles empty data', () => {
    render(<FeatureUsageTrends data={[]} />);
    
    expect(screen.getByText(/feature usage trends/i)).toBeInTheDocument();
  });
});

describe('MostLeastUsedFeatures Component', () => {
  test('renders most/least used features', () => {
    render(<MostLeastUsedFeatures data={mockSessionData} />);
    
    expect(screen.getByText(/feature usage analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/most used features/i)).toBeInTheDocument();
    expect(screen.getByText(/least used features/i)).toBeInTheDocument();
  });

  test('displays feature items', () => {
    render(<MostLeastUsedFeatures data={mockSessionData} />);
    
    // Should display feature names from mock data - use getAllByText since it may appear multiple times
    const codeGenElements = screen.getAllByText(/code generation/i);
    expect(codeGenElements.length).toBeGreaterThan(0);
  });

  test('displays summary statistics', () => {
    render(<MostLeastUsedFeatures data={mockSessionData} />);
    
    expect(screen.getByText(/total unique features/i)).toBeInTheDocument();
    expect(screen.getByText(/total feature uses/i)).toBeInTheDocument();
  });

  test('handles empty data', () => {
    render(<MostLeastUsedFeatures data={[]} />);
    
    expect(screen.getByText(/feature usage analysis/i)).toBeInTheDocument();
  });
});

describe('UsageByTeam Component', () => {
  test('renders usage by team', () => {
    render(<UsageByTeam data={mockSessionData} />);
    
    expect(screen.getByText(/usage by team/i)).toBeInTheDocument();
    expect(screen.getByText(/session activity and metrics per team/i)).toBeInTheDocument();
  });

  test('displays team cards', () => {
    render(<UsageByTeam data={mockSessionData} />);
    
    // Should display team names from mock data - use getAllByText for duplicates
    const backendElements = screen.getAllByText(/backend team/i);
    expect(backendElements.length).toBeGreaterThan(0);
    
    const frontendElements = screen.getAllByText(/frontend team/i);
    expect(frontendElements.length).toBeGreaterThan(0);
  });

  test('displays team comparison table', () => {
    render(<UsageByTeam data={mockSessionData} />);
    
    expect(screen.getByText(/team comparison/i)).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('handles empty data', () => {
    render(<UsageByTeam data={[]} />);
    
    expect(screen.getByText(/usage by team/i)).toBeInTheDocument();
  });
});

describe('UsageByUser Component', () => {
  test('renders usage by user', () => {
    render(<UsageByUser data={mockSessionData} />);
    
    expect(screen.getByText(/usage by user/i)).toBeInTheDocument();
    expect(screen.getByText(/individual user activity and metrics/i)).toBeInTheDocument();
  });

  test('displays sort controls', () => {
    render(<UsageByUser data={mockSessionData} />);
    
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
  });

  test('displays user table', () => {
    render(<UsageByUser data={mockSessionData} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    // Should display user names from mock data - use getAllByText for duplicates
    const aliceElements = screen.getAllByText(/alice johnson/i);
    expect(aliceElements.length).toBeGreaterThan(0);
  });

  test('displays summary statistics', () => {
    render(<UsageByUser data={mockSessionData} />);
    
    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText(/avg sessions per user/i)).toBeInTheDocument();
    expect(screen.getByText(/most active user/i)).toBeInTheDocument();
  });

  test('handles empty data', () => {
    render(<UsageByUser data={[]} />);
    
    expect(screen.getByText(/usage by user/i)).toBeInTheDocument();
  });
});
