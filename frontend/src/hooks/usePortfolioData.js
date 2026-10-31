import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const emptyData = {
  profile: null,
  contact: null,
  projects: [],
  experiences: [],
  education: [],
};

export function usePortfolioData({ includeProjects = true } = {}) {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const requests = [
      api.get('/profile'),
      api.get('/contacts'),
      api.get('/experiences'),
      api.get('/education'),
    ];

    if (includeProjects) {
      requests.push(api.get('/projects?limit=50'));
    }

    Promise.all(requests)
      .then(([profile, contact, experiences, education, projects]) => {
        if (!active) return;
        setData({
          profile,
          contact,
          experiences: experiences ?? [],
          education: education ?? [],
          projects: projects?.items ?? [],
        });
        setLoading(false);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [includeProjects, tick]);

  return { data, loading, error, reload };
}
