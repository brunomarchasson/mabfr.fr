import { AuthClient } from '@mabru/auth-client';
import { UserManagerSettings } from 'oidc-client-ts';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Part 1: The Client Component that handles the browser-side logic
// =================================================================

'use client';

interface CallbackHandlerProps {
  config: Partial<UserManagerSettings>;
  hubUrl: string;
}

function CallbackHandler({ config, hubUrl }: CallbackHandlerProps) {
  const router = useRouter();
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    // Ensure config is present
    if (!config.authority || !config.client_id || !config.redirect_uri) {
      console.error("[Callback] Missing required OIDC configuration props.");
      router.push(hubUrl); // Redirect to a safe place on error
      return;
    }

    const handleAuthCallback = async () => {
      if (hasHandledCallback.current) return;
      hasHandledCallback.current = true;

      try {
        // Instantiate a temporary client just for this operation
        const client = new AuthClient(config as UserManagerSettings);
        const user = await client.handleCallback();
        const returnUrl = user?.state?.returnUrl;
        
        // Redirect to the returnUrl or the hub as a fallback
        router.push(returnUrl || hubUrl);
      } catch (error) {
        console.error("CallbackPage: Error handling callback:", error);
        // On error, redirect to the hub
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
  const config = {
    authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY,
    client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI,
    post_logout_redirect_uri: process.env.NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI,
    silent_redirect_uri: process.env.NEXT_PUBLIC_OIDC_SILENT_REDIRECT_URI,
    scope: process.env.NEXT_PUBLIC_OIDC_SCOPE,
  };

  const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || '/';

  // Render the client component and pass the config to it
  return <CallbackHandler config={config} hubUrl={hubUrl} />;
}