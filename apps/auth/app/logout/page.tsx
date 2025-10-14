'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@mabru/auth-client';

interface KratosLogoutFlow {
  logout_url: string;
  logout_token: string;
}

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) {
      return;
    }
    hasHandled.current = true;

    const logoutChallenge = searchParams.get('logout_challenge');

    if (logoutChallenge) {
      // This is the first step of the logout, initiated by Hydra/Kratos.
      fetch(`http://localhost/kratos/self-service/logout/browser?challenge=${logoutChallenge}`, {
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch Kratos logout flow');
          }
          return res.json();
        })
        .then((flow: KratosLogoutFlow) => {
          // The Kratos API returns a URL to complete the logout.
          if (flow.logout_url) {
            window.location.href = flow.logout_url;
          }
        })
        .catch((err) => {
          console.error("Failed to process Kratos logout flow", err);
          // Fallback redirect
          router.push('http://localhost/hub/');
        });
    } else {
      // This is the second step, after Kratos has logged out.
      // We get the return URL from session storage and redirect back to it.
      const returnUrl = sessionStorage.getItem('post_logout_return_url');
      sessionStorage.removeItem('post_logout_return_url');
      router.push(returnUrl || 'http://localhost/hub/');
    }
  }, [router, searchParams]);

  return (
    <div>
      <h1>Finalizing logout...</h1>
      <p>Please wait.</p>
    </div>
  );
}
