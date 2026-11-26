import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage, safeReturnPath } from '../utils/contracts';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const submit = async (e) => {
        e.preventDefault();
        if (busy)
            return;
        setBusy(true);
        setError('');
        try {
            await login(email.trim(), password);
            navigate(safeReturnPath(location.state?.from), { replace: true });
        }
        catch (err) {
            setError(errorMessage(err));
        }
        finally {
            setBusy(false);
        }
    };
    return <div className="auth-shell"><form onSubmit={submit} className="auth-card">
    <h1 className="text-3xl font-bold">Login</h1>
    {location.state?.registered && <p role="status" className="text-green-300">Account created. Please log in.</p>}
    {error && <p role="alert" className="text-red-300">{error}</p>}
    
    <label>Email<input className="field" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}/></label>
    <label>Password<input className="field" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}/></label>
    <button className="btn w-full" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
    <p className="text-sm text-gray-400">New here? <Link className="text-indigo-300" to="/signup" state={{ from: location.state?.from }}>Create an account</Link></p>
    </form></div>;
}
