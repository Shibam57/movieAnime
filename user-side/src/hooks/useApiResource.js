import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { unwrap, errorMessage } from '../utils/contracts';
export default function useApiResource(path, scope = '') {
  const [version, setVersion] = useState(0);
  const key = JSON.stringify([path, scope, version]);
  const [state, setState] = useState({ key: null, data: null, error: '' });
  const reload = useCallback(() => setVersion(v => v + 1), []);
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    api.get(path, { signal: controller.signal }).then(unwrap).then(data => {
      if (!controller.signal.aborted) setState({ key, data, error: '' });
    }).catch(error => {
      if (!controller.signal.aborted) {
        if (path.startsWith('/api/v1/series/genre/') && error.response?.status === 404 && error.response?.data?.message === 'No series found for this genre') setState({ key, data: [], error: '' });
        else setState({ key, data: null, error: errorMessage(error) });
      }
    });
    return () => controller.abort();
  }, [path, key]);
  if (!path) return { data: null, loading: false, error: '', reload };
  return state.key === key ? { ...state, loading: false, reload } : { data: null, loading: true, error: '', reload };
}
