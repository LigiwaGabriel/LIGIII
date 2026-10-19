import { useEffect, useState } from 'react';

// Runs an async loader whenever `deps` change and exposes loading / error / data.
// Uses AbortController so stale requests never overwrite newer results.
export default function useFetch(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    loader(controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ data: null, loading: false, error: err.message || 'Something went wrong.' });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
