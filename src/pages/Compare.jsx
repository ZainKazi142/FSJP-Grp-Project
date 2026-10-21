import { useState } from 'react';
import { api, errorText, money } from '../api';
import { useApp } from '../AppContext.jsx';

const blank = (amount, rate, tenure) => ({ type: 'HOME', amount, rate, tenure, unit: 'YEARS' });

export default function Compare() {
  const { meta, } = useApp();
  const [loans, setLoans] = useState([blank('1000000', '8.5', '10'), blank('1000000', '8.5', '20'), blank('1000000', '9', '15')]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const set = (i, k, v) => setLoans(loans.map((l, j) => (j === i ? { ...l, [k]: v } : l)));

  async function submit(e) {
    e.preventDefault(); setError('');
    try {
      const body = { loans: loans.map((l) => ({ loanAmount: Number(l.amount), annualRate: Number(l.rate), tenure: Number(l.tenure), tenureUnit: l.unit, loanType: l.type })) };
      setResult(await api('/emi/compare', { method: 'POST', body }));
    } catch (err) { setResult(null); setError(errorText(err)); }
  }

  const cell = (i, hi, label, v) => (
    <td className={i === hi ? 'best' : ''}>{money(v)}{i === hi && <span className="badge">{label}</span>}</td>
  );

  return (
    <>
      <h1 className="h1">Compare loan offers</h1>
      <form onSubmit={submit}>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="grid g3">
          {loans.map((l, i) => (
            <div className="card" key={i}>
              <h3 className="h3">Option {i + 1}</h3>
              <label>Category</label>
              <select value={l.type} onChange={(e) => set(i, 'type', e.target.value)}>
                {meta?.loanTypes.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
              </select>
              <label>Loan amount (INR)</label>
              <input type="number" min="1000" step="1000" required value={l.amount} onChange={(e) => set(i, 'amount', e.target.value)} />
              <label>Annual rate (%)</label>
              <input type="number" min="0" max="100" step="0.05" required value={l.rate} onChange={(e) => set(i, 'rate', e.target.value)} />
              <div className="row">
                <div><label>Tenure</label><input type="number" min="1" required value={l.tenure} onChange={(e) => set(i, 'tenure', e.target.value)} /></div>
                <div><label>Unit</label>
                  <select value={l.unit} onChange={(e) => set(i, 'unit', e.target.value)}><option value="YEARS">Years</option><option value="MONTHS">Months</option></select></div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn" type="submit" style={{ marginTop: 14 }}>Compare</button>
      </form>

      {result && (
        <div className="card" style={{ marginTop: 18 }}>
          <div className="tw">
            <table className="compare">
              <thead><tr><th></th>{result.loans.map((_, i) => <th key={i}>Option {i + 1}</th>)}</tr></thead>
              <tbody>
                <tr><th>Loan amount</th>{result.loans.map((l, i) => <td key={i}>{money(l.loanAmount)}</td>)}</tr>
                <tr><th>Interest rate</th>{result.loans.map((l, i) => <td key={i}>{l.annualRate}%</td>)}</tr>
                <tr><th>Tenure</th>{result.loans.map((l, i) => <td key={i}>{l.tenureMonths} months</td>)}</tr>
                <tr><th>Monthly EMI</th>{result.loans.map((l, i) => cell(i, result.lowestEmiIndex, 'Lowest EMI', l.monthlyEmi))}</tr>
                <tr><th>Total interest</th>{result.loans.map((l, i) => cell(i, result.lowestInterestIndex, 'Lowest interest', l.totalInterest))}</tr>
                <tr><th>Total repayment</th>{result.loans.map((l, i) => <td key={i}>{money(l.totalPayment)}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <p><b>Effect of tenure:</b> {result.tenureInsight}</p>
          <p className="small muted">{meta?.disclaimer}</p>
        </div>
      )}
    </>
  );
}
