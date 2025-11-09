"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  phone: string;
  name: string;
  gender?: string;
  age?: number;
  occupation?: string;
  profilePhoto?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('pguser');
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('pguser');
      }
    }
    setIsLoading(false);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('pguser', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('pguser');
    }
  };

  const logout = () => {
    setUser(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
