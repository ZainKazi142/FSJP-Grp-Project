import { useEffect, useRef } from 'react';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { useApp } from '../AppContext.jsx';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/** Principal vs interest doughnut; redraws when values or the colour theme change. */
export default function DoughnutChart({ principal, interest }) {
  const ref = useRef(null);
  const { palette } = useApp();
  useEffect(() => {
    const chart = new Chart(ref.current, {
      type: 'doughnut',
      data: { labels: ['Principal', 'Interest'], datasets: [{ data: [principal, interest], backgroundColor: [css('--accent'), css('--amber')], borderWidth: 0 }] },
      options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: css('--text') } } } }
    });
    return () => chart.destroy();
  }, [principal, interest, palette]);
  return <div className="chartbox"><canvas ref={ref} /></div>;
}
