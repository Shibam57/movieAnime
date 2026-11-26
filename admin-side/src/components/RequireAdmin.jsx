import { useEffect, useState, useSyncExternalStore } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import api, { getSession, subscribeSession, clearSession } from '../services/api';
import { paths, message } from '../utils/contracts';
export default function RequireAdmin() {
    const session = useSyncExternalStore(subscribeSession, getSession);
    const location = useLocation();
    const [state, setState] = useState({ id: null, status: 'loading', error: '' });
    const [attempt, setAttempt] = useState(0);
    const id = session?.admin?._id;
    useEffect(() => { if (!id)
        return; let active = true; const controller = new AbortController(); api.get(paths.profile, { signal: controller.signal }).then(({ data }) => { if (active)
        setState({ id, status: data.data?._id === id ? 'ready' : 'invalid', error: '' }); }).catch(err => { if (!active)
        return; if ([401, 403].includes(err.response?.status)) {
        clearSession();
        return;
    } setState({ id, status: 'error', error: message(err) }); }); return () => { active = false; controller.abort(); }; }, [id, attempt]);
    if (!session || !id || state.status === 'invalid' && state.id === id)
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }}/>;
    if (state.id !== id || state.status === 'loading')
        return <main className="p-8" role="status">Verifying admin session…</main>;
    if (state.status === 'error')
        return <main className="p-8"><p role="alert">{state.error}</p><button className="btn mt-4" onClick={() => { setState({ id, status: 'loading', error: '' }); setAttempt(v => v + 1); }}>Retry</button> <button className="btn-secondary" onClick={clearSession}>Sign out locally</button></main>;
    return <Outlet />;
}
