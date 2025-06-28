import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() { 
  return useContext(AuthContext); 
}

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  useEffect(() => {
    const handler = () => {
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
      setToken(localStorage.getItem('token') || '');
      setUserId(localStorage.getItem('userId') || '');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = (token, userId) => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setLoggedIn(true);
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setToken('');
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, token, userId }}>
      {children}
    </AuthContext.Provider>
  );
} 