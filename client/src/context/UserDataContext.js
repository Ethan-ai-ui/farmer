import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_PREFIX = 'pris.userData';

const DEFAULT_DATA = {
  questionsHistory: [],
  savedTips: [],
  tasks: [
    { id: 'task-1', label: 'Check soil moisture levels', completed: false },
    { id: 'task-2', label: 'Review irrigation schedule', completed: false },
    { id: 'task-3', label: 'Inspect tomato crop for pests', completed: false }
  ],
  reminders: [
    { id: 'reminder-1', message: 'Review weather forecast for the week ahead.' },
    { id: 'reminder-2', message: 'Follow up on fertilizer delivery status.' }
  ]
};

const cloneDefault = () => ({
  questionsHistory: [],
  savedTips: [],
  tasks: DEFAULT_DATA.tasks.map((task) => ({ ...task })),
  reminders: DEFAULT_DATA.reminders.map((reminder) => ({ ...reminder }))
});

const ensureDefaults = (storedValue) => {
  if (!storedValue) {
    return cloneDefault();
  }

  return {
    questionsHistory: Array.isArray(storedValue.questionsHistory)
      ? storedValue.questionsHistory
      : [],
    savedTips: Array.isArray(storedValue.savedTips) ? storedValue.savedTips : [],
    tasks: Array.isArray(storedValue.tasks) && storedValue.tasks.length
      ? storedValue.tasks
      : DEFAULT_DATA.tasks.map((task) => ({ ...task })),
    reminders: Array.isArray(storedValue.reminders) && storedValue.reminders.length
      ? storedValue.reminders
      : DEFAULT_DATA.reminders.map((reminder) => ({ ...reminder }))
  };
};

const UserDataContext = createContext(null);

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;

export const UserDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [data, setData] = useState(cloneDefault);

  useEffect(() => {
    if (!currentUser) {
      setData(cloneDefault());
      return;
    }

    const storageKey = `${STORAGE_PREFIX}.${currentUser.id}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(ensureDefaults(parsed));
        return;
      }
    } catch (error) {
      console.warn('Failed to parse stored user data, resetting to defaults.', error);
    }
    setData(cloneDefault());
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const storageKey = `${STORAGE_PREFIX}.${currentUser.id}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, currentUser]);

  const recordQuestion = useCallback((prompt, answer) => {
    if (!prompt && !answer) {
      return;
    }
    setData((prev) => {
      const entry = {
        id: generateId('question'),
        prompt,
        answer,
        createdAt: new Date().toISOString()
      };
      return {
        ...prev,
        questionsHistory: [entry, ...prev.questionsHistory].slice(0, 50)
      };
    });
  }, []);

  const clearQuestions = useCallback(() => {
    setData((prev) => ({
      ...prev,
      questionsHistory: []
    }));
  }, []);

  const saveTip = useCallback((title, content) => {
    if (!title && !content) {
      return;
    }
    setData((prev) => {
      const tip = {
        id: generateId('tip'),
        title: title?.trim() || 'Saved answer',
        content,
        createdAt: new Date().toISOString()
      };
      return {
        ...prev,
        savedTips: [tip, ...prev.savedTips].slice(0, 50)
      };
    });
  }, []);

  const removeTip = useCallback((tipId) => {
    setData((prev) => ({
      ...prev,
      savedTips: prev.savedTips.filter((tip) => tip.id !== tipId)
    }));
  }, []);

  const toggleTask = useCallback((taskId) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  }, []);

  const addReminder = useCallback((message) => {
    if (!message?.trim()) {
      return;
    }
    setData((prev) => ({
      ...prev,
      reminders: [
        { id: generateId('reminder'), message: message.trim(), createdAt: new Date().toISOString() },
        ...prev.reminders
      ].slice(0, 20)
    }));
  }, []);

  const removeReminder = useCallback((reminderId) => {
    setData((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((reminder) => reminder.id !== reminderId)
    }));
  }, []);

  const value = useMemo(
    () => ({
      data,
      recordQuestion,
      clearQuestions,
      saveTip,
      removeTip,
      toggleTask,
      addReminder,
      removeReminder
    }),
    [data, recordQuestion, clearQuestions, saveTip, removeTip, toggleTask, addReminder, removeReminder]
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};


