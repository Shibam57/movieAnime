import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { message } from '../utils/contracts';
export default function useResource(path, query = '') {
    const [revision, setRevision] = useState(0);
    const key = `${path}?${query}#${revision}`;
    const [state, setState] = useState({ key: null, data: null, loading: true, error: '' });
    const reload = useCallback(() => setRevision(v => v + 1), []);
    useEffect(() => { if (!path)
        return; const controller = new AbortController(); let active = true; setState({ key, data: null, loading: true, error: '' }); api.get(path + (query ? `?${query}` : ''), { signal: controller.signal }).then(res => { if (active)
        setState({ key, data: res.data.data, loading: false, error: '' }); }).catch(err => { if (active && !controller.signal.aborted)
        setState({ key, data: null, loading: false, error: message(err) }); }); return () => { active = false; controller.abort(); }; }, [path, query, key]);
    return state.key === key ? { ...state, reload } : { data: null, loading: true, error: '', reload };
}
