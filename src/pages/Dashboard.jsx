import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../api';
import DoughnutChart from '../components/DoughnutChart.jsx';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/dashboard').then(setData).catch((e) => setError(e.message)); }, []);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Loading...</p>;
  const open = (c) => `/calculator?type=${c.loanType}&amount=${c.principalAmount}&rate=${c.annualInterestRate}&tenure=${c.tenureMonths}&unit=MONTHS&name=${encodeURIComponent(c.loanName)}`;
  return (
    <>
      <h1 className="h1">Dashboard</h1>
      <div className="grid g3">
        <div className="card"><div className="lbl">Saved calculations</div><div className="val">{data.count}</div></div>
        <div className="card"><div className="lbl">Total principal</div><div className="val">{money(data.totalPrincipal)}</div></div>
        <div className="card"><div className="lbl">Total interest</div><div className="val">{money(data.totalInterest)}</div></div>
      </div>
      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="lbl">Principal vs interest (all saved loans)</div>
          {data.count > 0 ? <DoughnutChart principal={data.totalPrincipal} interest={data.totalInterest} /> : <p className="empty">Nothing to chart yet.</p>}
        </div>
        <div className="card">
          <div className="lbl">Recent calculations</div>
          {data.recent.length === 0 ? <p className="empty">No saved calculations yet. <Link to="/calculator">Create one</Link>.</p> : (
            <table>
              <thead><tr><th>Name</th><th>Type</th><th>EMI</th><th></th></tr></thead>
              <tbody>{data.recent.map((c) => (
                <tr key={c.id}><td>{c.loanName}</td><td>{c.loanType}</td><td>{money(c.monthlyEmi)}</td>
                  <td><Link className="btn small outline" to={open(c)}>Open</Link></td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
