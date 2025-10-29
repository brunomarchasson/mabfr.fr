'use client';
import { AuthClient, AuthClientConfig } from '@mabru/auth-client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';



interface CallbackHandlerProps {
  config: AuthClientConfig;
  hubUrl: string;
}

function CallbackHandler({ config, hubUrl }: CallbackHandlerProps) {
  const router = useRouter();
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (hasHandledCallback.current) return;
      hasHandledCallback.current = true;

      try {
        const client = new AuthClient(config);
        await client.handleCallback(); // The new handleCallback redirects internally
        router.push(hubUrl); // Fallback redirect if handleCallback doesn't redirect
      } catch (error) {
        console.error("CallbackPage: Error handling callback:", error);
        router.push(hubUrl);
      }
    };

    handleAuthCallback();
  }, [config, router, hubUrl]);

  return (
    <div>
      <h1>Finalizing login...</h1>
      <p>Please wait.</p>
    </div>
  );
}

// Part 2: The Server Component that provides the configuration
// ==============================================================

export default async function CallbackPage() {
  // Read environment variables on the server
  const config: AuthClientConfig = {
    kratosPublicUrl: process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC_URL || '',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  };

  const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || '/';

  // Render the client component and pass the config to it
  return <CallbackHandler config={config} hubUrl={hubUrl} />;
}