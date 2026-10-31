import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, setCsrfToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const sessionRequest = useRef(null);

  // Only ask the server for the session when the visitor enters the admin
  // area. The request is cached so React StrictMode's double effect does not
  // discard the first response and leave the user logged out.
  useEffect(() => {
    const isAdminArea = location.pathname.startsWith('/admin');

    if (!isAdminArea) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);

    if (!sessionRequest.current) {
      sessionRequest.current = api
        .get('/auth/me')
        .then((data) => {
          setCsrfToken(data.csrfToken);
          return data.user;
        })
        .catch(() => null);
    }

    sessionRequest.current.then((sessionUser) => {
      if (!active) return;
      setUser(sessionUser);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleExpired = () => {
      setCsrfToken(null);
      setUser(null);
      sessionRequest.current = Promise.resolve(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await api.post('/auth/login', { identifier, password });
    setCsrfToken(data.csrfToken);
    setUser(data.user);
    sessionRequest.current = Promise.resolve(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // The local session is cleared even if the server session already expired.
    } finally {
      setCsrfToken(null);
      setUser(null);
      sessionRequest.current = Promise.resolve(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, isAuthenticated: Boolean(user) }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
