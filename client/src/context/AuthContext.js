import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import defaultUsers from '../data/users.json';

const USERS_STORAGE_KEY = 'pris.auth.users';
const CURRENT_USER_STORAGE_KEY = 'pris.auth.currentUser';

const AuthContext = createContext(null);

const toLowerTrimmed = (value) => value.trim().toLowerCase();

const sanitizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};

const hashPassword = async (password) => {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Secure password hashing is not supported in this browser.');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const loadUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse stored users, falling back to defaults.', error);
  }
  return defaultUsers;
};

const loadCurrentUserFromStorage = () => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.email && parsed.name) return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse stored current user, ignoring saved session.', error);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => loadUsersFromStorage());
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUserFromStorage());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const normalizedEmail = toLowerTrimmed(email);
      const passwordHash = await hashPassword(password);
      const matchedUser = users.find(
        (user) => toLowerTrimmed(user.email) === normalizedEmail && user.passwordHash === passwordHash
      );

      if (!matchedUser) {
        const error = new Error('Invalid email or password.');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
      }

      const safeUser = sanitizeUser(matchedUser);
      setCurrentUser(safeUser);
      return safeUser;
    } finally {
      setIsLoading(false);
    }
  }, [users]);

  const signup = useCallback(async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      const normalizedEmail = toLowerTrimmed(email);

      if (users.some((user) => toLowerTrimmed(user.email) === normalizedEmail)) {
        const error = new Error('An account with this email already exists.');
        error.code = 'EMAIL_IN_USE';
        throw error;
      }

      const passwordHash = await hashPassword(password);

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
      };

      setUsers((prev) => [...prev, newUser]);
      const safeUser = sanitizeUser(newUser);
      setCurrentUser(safeUser);
      return safeUser;
    } finally {
      setIsLoading(false);
    }
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isLoading,
      login,
      signup,
      logout
    }),
    [currentUser, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
