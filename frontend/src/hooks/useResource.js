import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Small data-fetching helper for admin pages.
 * The loader is stored in a ref so callers can pass inline functions without
 * causing an infinite refetch loop. `deps` decide when to refetch (e.g. an id).
 */
export function useResource(loader, deps = []) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));

    Promise.resolve()
      .then(() => loaderRef.current())
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error });
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey, tick]);

  const reload = useCallback(() => setTick((value) => value + 1), []);

  return { ...state, reload, setData: (data) => setState((s) => ({ ...s, data })) };
}
