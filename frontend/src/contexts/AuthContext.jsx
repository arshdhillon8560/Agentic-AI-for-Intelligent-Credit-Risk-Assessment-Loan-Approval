import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);

      setUser(decoded);
    }
    setLoading(false);
  }, [token]);


  const login = async (credentials) => {
    const data = await authAPI.login(credentials);

    localStorage.setItem('token', data.token);
    setToken(data.token);

    const decoded = decodeToken(data.token);
    setUser(decoded);

    return data;
  };


  const signup = async (userData) => {
    const data = await authAPI.signup(userData);

    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);

      const decoded = decodeToken(data.token);
      setUser(decoded);
    }

    return data;
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('appId');

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};