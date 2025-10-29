'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { AuthClient, AuthClientConfig } from '@mabru/auth-client';

function RegistrationHandler() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('return_to') || undefined;

  useEffect(() => {
    const config: AuthClientConfig = {
      kratosPublicUrl: process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC_URL || '',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
    };
    const client = new AuthClient(config);
    client.register(returnTo);
  }, [returnTo]);

  return (
    <div>
      <h1>Redirecting to registration...</h1>
      <p>Please wait.</p>
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationHandler />
    </Suspense>
  );
}