import { Configuration, FrontendApi, OAuth2Api, Session } from '@ory/client';

// Define a type for the configuration that AuthClient will accept
export interface AuthClientConfig {
  kratosPublicUrl: string;
  hydraAdminUrl?: string; // Hydra might not be directly used by AuthClient for user-facing flows
  baseUrl: string; // Base URL of the application, for redirects
}

export class AuthClient {
  private kratos: FrontendApi;
  // private hydra: OAuth2Api; // Hydra might not be directly used by AuthClient for user-facing flows

  constructor(config: AuthClientConfig) {
    if (typeof window === 'undefined') {
      // In a Next.js app, AuthClient might be instantiated on the server for some operations
      // but the browser-specific methods will only run in the browser.
      // For now, we'll allow server-side instantiation but warn if browser methods are called.
      console.warn("AuthClient instantiated on server. Browser-specific methods will not work.");
    }
    this.kratos = new FrontendApi(new Configuration({
      basePath: config.kratosPublicUrl,
    }));
    // Hydra might not be directly used by AuthClient for user-facing flows,
    // but if needed, it would be configured here.
    // this.hydra = new OAuth2Api(new Configuration({
    //   basePath: config.hydraAdminUrl, // Or public URL depending on usage
    // }));
  }

  // Method to get the current session
  public async getSession(): Promise<Session | undefined> {
    try {
      const { data: session } = await this.kratos.toSession();
      return session;
    } catch (error) {
      // Handle error, e.g., session not found or invalid
      console.error('Error getting session:', error);
      return undefined;
    }
  }

  // Method to initiate login flow
  public async login(returnTo?: string): Promise<void> {
    const loginFlow = await this.kratos.createBrowserLoginFlow({
      returnTo: returnTo,
    });
    // window.location.href = loginFlow.redirect_browser_to;
  }

  // Method to initiate registration flow
  public async register(returnTo?: string): Promise<void> {
    const registrationFlow = await this.kratos.createBrowserRegistrationFlow({ // Use createBrowserRegistrationFlow
      returnTo: returnTo,
    });
    // window.location.href = registrationFlow.data.redirect_browser_to;
  }

  // Method to handle authentication callbacks (e.g., after login/registration)
  // In a typical Ory Next.js setup, the middleware handles session establishment
  // after a redirect from Kratos. This method might be simplified or removed
  // if the middleware handles everything. For now, we'll just redirect to the base URL.
  public async handleCallback(): Promise<void> {
    window.location.href = '/'; // Or a more specific redirect based on session
  }

  // Method to initiate logout flow
  public async logout(): Promise<void> {
    const logoutFlow = await this.kratos.createBrowserLogoutFlow();
    // window.location.href = logoutFlow.data.redirect_browser_to;
  }

  // Placeholder for silent sign-in/session refresh (Ory handles this via cookies/middleware)
  public async signinSilent(): Promise<void> {
    console.warn('signinSilent is not typically used with Ory Next.js integration. Session is managed by middleware.');
  }

  public async signinSilentCallback(): Promise<void> {
    console.warn('signinSilentCallback is not typically used with Ory Next.js integration. Session is managed by middleware.');
  }
}
