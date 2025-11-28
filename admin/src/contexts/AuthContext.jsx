import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { connectAdminSocket } from '../services/socket';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) {
      authAPI.setToken(token);
      getProfile();
      // Connect to Socket.IO if already logged in
      connectAdminSocket();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setAdmin(response.data.admin);
    } catch (error) {
      console.error('Get profile error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, admin: adminData } = response.data;
      
      localStorage.setItem('adminToken', newToken);
      setToken(newToken);
      setAdmin(adminData);
      authAPI.setToken(newToken);
      
      // Connect to Socket.IO for real-time notifications
      connectAdminSocket();
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
    authAPI.setToken(null);
  };

  const updateProfile = async (updateData) => {
    try {
      const response = await authAPI.updateProfile(updateData);
      setAdmin(response.data.admin);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed'
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed'
      };
    }
  };

  const value = {
    admin,
    loading,
    token,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};