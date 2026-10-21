import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { errorText } from '../api';
import { useApp } from '../AppContext.jsx';

export default function Login() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError('');
    try { await login(email, password); nav('/dashboard'); } catch (err) { setError(errorText(err)); }
  }
  return (
    <form className="card narrow" onSubmit={submit}>
      <h1 className="h2" style={{ marginTop: 0 }}>Log in</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <label htmlFor="e">Email</label><input id="e" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="p">Password</label><input id="p" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn" type="submit" style={{ width: '100%', marginTop: 12 }}>Log in</button>
      <p className="small">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
