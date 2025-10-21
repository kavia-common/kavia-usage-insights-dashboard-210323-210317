 // ============================================================================
 // REQUIREMENT TRACEABILITY
 // ============================================================================
 // Requirement ID: REQ-021
 // User Story: Aggregate "success" result fields and provide weekly trend series
 // ============================================================================

 // PUBLIC_INTERFACE
 /**
  * getSuccessTotals
  * Aggregate totals for the 9 success metrics over the provided sessions.
  */
 export const getSuccessTotals = (sessions) => {
   const safe = Array.isArray(sessions) ? sessions : [];
   const totals = {
     linesOfCodeGenerated: 0,
     filesUpdated: 0,
     documentsGenerated: 0,
     sessionsMerged: 0,
     prsCreated: 0,
     questionsAnswered: 0,
     repositoriesIngested: 0,
     projectsCreated: 0,
     nodesCreated: 0
   };

   safe.forEach(s => {
     const r = s.results || {};
     totals.linesOfCodeGenerated += Number(r.linesOfCodeGenerated || 0);
     totals.filesUpdated += Number(r.filesUpdated || 0);
     totals.documentsGenerated += Number((s.outputs && s.outputs.documentsGenerated) || r.documentsGenerated || 0);
     totals.sessionsMerged += Number(r.sessionsMerged || 0);
     totals.prsCreated += Number((s.outputs && s.outputs.prsCreated) || r.prsCreated || 0);
     totals.questionsAnswered += Number(r.questionsAnswered || 0);
     totals.repositoriesIngested += Number(r.repositoriesIngested || 0);
     totals.projectsCreated += Number(r.projectsCreated || 0);
     totals.nodesCreated += Number(r.nodesCreated || 0);
   });

   return totals;
 };

 // PUBLIC_INTERFACE
 /**
  * getWeeklySuccessSeries
  * Build weekly series for one or more metrics over the last N weeks.
  *
  * @param {Array<Object>} sessions
  * @param {Array<string>} metrics
  * @param {number} weeks
  */
 export const getWeeklySuccessSeries = (sessions, metrics, weeks = 8) => {
   const safe = Array.isArray(sessions) ? sessions : [];
   const keys = (Array.isArray(metrics) && metrics.length > 0)
     ? metrics
     : ['linesOfCodeGenerated', 'filesUpdated', 'documentsGenerated', 'prsCreated'];

   const now = new Date();
   const current = new Date(now);
   current.setHours(0, 0, 0, 0);
   const day = (current.getDay() + 6) % 7; // Monday=0
   current.setDate(current.getDate() - day);

   const weekStarts = [];
   for (let i = weeks - 1; i >= 0; i--) {
     const ws = new Date(current);
     ws.setDate(current.getDate() - i * 7);
     weekStarts.push(ws);
   }

   const buckets = {};
   weekStarts.forEach(ws => {
     const iso = ws.toISOString().split('T')[0];
     buckets[iso] = { weekStart: iso, label: `Week of ${ws.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}` };
     keys.forEach(k => { buckets[iso][k] = 0; });
   });

   const getWeekStartIso = (d) => {
     const ws = new Date(d);
     ws.setHours(0, 0, 0, 0);
     const dd = (ws.getDay() + 6) % 7;
     ws.setDate(ws.getDate() - dd);
     return ws.toISOString().split('T')[0];
   };

   safe.forEach(s => {
     const iso = getWeekStartIso(new Date(s.startTime));
     if (!buckets[iso]) return;

     const r = s.results || {};
     const outputs = s.outputs || {};
     const combined = {
       linesOfCodeGenerated: Number(r.linesOfCodeGenerated || 0),
       filesUpdated: Number(r.filesUpdated || 0) + Number(outputs.codeFilesUpdated || 0),
       documentsGenerated: Number(r.documentsGenerated || 0) + Number(outputs.documentsGenerated || 0),
       sessionsMerged: Number(r.sessionsMerged || 0),
       prsCreated: Number(r.prsCreated || 0) + Number(outputs.prsCreated || 0),
       questionsAnswered: Number(r.questionsAnswered || 0),
       repositoriesIngested: Number(r.repositoriesIngested || 0),
       projectsCreated: Number(r.projectsCreated || 0),
       nodesCreated: Number(r.nodesCreated || 0)
     };

     keys.forEach(k => { buckets[iso][k] += Number(combined[k] || 0); });
   });

   const series = weekStarts.map(ws => buckets[ws.toISOString().split('T')[0]]);
   return { series, keys };
 };

 // PUBLIC_INTERFACE
 /**
  * successMetricMeta
  * Metadata for labeling KPI cards and legends.
  */
 export const successMetricMeta = {
   linesOfCodeGenerated: { label: 'Lines of Code', short: 'LOC' },
   filesUpdated: { label: 'Files Updated', short: 'Files' },
   documentsGenerated: { label: 'Documents Generated', short: 'Docs' },
   sessionsMerged: { label: 'Sessions Merged', short: 'Merges' },
   prsCreated: { label: 'PRs Created', short: 'PRs' },
   questionsAnswered: { label: 'Questions Answered', short: 'Q&A' },
   repositoriesIngested: { label: 'Repositories Ingested', short: 'Repos' },
   projectsCreated: { label: 'Projects Created', short: 'Projects' },
   nodesCreated: { label: 'Nodes Created', short: 'Nodes' }
 };
