import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted user
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Error al registrarse';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    if (user) {
      try {
        const response = await authService.updateProfile(profileData);
        setUser(response.user);
        return { success: true, user: response.user };
      } catch (error) {
        const errorMessage = error.message || 'Error al actualizar perfil';
        return { success: false, error: errorMessage };
      }
    }
    return { success: false, error: 'No hay usuario autenticado' };
  };

  const deleteAccount = () => {
    if (user) {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem(`curriculum_${user.id}`);
      return { success: true };
    }
    return { success: false, error: 'No hay usuario autenticado' };
  };

  const isCandidate = () => user?.role === 'CANDIDATE';
  const isCompanyEmployees = () => user?.role === 'COMPANY_EMPLOYEES';
  const isCompanyStudents = () => user?.role === 'COMPANY_STUDENTS';
  const isCompanyHybrid = () => user?.role === 'COMPANY_HYBRID';
  const isAdmin = () => user?.role === 'ADMIN';
  const isAnyCompany = () => isCompanyEmployees() || isCompanyStudents() || isCompanyHybrid();

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    isCandidate,
    isCompanyEmployees,
    isCompanyStudents,
    isCompanyHybrid,
    isAdmin,
    isAnyCompany,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
