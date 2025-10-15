import { UserManager, WebStorageStateStore, User, UserManagerSettings, UserManagerEvents } from 'oidc-client-ts';
import { authConfig } from './config';

class AuthClient {
  private userManager: UserManager | null = null;

  private getManager(): UserManager {
    if (this.userManager) {
      return this.userManager;
    }
    if (typeof window !== 'undefined') {
      const settings: UserManagerSettings = {
        authority: authConfig.authority,
        client_id: authConfig.clientId,
        redirect_uri: authConfig.redirectUri,
        post_logout_redirect_uri: authConfig.postLogoutRedirectUri,
        silent_redirect_uri: authConfig.silentRedirectUri,
        response_type: 'code',
        scope: authConfig.scope,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
      };
      this.userManager = new UserManager(settings);
      return this.userManager;
    }
    
    throw new Error("UserManager can only be initialized in the browser.");
  }

  public get events(): UserManagerEvents {
    return this.getManager().events;
  }

  public async login(returnUrl?: string): Promise<void> {
    const state = returnUrl ? { returnUrl } : undefined;
    return this.getManager().signinRedirect({ 
      state,
      extraQueryParams: { prompt: 'login' },
    });
  }

  async handleCallback(): Promise<User | undefined | null> {
    try {
      const user = await this.getManager().signinCallback();
      return user;
    } catch (error) {
      console.error('[AuthClient] handleCallback: Error processing callback.', error);
      throw error;
    }
  }

  public async getUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;
    return this.getManager().getUser();
  }

  public async signinSilent(): Promise<User | null> {
    return this.getManager().signinSilent();
  }

  public async signinSilentCallback(): Promise<void> {
    await this.getManager().signinSilentCallback();
  }

  public async logout(returnUrl?: string): Promise<void> {
    const user = await this.getManager().getUser();
    await this.getManager().removeUser();
    return this.getManager().signoutRedirect({
      id_token_hint: user?.id_token,
      post_logout_redirect_uri: returnUrl,
    });
  }

  public async handleLogoutCallback(): Promise<void> {
    await this.getManager().signoutRedirectCallback();
  }
}

export const authClient = new AuthClient();
