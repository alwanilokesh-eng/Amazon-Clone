import { createContext, useContext, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/users', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/users/profile', payload);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
