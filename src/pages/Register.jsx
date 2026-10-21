import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { errorText } from '../api';
import { useApp } from '../AppContext.jsx';

export default function Register() {
  const { register, login } = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setError('');
    try { await register(form); await login(form.email, form.password); nav('/dashboard'); } catch (err) { setError(errorText(err)); }
  }
  return (
    <form className="card narrow" onSubmit={submit}>
      <h1 className="h2" style={{ marginTop: 0 }}>Create account</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <label htmlFor="n">Full name</label><input id="n" required value={form.fullName} onChange={set('fullName')} />
      <label htmlFor="e">Email</label><input id="e" type="email" required value={form.email} onChange={set('email')} />
      <label htmlFor="p">Password</label><input id="p" type="password" required value={form.password} onChange={set('password')} />
      <p className="small muted">At least 8 characters, with a letter and a digit.</p>
      <button className="btn" type="submit" style={{ width: '100%' }}>Register</button>
      <p className="small">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
