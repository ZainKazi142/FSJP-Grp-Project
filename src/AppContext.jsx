import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [meta, setMeta] = useState(null);
  const [ready, setReady] = useState(false);
  const [palette, setPaletteState] = useState(document.documentElement.getAttribute('data-palette') || 'indigo');

  useEffect(() => {
    (async () => {
      try { setMeta(await api('/meta')); } catch { /* API not reachable */ }
      try { setUser(await api('/auth/me')); } catch { setUser(null); }
      setReady(true);
    })();
  }, []);

  const setPalette = (p) => {
    document.documentElement.setAttribute('data-palette', p);
    try { localStorage.setItem('emi-palette', p); } catch { /* storage unavailable */ }
    setPaletteState(p);
  };
  const login = async (email, password) => setUser(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = (form) => api('/auth/register', { method: 'POST', body: form });
  const logout = async () => { await api('/auth/logout', { method: 'POST' }); setUser(null); };

  return <Ctx.Provider value={{ user, meta, ready, palette, setPalette, login, register, logout }}>{children}</Ctx.Provider>;
}
