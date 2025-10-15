 'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserManagerSettings } from 'oidc-client-ts';
import { AuthClient } from '@mabru/auth-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (returnUrl?: string) => Promise<void>;
  logout: (returnUrl?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  config: Partial<UserManagerSettings>; // Config is now passed as a prop
}

export const AuthProvider = ({ children, config }: AuthProviderProps) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure all required config values are present
    if (!config.authority || !config.client_id || !config.redirect_uri) {
      console.error("[AuthProvider] Missing required OIDC configuration props.");
      setIsLoading(false);
      return;
    }

    // 1. Instantiate the AuthClient with the config from props
    const client = new AuthClient({
      ...config,
      response_type: 'code',
    } as UserManagerSettings);

    setAuthClient(client);

    const initialize = async () => {
      try {
        // 2. Check for the current user
        const currentUser = await client.getUser();
        setUser(currentUser);

        // 3. Set up event listeners
        const onUserLoaded = (loadedUser: User) => setUser(loadedUser);
        const onUserUnloaded = () => setUser(null);
        client.events.addUserLoaded(onUserLoaded);
        client.events.addUserUnloaded(onUserUnloaded);

        return () => {
          client.events.removeUserLoaded(onUserLoaded);
          client.events.removeUserUnloaded(onUserUnloaded);
        };
      } catch (e) {
        console.error("AuthProvider initialization failed:", e);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

  }, [config]); // Rerun if config changes

  const login = async (returnUrl?: string) => {
    if (!authClient) return;
    await authClient.login(returnUrl);
  };

  const logout = async (returnUrl?: string) => {
    if (!authClient) return;
    await authClient.logout(returnUrl);
  };

  const authContextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
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
