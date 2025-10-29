interface AuthConfig {
  kratosPublicUrl: string;
  hydraAdminUrl?: string; // Hydra might not be directly used by AuthClient for user-facing flows
  baseUrl: string; // Base URL of the application, for redirects
}

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Verify and log environment variables at startup
console.log("--- Auth Configuration (Ory) ---");

const config: AuthConfig = {
  kratosPublicUrl: getEnv("NEXT_PUBLIC_ORY_KRATOS_PUBLIC_URL"),
  // hydraAdminUrl: getEnv("NEXT_PUBLIC_ORY_HYDRA_ADMIN_URL"), // Uncomment if Hydra Admin API is needed
  baseUrl: getEnv("NEXT_PUBLIC_BASE_URL"),
};

console.log(`Kratos Public URL: ${config.kratosPublicUrl}`);
console.log(`Base URL: ${config.baseUrl}`);
console.log("--------------------------");


export const authConfig: Readonly<AuthConfig> = Object.freeze(config);