import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { errorMessage } from '../utils/contracts';
export default function useAccess(id, type) {
    const { user, loading: authLoading } = useAuth();
    const { checkAccess, revision } = usePayment();
    const [version, setVersion] = useState(0);
    const reload = useCallback(() => setVersion(v => v + 1), []);
    const key = JSON.stringify([id, type, user?._id, revision, version]);
    const [state, setState] = useState({ key: null, allowed: false, error: '' });
    useEffect(() => {
        if (!id || !user?._id)
            return;
        let active = true;
        checkAccess(id, type).then(allowed => {
            if (active)
                setState({ key, allowed, error: '' });
        }).catch(err => {
            if (active)
                setState({ key, allowed: false, error: errorMessage(err) });
        });
        return () => {
            active = false;
        };
    }, [id, type, user?._id, checkAccess, key]);
    if (authLoading)
        return { loading: true, allowed: false, error: '', reload };
    if (!id || !user)
        return { loading: false, allowed: false, error: '', reload };
    return state.key === key ? { ...state, loading: false, reload } : { loading: true, allowed: false, error: '', reload };
}
