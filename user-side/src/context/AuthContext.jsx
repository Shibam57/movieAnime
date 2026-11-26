import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api, { hasSession, setSession, clearSession } from '../services/api';
import { unwrap, errorMessage } from '../utils/contracts';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const authAttempt = useRef(0);
  const [loading, setLoading] = useState(hasSession);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const ended = () => { setUser(null); setLoading(false); setError(''); };
    window.addEventListener('movieanime:session-ended', ended);
    return () => window.removeEventListener('movieanime:session-ended', ended);
  }, []);
  useEffect(() => {
    if (!hasSession()) return;
    const controller = new AbortController();
    const attempt = authAttempt.current;
    api.get('/api/v1/users/profile', { signal: controller.signal }).then(unwrap).then(account => {
      if (!controller.signal.aborted && attempt === authAttempt.current && hasSession()) setUser(account);
    }).catch(err => {
      if (!controller.signal.aborted && attempt === authAttempt.current && hasSession()) setError(errorMessage(err));
    }).finally(() => { if (!controller.signal.aborted && attempt === authAttempt.current) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  const retry = useCallback(() => { if (!hasSession()) { setLoading(false); setError(''); return; } setLoading(true); setError(''); setRevision(v => v + 1); }, []);
  const login = useCallback(async (email, password) => {
    const attempt = authAttempt.current;
    const result = unwrap(await api.post('/api/v1/users/login', { email, password }, { skipAuth: true }));
    if (attempt !== authAttempt.current) throw new Error('Session changed');
    if (!result?.user?._id) throw new Error('Invalid login response');
    authAttempt.current++; setSession(result); setUser(result.user); setError(''); setLoading(false);
  }, []);
  const logout = useCallback(async () => {
    authAttempt.current++;
    try { if (hasSession()) await api.post('/api/v1/users/logout'); }
    finally { clearSession(); setUser(null); setError(''); setLoading(false); }
  }, []);
  return <AuthContext.Provider value={{ user, loading, error, retry, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
