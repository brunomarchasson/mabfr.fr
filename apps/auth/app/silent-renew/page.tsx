'use client';

// This page is typically used for silent token renewal in OIDC.
// With Ory's Next.js integration, session management is primarily handled by middleware.
// This page can be simplified to a no-op.

export default function SilentRenewPage() {
  // No client-side logic needed here as session management is handled by Ory's middleware.
  // This page will simply load and immediately close/return control to the main application.
  return null; 
}