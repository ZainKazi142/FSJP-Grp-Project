import { useState } from 'react';
import { num } from '../api';

const PAGE_SIZE = 12;

export default function Schedule({ rows }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(rows.length / PAGE_SIZE);
  const slice = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const lo = Math.max(0, Math.min(page - 3, pages - 7)), hi = Math.min(pages, lo + 7);
  return (
    <div className="card">
      <h3 className="h3">Amortization schedule</h3>
      <div className="tw">
        <table>
          <thead><tr><th>#</th><th>Date</th><th>Opening</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Closing</th></tr></thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.installment}>
                <td>{r.installment}</td>
                <td>{new Date(r.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</td>
                <td>{num(r.openingBalance)}</td><td>{num(r.emi)}</td><td>{num(r.principalPaid)}</td>
                <td>{num(r.interestPaid)}</td><td>{num(r.closingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="pager no-print">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
          {Array.from({ length: hi - lo }, (_, i) => lo + i).map((i) => (
            <button key={i} className={i === page ? 'on' : ''} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button disabled={page === pages - 1} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
