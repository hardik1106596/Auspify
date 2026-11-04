import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearToken, getToken, setToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    let active = true;
    api('/auth/me')
      .then(({ user: currentUser }) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) {
          clearToken();
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function authenticate(path, credentials) {
    const data = await api(path, { method: 'POST', body: credentials, token: null });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    loading,
    login: (credentials) => authenticate('/auth/login', credentials),
    register: (details) => authenticate('/auth/register', details),
    logout,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
