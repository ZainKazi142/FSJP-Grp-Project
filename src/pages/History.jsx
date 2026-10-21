import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorText, money } from '../api';
import { useApp } from '../AppContext.jsx';

export default function History() {
  const { meta } = useApp();
  const [f, setF] = useState({ type: '', from: '', to: '' });
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const q = new URLSearchParams({ page, size: 10 });
    Object.entries(f).forEach(([k, v]) => v && q.set(k, v));
    api('/calculations?' + q).then(setData).catch((e) => setError(errorText(e)));
  }, [f, page]);
  useEffect(load, [load]);

  async function remove(id) {
    if (!window.confirm('Delete this calculation?')) return;
    try { await api('/calculations/' + id, { method: 'DELETE' }); load(); } catch (e) { setError(errorText(e)); }
  }
  const open = (c) => `/calculator?type=${c.loanType}&amount=${c.principalAmount}&rate=${c.annualInterestRate}&tenure=${c.tenureMonths}&unit=MONTHS&name=${encodeURIComponent(c.loanName)}`;
  const change = (k, v) => { setPage(0); setF({ ...f, [k]: v }); };

  return (
    <>
      <h1 className="h1">Calculation history</h1>
      <div className="card row wrap">
        <div><label>Loan type</label>
          <select value={f.type} onChange={(e) => change('type', e.target.value)}>
            <option value="">All</option>{meta?.loanTypes.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
          </select></div>
        <div><label>From</label><input type="date" value={f.from} onChange={(e) => change('from', e.target.value)} /></div>
        <div><label>To</label><input type="date" value={f.to} onChange={(e) => change('to', e.target.value)} /></div>
        <button className="btn small outline" onClick={() => { setPage(0); setF({ type: '', from: '', to: '' }); }}>Reset</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="card" style={{ marginTop: 14 }}>
        {!data ? <p className="muted">Loading...</p> : data.content.length === 0 ? (
          <p className="empty">No calculations found. <Link to="/calculator">Run a calculation</Link> and save it.</p>
        ) : (
          <div className="tw">
            <table>
              <thead><tr><th>Name</th><th>Type</th><th>Amount</th><th>Rate</th><th>Tenure</th><th>EMI</th><th>Saved</th><th></th></tr></thead>
              <tbody>{data.content.map((c) => (
                <tr key={c.id}>
                  <td>{c.loanName}</td><td>{c.loanType}</td><td>{money(c.principalAmount)}</td><td>{c.annualInterestRate}%</td>
                  <td>{c.tenureMonths} mo</td><td>{money(c.monthlyEmi)}</td><td>{new Date(c.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="nowrap">
                    <Link className="btn small outline" to={open(c)}>Open / duplicate</Link>{' '}
                    <button className="btn small danger" onClick={() => remove(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {data && data.totalPages > 1 && (
          <div className="pager">
            {Array.from({ length: data.totalPages }, (_, i) => (
              <button key={i} className={i === page ? 'on' : ''} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
