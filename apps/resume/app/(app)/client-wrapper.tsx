'use client';

import { I18nProvider } from '@/i18n/provider';
import { ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
  lang: string;
  messages: Record<string, string>;
}

export default function ClientWrapper({ children, lang, messages }: ClientWrapperProps) {
  return (
    <I18nProvider initialLocale={lang} messages={messages}>
      {children}
    </I18nProvider>
  );
}
