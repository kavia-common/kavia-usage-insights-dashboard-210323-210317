// ============================================================================
// UNIT TESTS: dataProcessing utility
// ============================================================================

import {
  filterSessions,
  calculateFeatureUsage,
  getMostUsedFeatures,
  getLeastUsedFeatures,
  calculateUsageByTeam,
  calculateUsageByUser,
  calculateWeekOverWeekTrends,
  groupSessionsByDate
} from '../../utils/dataProcessing';

const mockSessions = [
  {
    userId: 'user001',
    username: 'Alice',
    team: 'Backend Team',
    startTime: '2024-01-15T10:00:00Z',
    featuresUsed: ['Code Generation', 'Testing'],
    tokenUsage: 1000,
    duration: 30
  },
  {
    userId: 'user002',
    username: 'Bob',
    team: 'Frontend Team',
    startTime: '2024-01-16T10:00:00Z',
    featuresUsed: ['Code Generation', 'Documentation'],
    tokenUsage: 1500,
    duration: 45
  },
  {
    userId: 'user001',
    username: 'Alice',
    team: 'Backend Team',
    startTime: '2024-01-17T10:00:00Z',
    featuresUsed: ['Testing'],
    tokenUsage: 800,
    duration: 20
  }
];

describe('dataProcessing', () => {
  // Test filterSessions
  describe('filterSessions', () => {
    test('should filter by team', () => {
      const filtered = filterSessions(mockSessions, { team: 'Backend Team' });
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(s => s.team === 'Backend Team')).toBe(true);
    });

    test('should filter by userId', () => {
      const filtered = filterSessions(mockSessions, { userId: 'user001' });
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(s => s.userId === 'user001')).toBe(true);
    });

    test('should filter by feature', () => {
      const filtered = filterSessions(mockSessions, { feature: 'Testing' });
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(s => s.featuresUsed.includes('Testing'))).toBe(true);
    });

    test('should return empty array for null input', () => {
      const filtered = filterSessions(null, {});
      
      expect(filtered).toEqual([]);
    });
  });

  // Test calculateFeatureUsage
  describe('calculateFeatureUsage', () => {
    test('should calculate feature usage count', () => {
      const usage = calculateFeatureUsage(mockSessions);
      
      expect(usage['Code Generation']).toBe(2);
      expect(usage['Testing']).toBe(2);
      expect(usage['Documentation']).toBe(1);
    });

    test('should return empty object for null input', () => {
      const usage = calculateFeatureUsage(null);
      
      expect(usage).toEqual({});
    });
  });

  // Test getMostUsedFeatures
  describe('getMostUsedFeatures', () => {
    test('should return most used features sorted by count', () => {
      const mostUsed = getMostUsedFeatures(mockSessions, 2);
      
      expect(mostUsed).toHaveLength(2);
      expect(mostUsed[0].count).toBeGreaterThanOrEqual(mostUsed[1].count);
    });

    test('should limit results to specified number', () => {
      const mostUsed = getMostUsedFeatures(mockSessions, 1);
      
      expect(mostUsed).toHaveLength(1);
    });
  });

  // Test getLeastUsedFeatures
  describe('getLeastUsedFeatures', () => {
    test('should return least used features sorted by count', () => {
      const leastUsed = getLeastUsedFeatures(mockSessions, 2);
      
      expect(leastUsed).toHaveLength(2);
      expect(leastUsed[0].count).toBeLessThanOrEqual(leastUsed[1].count);
    });
  });

  // Test calculateUsageByTeam
  describe('calculateUsageByTeam', () => {
    test('should aggregate usage by team', () => {
      const teamStats = calculateUsageByTeam(mockSessions);
      
      expect(teamStats['Backend Team'].sessionCount).toBe(2);
      expect(teamStats['Backend Team'].totalTokens).toBe(1800);
      expect(teamStats['Backend Team'].totalDuration).toBe(50);
      expect(teamStats['Backend Team'].uniqueUsers).toBe(1);
      
      expect(teamStats['Frontend Team'].sessionCount).toBe(1);
      expect(teamStats['Frontend Team'].uniqueUsers).toBe(1);
    });

    test('should return empty object for null input', () => {
      const teamStats = calculateUsageByTeam(null);
      
      expect(teamStats).toEqual({});
    });
  });

  // Test calculateUsageByUser
  describe('calculateUsageByUser', () => {
    test('should aggregate usage by user', () => {
      const userStats = calculateUsageByUser(mockSessions);
      
      expect(userStats).toHaveLength(2);
      
      const alice = userStats.find(u => u.userId === 'user001');
      expect(alice.sessionCount).toBe(2);
      expect(alice.totalTokens).toBe(1800);
      expect(alice.totalDuration).toBe(50);
      
      const bob = userStats.find(u => u.userId === 'user002');
      expect(bob.sessionCount).toBe(1);
    });

    test('should sort by session count descending', () => {
      const userStats = calculateUsageByUser(mockSessions);
      
      expect(userStats[0].sessionCount).toBeGreaterThanOrEqual(userStats[1].sessionCount);
    });

    test('should return empty array for null input', () => {
      const userStats = calculateUsageByUser(null);
      
      expect(userStats).toEqual([]);
    });
  });

  // Test calculateWeekOverWeekTrends
  describe('calculateWeekOverWeekTrends', () => {
    test('should calculate current and previous week stats', () => {
      const now = new Date();
      const recentSessions = [
        {
          ...mockSessions[0],
          startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          tokenUsage: 1000,
          duration: 30
        },
        {
          ...mockSessions[1],
          startTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          tokenUsage: 1500,
          duration: 45
        }
      ];

      const trends = calculateWeekOverWeekTrends(recentSessions);
      
      expect(trends).toHaveProperty('currentWeek');
      expect(trends).toHaveProperty('previousWeek');
      expect(trends).toHaveProperty('trend');
      expect(trends.currentWeek).toHaveProperty('sessionCount');
      expect(trends.currentWeek).toHaveProperty('totalTokens');
      expect(trends.currentWeek).toHaveProperty('totalDuration');
    });

    test('should handle empty input', () => {
      const trends = calculateWeekOverWeekTrends([]);
      
      expect(trends.currentWeek.sessionCount).toBe(0);
      expect(trends.previousWeek.sessionCount).toBe(0);
    });
  });

  // Test groupSessionsByDate
  describe('groupSessionsByDate', () => {
    test('should group sessions by day', () => {
      const grouped = groupSessionsByDate(mockSessions, 'day');
      
      expect(Object.keys(grouped)).toHaveLength(3);
      expect(grouped['2024-01-15']).toHaveLength(1);
      expect(grouped['2024-01-16']).toHaveLength(1);
      expect(grouped['2024-01-17']).toHaveLength(1);
    });

    test('should return empty object for null input', () => {
      const grouped = groupSessionsByDate(null, 'day');
      
      expect(grouped).toEqual({});
    });
  });
});
