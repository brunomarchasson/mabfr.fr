'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define the shape of the context
interface I18nContextType {
  locale: string;
  messages: Record<string, any>;
  changeLocale: (newLocale: string) => void;
  t: (key: string) => string;
}

// 2. Create the context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// 3. Create the Provider component
interface I18nProviderProps {
  children: ReactNode;
  initialLocale: string;
  messages: Record<string, any>;
}

import { createT } from './utils';

export function I18nProvider({ children, initialLocale, messages }: I18nProviderProps) {
  const [locale, setLocale] = useState(initialLocale);
  // const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);

  const changeLocale = async (newLocale: string) => {
  };

  const t = createT(messages);

  const value = { locale, messages, changeLocale, t };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// 4. Create the custom hook
export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}