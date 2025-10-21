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
 
 /**
  * Mock data generator updated to provide 28 days of sessions with realistic variability.
  */
 
 // Simple deterministic PRNG based on seed
 function seededRandom(seed) {
   let x = Math.sin(seed) * 10000;
   return x - Math.floor(x);
 }
 
 const USERS = [
   { userId: "user001", username: "Alice Johnson", team: "Backend Team" },
   { userId: "user002", username: "Bob Smith", team: "Frontend Team" },
   { userId: "user003", username: "Carol Davis", team: "QA Team" },
   { userId: "user004", username: "David Wilson", team: "Backend Team" },
   { userId: "user005", username: "Emma Brown", team: "Architecture Team" },
   { userId: "user006", username: "Frank Miller", team: "Frontend Team" },
   { userId: "user007", username: "Grace Lee", team: "Architecture Team" },
   { userId: "user008", username: "Henry Martinez", team: "QA Team" },
 ];
 
 const PROJECTS = ["proj-alpha", "proj-beta", "proj-gamma", "proj-delta", "proj-epsilon", "proj-zeta", "proj-eta", "proj-theta"];
 const SESSION_TYPES = ["Planning", "CodeWriting", "Testing", "BugFixing", "Documentation"];
 const AGENTS_BY_TYPE = {
   Planning: ["PlanningAgent"],
   CodeWriting: ["CodeWritingAgent", "TestExecutionAgent"],
   Testing: ["TestCodeWritingAgent", "TestExecutionAgent"],
   BugFixing: ["BugFixingAndVerificationAgent", "TestExecutionAgent"],
   Documentation: ["DocumentationAgent"],
 };
 const FEATURES_POOL = [
   "Code Generation", "Unit Testing", "Syntax Validation", "Code Review",
   "Integration Testing", "Test Coverage Analysis", "Error Analysis", "Code Refactoring", "Verification",
   "Architecture Planning", "Task Breakdown", "Risk Analysis", "API Documentation", "Architecture Diagrams"
 ];
 
 function pickWeighted(arr, weights, seed) {
   const total = weights.reduce((a, b) => a + b, 0);
   const r = seededRandom(seed) * total;
   let cum = 0;
   for (let i = 0; i < arr.length; i++) {
     cum += weights[i];
     if (r <= cum) return arr[i];
   }
   return arr[arr.length - 1];
 }
 
 function pickSome(arr, min, max, seedBase) {
   const count = min + Math.floor(seededRandom(seedBase) * (max - min + 1));
   const selected = new Set();
   let i = 0;
   while (selected.size < count && i < arr.length * 3) {
     const idx = Math.floor(seededRandom(seedBase + i + 1) * arr.length);
     selected.add(arr[idx]);
     i++;
   }
   return Array.from(selected);
 }
 
 function getDayStart(date) {
   const d = new Date(date);
   d.setHours(0, 0, 0, 0);
   return d;
 }
 
 function generateSessionsForNDays(nDays = 28) {
   const now = new Date();
   const sessions = [];
   const weekdayWeights = [0.6, 0.9, 1.2, 1.3, 1.1, 0.5, 0.4]; // Sun..Sat
 
   for (let dayOffset = nDays - 1; dayOffset >= 0; dayOffset--) {
     const daySeedBase = 1000 + dayOffset * 31;
     const dayDate = new Date(getDayStart(now).getTime() - dayOffset * 24 * 60 * 60 * 1000);
     const weekday = dayDate.getDay();
     const factor = weekdayWeights[weekday];
 
     const baseMin = 10, baseMax = 40;
     const minToday = Math.max(8, Math.floor(baseMin * factor));
     const maxToday = Math.max(minToday + 2, Math.floor(baseMax * factor));
     const countToday = minToday + Math.floor(seededRandom(daySeedBase) * (maxToday - minToday + 1));
 
     for (let i = 0; i < countToday; i++) {
       const sessionSeed = daySeedBase + i * 7;
 
       const user = USERS[Math.floor(seededRandom(sessionSeed + 1) * USERS.length)];
       const sessionType = pickWeighted(SESSION_TYPES, [0.9, 1.6, 1.4, 0.9, 0.6], sessionSeed + 2);
       const agentsUsed = AGENTS_BY_TYPE[sessionType];
       const featuresUsed = pickSome(FEATURES_POOL, 1, 4, sessionSeed + 3);
 
       const typeBaseTokens = { Planning: 7000, CodeWriting: 14000, Testing: 12000, BugFixing: 11000, Documentation: 6000 }[sessionType];
       const tokenJitter = 0.7 + seededRandom(sessionSeed + 4) * 0.8; // 0.7..1.5
       const tokenUsage = Math.round(typeBaseTokens * tokenJitter * (1 + (featuresUsed.length - 1) * 0.08));
 
       const baseDur = { Planning: 30, CodeWriting: 50, Testing: 60, BugFixing: 45, Documentation: 25 }[sessionType];
       const durVar = Math.floor(seededRandom(sessionSeed + 5) * 30) - 15; // -15..+14
       const duration = Math.max(10, Math.min(95, baseDur + durVar));
 
       const projectId = PROJECTS[Math.floor(seededRandom(sessionSeed + 6) * PROJECTS.length)];
 
       const startHourBase = pickWeighted([9, 10, 11, 13, 14, 15, 16, 19, 21], [0.9, 1.1, 1.2, 1.1, 1.0, 0.9, 0.8, 0.5, 0.3], sessionSeed + 7);
       const minute = Math.floor(seededRandom(sessionSeed + 8) * 60);
       const start = new Date(dayDate);
       start.setHours(startHourBase, minute, 0, 0);
 
       const outputs = (() => {
         const docs = Math.max(0, Math.round((sessionType === "Documentation" || sessionType === "Planning" ? 2 : 0.5) * seededRandom(sessionSeed + 9) * 3));
         const files = Math.max(0, Math.round((sessionType === "CodeWriting" || sessionType === "BugFixing" ? 6 : 2) * seededRandom(sessionSeed + 10) * 3));
         const prs = Math.max(0, Math.round((sessionType === "CodeWriting" || sessionType === "BugFixing" ? 1 : 0.3) * seededRandom(sessionSeed + 11) * 2));
         return {
           documentsGenerated: docs,
           codeFilesUpdated: files,
           prsCreated: prs
         };
       })();
 
       sessions.push({
         userId: user.userId,
         username: user.username,
         projectId,
         sessionType,
         agentsUsed,
         featuresUsed,
         tokenUsage,
         startTime: start.toISOString(),
         duration,
         outputs,
         team: user.team
       });
     }
   }
 
   sessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
   return sessions;
 }
 
 // PUBLIC_INTERFACE
 const mockSessionData = generateSessionsForNDays(28);
 
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
