// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-007
// User Story: Process session data for visualizations
// Acceptance Criteria:
//   - Calculate week-over-week trends
//   - Identify most/least used features
//   - Aggregate usage by team and user
//   - Apply filters to data
// GxP Impact: NO - Data processing for visualization only
// Risk Level: LOW
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Filter session data based on criteria
 * 
 * @param {Array<Object>} sessions - Array of session objects
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.startDate] - Filter by start date (ISO string)
 * @param {string} [filters.endDate] - Filter by end date (ISO string)
 * @param {string} [filters.team] - Filter by team name
 * @param {string} [filters.feature] - Filter by feature name
 * @param {string} [filters.userId] - Filter by user ID
 * @returns {Array<Object>} Filtered session data
 */
export const filterSessions = (sessions, filters = {}) => {
  if (!sessions || !Array.isArray(sessions)) {
    return [];
  }

  return sessions.filter(session => {
    // Date range filter
    if (filters.startDate && filters.endDate) {
      const sessionDate = new Date(session.startTime);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      if (sessionDate < startDate || sessionDate > endDate) {
        return false;
      }
    }

    // Team filter
    if (filters.team && session.team !== filters.team) {
      return false;
    }

    // Feature filter
    if (filters.feature && !session.featuresUsed.includes(filters.feature)) {
      return false;
    }

    // User filter
    if (filters.userId && session.userId !== filters.userId) {
      return false;
    }

    return true;
  });
};

// PUBLIC_INTERFACE
/**
 * Calculate feature usage frequency
 * 
 * @param {Array<Object>} sessions - Array of session objects
 * @returns {Object} Object with feature names as keys and usage count as values
 */
export const calculateFeatureUsage = (sessions) => {
  if (!sessions || !Array.isArray(sessions)) {
    return {};
  }

  const featureCount = {};
  
  sessions.forEach(session => {
    if (session.featuresUsed && Array.isArray(session.featuresUsed)) {
      session.featuresUsed.forEach(feature => {
        featureCount[feature] = (featureCount[feature] || 0) + 1;
      });
    }
  });

  return featureCount;
};

// PUBLIC_INTERFACE
/**
 * Get most used features
 * 
 * @param {Array<Object>} sessions - Array of session objects
 * @param {number} limit - Number of top features to return
 * @returns {Array<Object>} Array of {feature, count} objects sorted by count descending
 */
export const getMostUsedFeatures = (sessions, limit = 5) => {
  const featureCount = calculateFeatureUsage(sessions);
  
  return Object.entries(featureCount)
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// PUBLIC_INTERFACE
/**
 * Get least used features
 * 
 * @param {Array<Object>} sessions - Array of session objects
 * @param {number} limit - Number of bottom features to return
 * @returns {Array<Object>} Array of {feature, count} objects sorted by count ascending
 */
export const getLeastUsedFeatures = (sessions, limit = 5) => {
  const featureCount = calculateFeatureUsage(sessions);
  
  return Object.entries(featureCount)
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => a.count - b.count)
    .slice(0, limit);
};

// PUBLIC_INTERFACE
/**
 * Calculate usage by team
 * 
 * @param {Array<Object>} sessions - Array of session objects
 * @returns {Object} Object with team names as keys and statistics as values
 */
export const calculateUsageByTeam = (sessions) => {
  if (!sessions || !Array.isArray(sessions)) {
    return {};
  }

  const teamStats = {};

  sessions.forEach(session => {
    if (!teamStats[session.team]) {
      teamStats[session.team] = {
        sessionCount: 0,
        totalTokens: 0,
        totalDuration: 0,
        users: new Set()
      };
    }

    teamStats[session.team].sessionCount += 1;
    teamStats[session.team].totalTokens += session.tokenUsage || 0;
    teamStats[session.team].totalDuration += session.duration || 0;
    teamStats[session.team].users.add(session.userId);
  });

  // Convert Set to count
  Object.keys(teamStats).forEach(team => {
    teamStats[team].uniqueUsers = teamStats[team].users.size;
    delete teamStats[team].users;
  });

  return teamStats;
};

// PUBLIC_INTERFACE
/**
 * Calculate usage by user
 * 
 * @param {Array<Object>} sessions - Array of session objects
 * @returns {Array<Object>} Array of user statistics sorted by session count
 */
export const calculateUsageByUser = (sessions) => {
  if (!sessions || !Array.isArray(sessions)) {
    return [];
  }

  const userStats = {};

  sessions.forEach(session => {
    if (!userStats[session.userId]) {
      userStats[session.userId] = {
        userId: session.userId,
        username: session.username,
        team: session.team,
        sessionCount: 0,
        totalTokens: 0,
        totalDuration: 0
      };
    }

    userStats[session.userId].sessionCount += 1;
    userStats[session.userId].totalTokens += session.tokenUsage || 0;
    userStats[session.userId].totalDuration += session.duration || 0;
  });

  return Object.values(userStats).sort((a, b) => b.sessionCount - a.sessionCount);
};

/**
 * Calculate week-over-week trends
 * 
 * @param {Array<Object>} sessions - Array of session objects
 * @returns {Object} Object containing current week and previous week statistics
 */
export const calculateWeekOverWeekTrends = (sessions) => {
  if (!sessions || !Array.isArray(sessions)) {
    return { currentWeek: {}, previousWeek: {}, trend: {} };
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const currentWeekSessions = sessions.filter(s => new Date(s.startTime) >= weekAgo);
  const previousWeekSessions = sessions.filter(s => {
    const date = new Date(s.startTime);
    return date >= twoWeeksAgo && date < weekAgo;
  });

  const currentWeekStats = {
    sessionCount: currentWeekSessions.length,
    totalTokens: currentWeekSessions.reduce((sum, s) => sum + (s.tokenUsage || 0), 0),
    totalDuration: currentWeekSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
    features: calculateFeatureUsage(currentWeekSessions)
  };

  const previousWeekStats = {
    sessionCount: previousWeekSessions.length,
    totalTokens: previousWeekSessions.reduce((sum, s) => sum + (s.tokenUsage || 0), 0),
    totalDuration: previousWeekSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
    features: calculateFeatureUsage(previousWeekSessions)
  };

  // Calculate percentage changes
  const trend = {
    sessionCountChange: calculatePercentageChange(previousWeekStats.sessionCount, currentWeekStats.sessionCount),
    tokenUsageChange: calculatePercentageChange(previousWeekStats.totalTokens, currentWeekStats.totalTokens),
    durationChange: calculatePercentageChange(previousWeekStats.totalDuration, currentWeekStats.totalDuration)
  };

  return {
    currentWeek: currentWeekStats,
    previousWeek: previousWeekStats,
    trend
  };
};

// Helper function to calculate percentage change
const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) {
    return newValue > 0 ? 100 : 0;
  }
  return ((newValue - oldValue) / oldValue) * 100;
};

// PUBLIC_INTERFACE
/**
 * Group sessions by date
 * 
 * @param {Array<Object>} sessions - Array of session objects
 * @param {string} groupBy - Grouping interval ('day', 'week', 'month')
 * @returns {Object} Object with dates as keys and session arrays as values
 */
export const groupSessionsByDate = (sessions, groupBy = 'day') => {
  if (!sessions || !Array.isArray(sessions)) {
    return {};
  }

  const grouped = {};

  sessions.forEach(session => {
    const date = new Date(session.startTime);
    let key;

    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week': {
        const weekStart = new Date(date);
        // Normalize to start of day
        weekStart.setHours(0, 0, 0, 0);
        // Set to Monday as start of week for consistency (Ocean Professional locale choice)
        const day = (weekStart.getDay() + 6) % 7; // Monday=0
        weekStart.setDate(weekStart.getDate() - day);
        key = weekStart.toISOString().split('T')[0];
        break;
      }
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(session);
  });

  return grouped;
};

/**
 * PUBLIC_INTERFACE
 * getWeeklyTrendSeries
 * Build a weekly aggregated series over the last `weeks` weeks (default 4).
 * Each item contains weekStart (ISO string), label ("Week of Mon YYYY-MM-DD"),
 * and aggregated totals: sessions, tokens, duration.
 *
 * @param {Array<Object>} sessions - Session array
 * @param {number} weeks - Number of weeks to include (default 4)
 * @returns {Array<{weekStart: string, label: string, sessions: number, tokens: number, duration: number}>}
 */
export const getWeeklyTrendSeries = (sessions, weeks = 4) => {
  if (!sessions || !Array.isArray(sessions) || weeks <= 0) return [];

  // Determine Monday of current week
  const now = new Date();
  const current = new Date(now);
  current.setHours(0, 0, 0, 0);
  const day = (current.getDay() + 6) % 7; // Monday=0
  current.setDate(current.getDate() - day);

  // Create week start boundaries for the last N weeks (oldest -> newest)
  const weekStarts = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const ws = new Date(current);
    ws.setDate(current.getDate() - i * 7);
    weekStarts.push(ws);
  }

  // Prepare buckets keyed by ISO date
  const buckets = {};
  weekStarts.forEach(ws => {
    const iso = ws.toISOString().split('T')[0];
    buckets[iso] = [];
  });

  // Assign sessions to appropriate week bucket (by Monday start)
  sessions.forEach(s => {
    const d = new Date(s.startTime);
    const ws = new Date(d);
    ws.setHours(0, 0, 0, 0);
    const dd = (ws.getDay() + 6) % 7;
    ws.setDate(ws.getDate() - dd);
    const iso = ws.toISOString().split('T')[0];
    if (buckets[iso]) {
      buckets[iso].push(s);
    }
  });

  // Build series
  const series = weekStarts.map(ws => {
    const iso = ws.toISOString().split('T')[0];
    const bucket = buckets[iso] || [];
    const sessionsCount = bucket.length;
    const tokens = bucket.reduce((sum, s) => sum + (s.tokenUsage || 0), 0);
    const duration = bucket.reduce((sum, s) => sum + (s.duration || 0), 0);

    const label = `Week of ${ws.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })}`;

    return {
      weekStart: iso,
      label,
      sessions: sessionsCount,
      tokens,
      duration
    };
  });

  return series;
};
