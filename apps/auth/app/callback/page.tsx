'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@mabru/auth-client';

export default function CallbackPage() {
  const router = useRouter();
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (hasHandledCallback.current) {
        return;
      }
      hasHandledCallback.current = true;

      try {
        const user: any = await authClient.handleCallback();
        const returnUrl = user?.state?.returnUrl;
        // Redirect to the returnUrl if it exists, otherwise default to the hub
        router.push(returnUrl || process.env.NEXT_PUBLIC_HUB_URL || '/');
      } catch (error) {
        console.error("CallbackPage: Error handling callback:", error);
        // On error, redirect to the hub as a fallback
        router.push('http://localhost/hub/');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div>
      <h1>Finalizing login...</h1>
      <p>Please wait.</p>
    </div>
  );
}
