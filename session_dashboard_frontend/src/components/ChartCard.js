import React from 'react';
import '../styles/Visualizations.css';

// PUBLIC_INTERFACE
/**
 * ChartCard
 * A styled wrapper card for charts using the Ocean Professional theme.
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {React.ReactNode} props.children - Chart element
 */
const ChartCard = ({ title, subtitle, children }) => {
  return (
    <section className="chart-card" aria-label={title}>
      <header className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
        {subtitle ? <p className="chart-card-subtitle">{subtitle}</p> : null}
      </header>
      <div className="chart-card-body">
        {children}
      </div>
    </section>
  );
};

export default ChartCard;
