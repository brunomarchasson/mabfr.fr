import 'server-only';
import { AuthProvider } from "@mabru/ui";

// This is now a Server Component
export default async function Providers({ children }: { children: React.ReactNode }) {
  // The AuthProvider now constructs its config internally using environment variables.
  // No need to pass config as a prop here.

  return <AuthProvider>{children}</AuthProvider>
}