import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../../services/api';
export default function AdminDropdown() { const [busy, setBusy] = useState(false); const navigate = useNavigate(); async function signOut() { if (busy)
    return; setBusy(true); try {
    await logout();
    toast.success('Signed out');
}
catch {
    toast.warn('Signed out locally; server logout could not be confirmed');
}
finally {
    navigate('/admin/login', { replace: true });
} } return <div className="space-y-3"><Link className="block text-indigo-700" to="/settings">My profile / settings</Link><button className="btn-secondary w-full" disabled={busy} onClick={signOut}>{busy ? 'Signing out…' : 'Sign out'}</button></div>; }
