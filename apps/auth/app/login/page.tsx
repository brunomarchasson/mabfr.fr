'use client';

import { useEffect, Suspense } from 'react';
import { AuthClient, AuthClientConfig } from '@mabru/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('return_to') || undefined;

  useEffect(() => {
    const config: AuthClientConfig = {
      kratosPublicUrl: process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC_URL || '',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
    };
    const client = new AuthClient(config);
    client.login(returnTo);
  }, [router, returnTo]);

  return (
    <div>
      <h1>Redirecting to login...</h1>
      <p>Please wait.</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginHandler />
    </Suspense>
  );
}