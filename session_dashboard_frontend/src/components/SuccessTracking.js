 // ============================================================================
 // REQUIREMENT TRACEABILITY
 // ============================================================================
 // Requirement ID: REQ-022
 // User Story: Display Success Tracking KPIs and trends
 // ============================================================================

 import React, { useMemo, useState } from 'react';
 import '../styles/Visualizations.css';
 import ChartCard from './ChartCard';
 import { getSuccessTotals, getWeeklySuccessSeries, successMetricMeta } from '../utils/successProcessing';
 import {
   LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
 } from 'recharts';

 // PUBLIC_INTERFACE
 /**
  * SuccessTracking Component
  * Displays KPI totals and weekly trend chart for selected success metrics.
  *
  * @component
  * @param {Object} props
  * @param {Array<Object>} props.data - Filtered session data
  */
 const SuccessTracking = ({ data }) => {
   const [selectedMetrics, setSelectedMetrics] = useState([
     'linesOfCodeGenerated',
     'filesUpdated',
     'documentsGenerated',
     'prsCreated'
   ]);

   const totals = useMemo(() => getSuccessTotals(data), [data]);
   const { series, keys } = useMemo(
     () => getWeeklySuccessSeries(data, selectedMetrics, 8),
     [data, selectedMetrics]
   );

   const metricOrder = [
     'linesOfCodeGenerated',
     'filesUpdated',
     'documentsGenerated',
     'sessionsMerged',
     'prsCreated',
     'questionsAnswered',
     'repositoriesIngested',
     'projectsCreated',
     'nodesCreated'
   ];

   const palette = ['#3b82f6', '#06b6d4', '#64748b', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f43f5e'];

   const onToggleMetric = (key) => {
     setSelectedMetrics(prev => {
       if (prev.includes(key)) {
         const next = prev.filter(k => k !== key);
         return next.length > 0 ? next : prev;
       }
       if (prev.length >= 4) {
         const trimmed = prev.slice(1);
         return [...trimmed, key];
       }
       return [...prev, key];
     });
   };

   return (
     <div className="visualization-container">
       <div className="viz-header">
         <h2 className="viz-title">Success Tracking</h2>
         <p className="viz-subtitle">Generated artifacts and outcomes across sessions</p>
       </div>

       <div className="metrics-grid" role="region" aria-label="KPI metrics">
         {metricOrder.map((k) => {
           const meta = successMetricMeta[k];
           const value = totals[k] || 0;
           return (
             <div key={k} className="metric-card">
               <div className="metric-label">{meta.label}</div>
               <div className="metric-value" title={value.toLocaleString()}>
                 {value.toLocaleString()}
               </div>
               <button
                 className={`toggle-btn ${selectedMetrics.includes(k) ? 'active' : ''}`}
                 onClick={() => onToggleMetric(k)}
                 aria-pressed={selectedMetrics.includes(k)}
                 style={{ marginTop: 8 }}
               >
                 {selectedMetrics.includes(k) ? 'Shown in chart' : 'Show in chart'}
               </button>
               <div className="metric-detail">{meta.short}</div>
             </div>
           );
         })}
       </div>

       <ChartCard
         title="Weekly Success Trends (Last 8 Weeks)"
         subtitle="Toggle KPI cards to choose up to 4 series. Hover the chart for details."
       >
         {series && series.length > 0 ? (
           <div className="chart-responsive" data-testid="success-trend-chart">
             <ResponsiveContainer>
               <LineChart data={series} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                 <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
                 <XAxis dataKey="weekStart" tick={{ fill: '#64748b', fontSize: 12 }} />
                 <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                 <Tooltip
                   contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8 }}
                   labelStyle={{ color: '#111827', fontWeight: 600 }}
                 />
                 <Legend />
                 {keys.map((k, idx) => (
                   <Line
                     key={k}
                     type="monotone"
                     dataKey={k}
                     name={successMetricMeta[k]?.label || k}
                     stroke={palette[idx % palette.length]}
                     strokeWidth={2}
                     dot={false}
                     activeDot={{ r: 4 }}
                   />
                 ))}
               </LineChart>
             </ResponsiveContainer>
           </div>
         ) : (
           <div role="note" style={{ color: '#64748b' }}>No data available for weekly success trends.</div>
         )}
       </ChartCard>
     </div>
   );
 };

 export default SuccessTracking;
