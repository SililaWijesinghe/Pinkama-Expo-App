import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_GIVER_USER, MOCK_RECEIVER_USER } from '../constants/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAs: (role: 'giver' | 'receiver', name?: string, email?: string) => void;
  switchRole: (newRole: 'giver' | 'receiver') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to giver for initial ready-to-test experience, or guest
  const [role, setRole] = useState<UserRole>('giver');
  const [user, setUser] = useState<UserProfile | null>(MOCK_GIVER_USER);

  const loginAs = (selectedRole: 'giver' | 'receiver', name?: string, email?: string) => {
    setRole(selectedRole);
    if (selectedRole === 'giver') {
      setUser({
        ...MOCK_GIVER_USER,
        name: name || MOCK_GIVER_USER.name,
        email: email || MOCK_GIVER_USER.email,
        role: 'giver',
      });
    } else {
      setUser({
        ...MOCK_RECEIVER_USER,
        name: name || MOCK_RECEIVER_USER.name,
        email: email || MOCK_RECEIVER_USER.email,
        role: 'receiver',
      });
    }
  };

  const switchRole = (newRole: 'giver' | 'receiver') => {
    loginAs(newRole);
  };

  const logout = () => {
    setRole('guest');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user && role !== 'guest',
        loginAs,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

