import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';

const PALETTES = [['indigo', '#4f46e5'], ['emerald', '#059669'], ['sunset', '#ea580c'], ['midnight', '#0b1220']];

export default function Navbar() {
  const { user, logout, palette, setPalette } = useApp();
  const nav = useNavigate();
  return (
    <nav className="nav">
      <div className="container nav-in">
        <Link to="/calculator" className="brand">Smart EMI</Link>
        <NavLink to="/calculator">Calculator</NavLink>
        <NavLink to="/compare">Compare</NavLink>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user && <NavLink to="/history">History</NavLink>}
        <span className="spacer" />
        <span className="sw" aria-label="Colour theme">
          {PALETTES.map(([p, c]) => (
            <button key={p} type="button" title={p} className={p === palette ? 'cur' : ''} style={{ background: c }} onClick={() => setPalette(p)} />
          ))}
        </span>
        {user ? (
          <button className="btn small light" onClick={async () => { await logout(); nav('/login'); }}>Logout</button>
        ) : (
          <>
            <Link className="btn small ghost" to="/login">Login</Link>
            <Link className="btn small light" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
