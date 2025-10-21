// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-001
// User Story: Provide mock session data for dashboard visualizations
// Acceptance Criteria: 
//   - Include all required fields: userId, projectId, sessionType, agentsUsed, 
//     featuresUsed, tokenUsage, startTime, duration, outputs
//   - Provide diverse data for multiple teams and users
//   - Support week-over-week trend analysis
// GxP Impact: YES - Data structure must support audit and compliance requirements
// Risk Level: MEDIUM
// ============================================================================

/**
 * Mock session data for Kavia usage insights dashboard
 * @module mockSessionData
 * 
 * Data structure:
 * - userId: string - Unique user identifier
 * - projectId: string - Project identifier
 * - sessionType: string - Type of session (Planning, CodeWriting, Testing, etc.)
 * - agentsUsed: array - List of agents used in session
 * - featuresUsed: array - List of features used in session
 * - tokenUsage: number - Number of tokens consumed
 * - startTime: string - ISO 8601 timestamp
 * - duration: number - Session duration in minutes
 * - outputs: object - Session outputs (documents, files, PRs)
 * - team: string - Team name
 */

// PUBLIC_INTERFACE
const mockSessionData = [
  // Week 1 Data (7 days ago)
  {
    userId: "user001",
    username: "Alice Johnson",
    projectId: "proj-alpha",
    sessionType: "CodeWriting",
    agentsUsed: ["CodeWritingAgent", "TestExecutionAgent"],
    featuresUsed: ["Code Generation", "Unit Testing", "Syntax Validation"],
    tokenUsage: 15000,
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    outputs: {
      documentsGenerated: 2,
      codeFilesUpdated: 8,
      prsCreated: 1
    },
    team: "Backend Team"
  },
  {
    userId: "user002",
    username: "Bob Smith",
    projectId: "proj-beta",
    sessionType: "Planning",
    agentsUsed: ["PlanningAgent"],
    featuresUsed: ["Architecture Planning", "Task Breakdown"],
    tokenUsage: 8000,
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    duration: 30,
    outputs: {
      documentsGenerated: 3,
      codeFilesUpdated: 0,
      prsCreated: 0
    },
    team: "Frontend Team"
  },
  {
    userId: "user003",
    username: "Carol Davis",
    projectId: "proj-gamma",
    sessionType: "Testing",
    agentsUsed: ["TestCodeWritingAgent", "TestExecutionAgent"],
    featuresUsed: ["Integration Testing", "Test Coverage Analysis"],
    tokenUsage: 12000,
    startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    outputs: {
      documentsGenerated: 1,
      codeFilesUpdated: 5,
      prsCreated: 1
    },
    team: "QA Team"
  },
  {
    userId: "user004",
    username: "David Wilson",
    projectId: "proj-alpha",
    sessionType: "BugFixing",
    agentsUsed: ["BugFixingAndVerificationAgent"],
    featuresUsed: ["Error Analysis", "Code Refactoring", "Verification"],
    tokenUsage: 10000,
    startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
    duration: 50,
    outputs: {
      documentsGenerated: 0,
      codeFilesUpdated: 3,
      prsCreated: 1
    },
    team: "Backend Team"
  },
  {
    userId: "user001",
    username: "Alice Johnson",
    projectId: "proj-delta",
    sessionType: "Documentation",
    agentsUsed: ["DocumentationAgent"],
    featuresUsed: ["API Documentation", "Architecture Diagrams"],
    tokenUsage: 6000,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 25,
    outputs: {
      documentsGenerated: 4,
      codeFilesUpdated: 0,
      prsCreated: 0
    },
    team: "Backend Team"
  },

  // Week 2 Data (Current week)
  {
    userId: "user001",
    username: "Alice Johnson",
    projectId: "proj-alpha",
    sessionType: "CodeWriting",
    agentsUsed: ["CodeWritingAgent", "TestExecutionAgent"],
    featuresUsed: ["Code Generation", "Unit Testing", "Code Review"],
    tokenUsage: 18000,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 55,
    outputs: {
      documentsGenerated: 1,
      codeFilesUpdated: 12,
      prsCreated: 2
    },
    team: "Backend Team"
  },
  {
    userId: "user002",
    username: "Bob Smith",
    projectId: "proj-beta",
    sessionType: "CodeWriting",
    agentsUsed: ["CodeWritingAgent"],
    featuresUsed: ["Code Generation", "Syntax Validation"],
    tokenUsage: 14000,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    duration: 40,
    outputs: {
      documentsGenerated: 0,
      codeFilesUpdated: 7,
      prsCreated: 1
    },
    team: "Frontend Team"
  },
  {
    userId: "user005",
    username: "Emma Brown",
    projectId: "proj-epsilon",
    sessionType: "Planning",
    agentsUsed: ["PlanningAgent"],
    featuresUsed: ["Architecture Planning", "Task Breakdown", "Risk Analysis"],
    tokenUsage: 9000,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 35,
    outputs: {
      documentsGenerated: 5,
      codeFilesUpdated: 0,
      prsCreated: 0
    },
    team: "Architecture Team"
  },
  {
    userId: "user003",
    username: "Carol Davis",
    projectId: "proj-gamma",
    sessionType: "Testing",
    agentsUsed: ["TestCodeWritingAgent", "TestExecutionAgent"],
    featuresUsed: ["Integration Testing", "Unit Testing", "Test Coverage Analysis"],
    tokenUsage: 16000,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
    duration: 70,
    outputs: {
      documentsGenerated: 2,
      codeFilesUpdated: 9,
      prsCreated: 2
    },
    team: "QA Team"
  },
  {
    userId: "user006",
    username: "Frank Miller",
    projectId: "proj-zeta",
    sessionType: "CodeWriting",
    agentsUsed: ["CodeWritingAgent"],
    featuresUsed: ["Code Generation"],
    tokenUsage: 11000,
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    duration: 38,
    outputs: {
      documentsGenerated: 0,
      codeFilesUpdated: 6,
      prsCreated: 1
    },
    team: "Frontend Team"
  },
  {
    userId: "user004",
    username: "David Wilson",
    projectId: "proj-alpha",
    sessionType: "BugFixing",
    agentsUsed: ["BugFixingAndVerificationAgent", "TestExecutionAgent"],
    featuresUsed: ["Error Analysis", "Code Refactoring", "Verification", "Unit Testing"],
    tokenUsage: 13000,
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    duration: 48,
    outputs: {
      documentsGenerated: 1,
      codeFilesUpdated: 4,
      prsCreated: 1
    },
    team: "Backend Team"
  },
  {
    userId: "user007",
    username: "Grace Lee",
    projectId: "proj-eta",
    sessionType: "Documentation",
    agentsUsed: ["DocumentationAgent"],
    featuresUsed: ["API Documentation"],
    tokenUsage: 5000,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    duration: 20,
    outputs: {
      documentsGenerated: 3,
      codeFilesUpdated: 0,
      prsCreated: 0
    },
    team: "Architecture Team"
  },
  {
    userId: "user002",
    username: "Bob Smith",
    projectId: "proj-beta",
    sessionType: "Planning",
    agentsUsed: ["PlanningAgent"],
    featuresUsed: ["Task Breakdown"],
    tokenUsage: 7000,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: 28,
    outputs: {
      documentsGenerated: 2,
      codeFilesUpdated: 0,
      prsCreated: 0
    },
    team: "Frontend Team"
  },
  {
    userId: "user001",
    username: "Alice Johnson",
    projectId: "proj-alpha",
    sessionType: "CodeWriting",
    agentsUsed: ["CodeWritingAgent"],
    featuresUsed: ["Code Generation", "Code Review"],
    tokenUsage: 17000,
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    duration: 52,
    outputs: {
      documentsGenerated: 0,
      codeFilesUpdated: 10,
      prsCreated: 2
    },
    team: "Backend Team"
  },
  {
    userId: "user008",
    username: "Henry Martinez",
    projectId: "proj-theta",
    sessionType: "Testing",
    agentsUsed: ["TestExecutionAgent"],
    featuresUsed: ["Unit Testing"],
    tokenUsage: 4000,
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    duration: 15,
    outputs: {
      documentsGenerated: 0,
      codeFilesUpdated: 2,
      prsCreated: 0
    },
    team: "QA Team"
  }
];

// PUBLIC_INTERFACE
export default mockSessionData;

// PUBLIC_INTERFACE
/**
 * Get unique teams from session data
 * @returns {string[]} Array of unique team names
 */
export const getUniqueTeams = () => {
  return [...new Set(mockSessionData.map(session => session.team))];
};

// PUBLIC_INTERFACE
/**
 * Get unique users from session data
 * @returns {Array<{userId: string, username: string}>} Array of unique users
 */
export const getUniqueUsers = () => {
  const userMap = new Map();
  mockSessionData.forEach(session => {
    if (!userMap.has(session.userId)) {
      userMap.set(session.userId, { userId: session.userId, username: session.username });
    }
  });
  return Array.from(userMap.values());
};

// PUBLIC_INTERFACE
/**
 * Get unique features from session data
 * @returns {string[]} Array of unique feature names
 */
export const getUniqueFeatures = () => {
  const features = new Set();
  mockSessionData.forEach(session => {
    session.featuresUsed.forEach(feature => features.add(feature));
  });
  return Array.from(features);
};
