import { createContext, useState, useContext } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('backstage_token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.log('login failed', err);
      return { success: false, error: err.response?.data?.error || 'login failed' };
    } finally {
      setLoading(false);
    }
  }

  async function signup(email, password, fullName) {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { email, password, fullName });
      localStorage.setItem('backstage_token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.log('signup failed', err);
      return { success: false, error: err.response?.data?.error || 'signup failed' };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('backstage_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
