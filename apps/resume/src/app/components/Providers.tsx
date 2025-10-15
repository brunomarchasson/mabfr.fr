import 'server-only';
import { AuthProvider } from "@mabru/ui";

// This is now a Server Component
export default async function Providers({ children }: { children: React.ReactNode }) {
  // Read environment variables on the server
  const config = {
    authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY,
    client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI,
    post_logout_redirect_uri: process.env.NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI,
    silent_redirect_uri: process.env.NEXT_PUBLIC_OIDC_SILENT_REDIRECT_URI,
    scope: process.env.NEXT_PUBLIC_OIDC_SCOPE,
  };

  return <AuthProvider config={config}>{children}</AuthProvider>
}