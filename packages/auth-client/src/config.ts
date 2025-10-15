
// @ts-nocheck
interface AuthConfig {
  authority: string;
  clientId: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  silentRedirectUri: string;
  scope: string;
}

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Verify and log environment variables at startup
console.log("--- Auth Configuration ---");

const config: AuthConfig = {
  authority: getEnv("NEXT_PUBLIC_OIDC_AUTHORITY"),
  clientId: getEnv("NEXT_PUBLIC_OIDC_CLIENT_ID"),
  redirectUri: getEnv("NEXT_PUBLIC_OIDC_REDIRECT_URI"),
  postLogoutRedirectUri: getEnv("NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI"),
  silentRedirectUri: getEnv("NEXT_PUBLIC_OIDC_SILENT_REDIRECT_URI"),
  scope: getEnv("NEXT_PUBLIC_OIDC_SCOPE", "openid profile email offline_access"),
};

console.log(`Authority: ${config.authority}`);
console.log(`Client ID: ${config.clientId}`);
console.log(`Redirect URI: ${config.redirectUri}`);
console.log(`Post Logout Redirect URI: ${config.postLogoutRedirectUri}`);
console.log(`Silent Redirect URI: ${config.silentRedirectUri}`);
console.log(`Scope: ${config.scope}`);
console.log("--------------------------");


export const authConfig: Readonly<AuthConfig> = Object.freeze(config);
