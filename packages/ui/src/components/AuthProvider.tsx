import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserManagerSettings } from 'oidc-client-ts';
import { AuthClient } from '@mabru/auth-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean; // This now represents total loading (config + user)
  login: (returnUrl?: string) => Promise<void>;
  logout: (returnUrl?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A new environment variable is needed to know where the auth app is hosted.
const authAppUrl = process.env.NEXT_PUBLIC_AUTH_APP_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!authAppUrl) {
        setError('Configuration error: NEXT_PUBLIC_AUTH_APP_URL is not set.');
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch the configuration from the API route
        const response = await fetch(`${authAppUrl}/api/config`);
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }
        const config = await response.json();

        // 2. Instantiate the AuthClient with the fetched config
        const client = new AuthClient({
          authority: config.authority,
          client_id: config.clientId,
          redirect_uri: config.redirectUri,
          post_logout_redirect_uri: config.postLogoutRedirectUri,
          silent_redirect_uri: config.silentRedirectUri,
          scope: config.scope,
          response_type: 'code',
        } as UserManagerSettings);

        setAuthClient(client);

        // 3. Check for the current user
        const currentUser = await client.getUser();
        setUser(currentUser);

        // 4. Set up event listeners
        const onUserLoaded = (loadedUser: User) => setUser(loadedUser);
        const onUserUnloaded = () => setUser(null);
        client.events.addUserLoaded(onUserLoaded);
        client.events.addUserUnloaded(onUserUnloaded);

        // Return a cleanup function for the event listeners
        return () => {
          client.events.removeUserLoaded(onUserLoaded);
          client.events.removeUserUnloaded(onUserUnloaded);
        };
      } catch (e: any) {
        console.error("AuthProvider initialization failed:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    // The cleanup function will be handled by React's useEffect return value
  }, []);

  if (error) {
    return <div>Authentication Error: {error}</div>;
  }

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