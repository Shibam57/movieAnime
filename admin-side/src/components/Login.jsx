import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import { message } from '../utils/contracts';
export default function Login() { const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const navigate = useNavigate(); const location = useLocation(); async function submit(e) { e.preventDefault(); if (busy)
    return; setBusy(true); setError(''); const form = new FormData(e.currentTarget); try {
    await login({ email: String(form.get('email')).trim(), password: form.get('password') });
    toast.success('Welcome back');
    const from = location.state?.from;
    navigate(typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/', { replace: true });
}
catch (err) {
    setError(message(err));
}
finally {
    setBusy(false);
} } return <div className="auth-shell"><form className="panel w-full max-w-md space-y-5" onSubmit={submit}><h1 className="text-2xl font-bold text-indigo-800">MovieAnime · Admin login</h1><label>Email<input name="email" type="email" autoComplete="username" required/></label><label>Password<input name="password" type="password" autoComplete="current-password" required/></label>{error && <p role="alert" className="text-red-700">{error}</p>}<button className="btn w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button><Link className="text-indigo-700 underline" to="/signup">Authorized admin registration</Link></form></div>; }
