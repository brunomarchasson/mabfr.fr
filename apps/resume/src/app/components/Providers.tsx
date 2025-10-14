'use client'

import { AuthProvider } from "@mabru/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
