import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { errorMessage } from '../utils/contracts';
const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
export default function SignUp() {
    const [form, setForm] = useState({ username: '', fullname: '', email: '', password: '' });
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const submit = async (e) => {
        e.preventDefault();
        if (busy)
            return;
        setError('');
        if (!form.username.trim() || !form.fullname.trim() || !form.email.trim())
            return setError('Enter all required fields.');
        if (form.password.length < 6 || new TextEncoder().encode(form.password).length > 72)
            return setError('Password must be at least 6 characters and at most 72 bytes.');
        if (!avatar || !imageTypes.includes(avatar.type) || avatar.size > 10 * 1024 * 1024)
            return setError('Choose a JPEG, PNG, WebP, GIF or AVIF avatar up to 10 MB.');
        const body = new FormData();
        Object.entries(form).forEach(([key, value]) => body.append(key, key === 'password' ? value : value.trim()));
        body.append('avatar', avatar);
        setBusy(true);
        try {
            await api.post('/api/v1/users/register', body, { skipAuth: true, timeout: 60000 });
            navigate('/login', { replace: true, state: { registered: true, from: location.state?.from } });
        }
        catch (err) {
            setError(errorMessage(err));
        }
        finally {
            setBusy(false);
        }
    };
    return <div className="auth-shell"><form onSubmit={submit} className="auth-card">
    <h1 className="text-3xl font-bold">Create account</h1>
    {error && <p role="alert" className="text-red-300">{error}</p>}
    
        {[['fullname', 'Full name', 'text', 'name'], ['username', 'Username', 'text', 'username'], ['email', 'Email', 'email', 'email'], ['password', 'Password', 'password', 'new-password']].map(([key, label, type, auto]) => <label key={key}>
        {label}
        <input className="field" type={type} autoComplete={auto} required minLength={key === 'password' ? 6 : undefined} value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}/>
        </label>)}
    
    <label>Avatar (up to 10 MB)<input className="field" type="file" required accept={imageTypes.join(',')} onChange={e => setAvatar(e.target.files?.[0] || null)}/></label>
    <button className="btn w-full" disabled={busy}>{busy ? 'Creating account…' : 'Sign up'}</button>
    <p className="text-sm text-gray-400">Already registered? <Link to="/login" state={{ from: location.state?.from }} className="text-indigo-300">Login</Link></p>
    </form></div>;
}
