
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { api } from './api.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(
    !!localStorage.getItem('cc_token')
  );

  useEffect(() => {
    if (!localStorage.getItem('cc_token')) return;

    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('cc_token'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = useCallback(async (path, body) => {
    const d = await api(path, {
      method: 'POST',
      body,
    });

    localStorage.setItem('cc_token', d.token);
    setUser(d.user);

    return d.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cc_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: (b) => authenticate('/auth/login', b),
        register: (b) => authenticate('/auth/register', b),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
