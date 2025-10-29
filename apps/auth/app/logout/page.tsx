'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthClient, AuthClientConfig } from '@mabru/auth-client';

function LogoutHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHandled = useRef(false);
  const returnTo = searchParams.get('return_to') || undefined;

  useEffect(() => {
    if (hasHandled.current) {
      return;
    }
    hasHandled.current = true;

    const config: AuthClientConfig = {
      kratosPublicUrl: process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC_URL || '',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
    };
    const client = new AuthClient(config);
    client.logout(); // The new logout method handles redirection internally
  }, [router, returnTo]);

  return (
    <div>
      <h1>Logging out...</h1>
      <p>Please wait.</p>
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogoutHandler />
    </Suspense>
  );
}