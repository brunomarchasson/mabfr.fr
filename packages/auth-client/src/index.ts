import { UserManager, WebStorageStateStore, User, UserManagerSettings, UserManagerEvents } from 'oidc-client-ts';

// The AuthClient class now takes settings in its constructor.
// This makes it independent of any static configuration.
export class AuthClient {
  private userManager: UserManager;

  constructor(settings: UserManagerSettings) {
    if (typeof window === 'undefined') {
      throw new Error("AuthClient can only be used in the browser.");
    }
    this.userManager = new UserManager({
      ...settings,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });
  }

  public get events(): UserManagerEvents {
    return this.userManager.events;
  }

  public async login(returnUrl?: string): Promise<void> {
    const state = returnUrl ? { returnUrl } : undefined;
    return this.userManager.signinRedirect({ 
      state,
      extraQueryParams: { prompt: 'login' },
    });
  }

  public async handleCallback(): Promise<User | undefined | null> {
    try {
      const user = await this.userManager.signinCallback();
      return user;
    } catch (error) {
      console.error('[AuthClient] handleCallback: Error processing callback.', error);
      throw error;
    }
  }

  public async getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  public async signinSilent(): Promise<User | null> {
    return this.userManager.signinSilent();
  }

  public async signinSilentCallback(): Promise<void> {
    await this.userManager.signinSilentCallback();
  }

  public async logout(returnUrl?: string): Promise<void> {
    const user = await this.userManager.getUser();
    await this.userManager.removeUser();
    return this.userManager.signoutRedirect({
      id_token_hint: user?.id_token,
      post_logout_redirect_uri: returnUrl,
    });
  }

  public async handleLogoutCallback(): Promise<void> {
    await this.userManager.signoutRedirectCallback();
  }
}