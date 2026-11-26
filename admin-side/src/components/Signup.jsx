import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSession, registerAdmin } from '../services/api';
import { message } from '../utils/contracts';
export default function Signup() { const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const navigate = useNavigate(); const signedIn = Boolean(getSession()); async function submit(e) { e.preventDefault(); if (busy)
    return; const f = new FormData(e.currentTarget); const password = String(f.get('password')); if (new TextEncoder().encode(password).length > 72) {
    setError('Password must not exceed 72 bytes');
    return;
} setBusy(true); setError(''); try {
    await registerAdmin({ name: String(f.get('name')).trim(), email: String(f.get('email')).trim(), password }, f.get('key'));
    toast.success('Admin account created');
    navigate(signedIn ? '/settings' : '/admin/login', { replace: true });
}
catch (err) {
    setError(message(err));
}
finally {
    setBusy(false);
} } return <div className="auth-shell"><form className="panel w-full max-w-md space-y-4" onSubmit={submit}><h1 className="text-xl font-bold">Register an administrator</h1><p className="text-sm text-slate-600">Only an authenticated admin or someone with the private server registration key can create an account.</p><label>Name<input name="name" required autoComplete="name"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label><label>Password<input name="password" type="password" minLength={8} required autoComplete="new-password"/></label>{!signedIn && <label>Private registration key<input name="key" type="password" autoComplete="off" required/></label>}{error && <p role="alert" className="text-red-700">{error}</p>}<button className="btn w-full" disabled={busy}>{busy ? 'Creating…' : 'Create admin'}</button><Link to={signedIn ? '/settings' : '/admin/login'} className="text-indigo-700 underline">Back</Link></form></div>; }
