import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { ROLES } from '../config/enums';

const AuthContext = createContext(null);

const seedProfile = (user) => {
  if (!user) return;
  const existing = localStorage.getItem(`profile_${user.id}`);
  if (existing) return;
  const initial = {};
  if (user.role === 'CANDIDATE') {
    const parts = (user.name || '').split(' ');
    initial.firstName = parts[0] || user.name || '';
    initial.lastName = parts.slice(1).join(' ') || '';
  } else {
    initial.companyName = user.name || '';
  }
  initial.email = user.email || '';
  localStorage.setItem(`profile_${user.id}`, JSON.stringify(initial));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSetUser = (user) => {
    setUser(user);
    seedProfile(user);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      handleSetUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      handleSetUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      handleSetUser(response.user);
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
        handleSetUser(response.user);
        return { success: true, user: response.user };
      } catch (error) {
        const errorMessage = error.message || 'Error al actualizar perfil';
        return { success: false, error: errorMessage };
      }
    }
    return { success: false, error: 'No hay usuario autenticado' };
  };

  const deleteAccount = async () => {
    if (user) {
      try {
        await authService.deleteAccount();
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem(`curriculum_${user.id}`);
        localStorage.removeItem(`profile_${user.id}`);
        return { success: true };
      } catch (error) {
        const errorMessage = error.message || 'Error al eliminar cuenta';
        return { success: false, error: errorMessage };
      }
    }
    return { success: false, error: 'No hay usuario autenticado' };
  };

  const isCandidate = () => user?.role === ROLES.CANDIDATE;
  const isCompanyEmployees = () => user?.role === ROLES.COMPANY_EMPLOYEES;
  const isCompanyStudents = () => user?.role === ROLES.COMPANY_STUDENTS;
  const isCompanyHybrid = () => user?.role === ROLES.COMPANY_HYBRID;
  const isAdmin = () => user?.role === ROLES.ADMIN;
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
