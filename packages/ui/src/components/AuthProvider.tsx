'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient, AuthClientConfig } from '@mabru/auth-client';
import { Session } from '@ory/client';

interface AuthContextType {
  session: Session | null | undefined;
  isLoading: boolean;
  login: (returnUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (returnUrl?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const config: AuthClientConfig = {
      kratosPublicUrl: process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC_URL || '',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
    };

    const client = new AuthClient(config);
    setAuthClient(client);

    const initialize = async () => {
      try {
        const currentSession = await client.getSession();
        setSession(currentSession);
      } catch (e) {
        console.error("AuthProvider initialization failed:", e);
        setSession(null); // Indicate no session on error
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

  }, []); // Empty dependency array, runs once on mount

  const login = async (returnUrl?: string) => {
    if (!authClient) return;
    await authClient.login(returnUrl);
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
  };

  const register = async (returnUrl?: string) => {
    if (!authClient) return;
    await authClient.register(returnUrl);
  };

  const authContextValue: AuthContextType = {
    session,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {isLoading ? <div>Loading User Status...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};