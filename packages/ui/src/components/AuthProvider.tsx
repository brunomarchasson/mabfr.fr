import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from 'oidc-client-ts';
import { authClient } from '@mabru/auth-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (returnUrl?: string) => Promise<void>;
  logout: (returnUrl?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authClient.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("AuthProvider: Failed to get user", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const onUserLoaded = (loadedUser: User) => setUser(loadedUser);
    const onUserUnloaded = () => setUser(null);

    authClient.events.addUserLoaded(onUserLoaded);
    authClient.events.addUserUnloaded(onUserUnloaded);

    return () => {
      authClient.events.removeUserLoaded(onUserLoaded);
      authClient.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);

  const authContextValue: AuthContextType = {
    user,
    isLoading,
    login: (returnUrl?: string) => authClient.login(returnUrl),
    logout: (returnUrl?: string) => authClient.logout(returnUrl),
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
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
