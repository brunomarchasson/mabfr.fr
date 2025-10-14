'use client';

import { useEffect } from 'react';
import { authClient } from '@mabru/auth-client';

export default function SilentRenewPage() {
  useEffect(() => {
    authClient.signinSilentCallback().catch((error) => {
      console.error("SilentRenewPage: Error handling silent renew callback:", error);
    });
  }, []);

  return null; // This page should not render anything visible
}
