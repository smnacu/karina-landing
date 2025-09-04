"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as authService from '../lib/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const currentUser = await authService.fetchCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        authService.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (data) => {
    await authService.login(data.email, data.password);
    const currentUser = await authService.fetchCurrentUser();
    setUser(currentUser);
  };

  const register = async (data) => {
    await authService.register(data.email, data.password, data.fullName, data.phoneNumber);
    const currentUser = await authService.fetchCurrentUser();
    setUser(currentUser);
};

  const logout = () => {
    authService.removeToken();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
