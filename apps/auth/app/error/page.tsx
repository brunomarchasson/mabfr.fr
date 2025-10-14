'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthButton } from '@mabru/ui';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorId = searchParams.get('id');
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (errorId) {
      setIsLoading(true);
      fetch(`/auth/api/kratos-error?id=${errorId}`)
        .then((res) => res.json())
        .then((data) => {
          setErrorDetails(data);
          if (process.env.NODE_ENV === 'production') {
            console.error("Kratos Flow Error:", data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch error details", err);
          setErrorDetails({ error: { message: "Could not load error details." } });
        })
        .finally(() => setIsLoading(false));
    }
  }, [errorId]);

  // Check for the specific whitelist validation error from our webhook
  const isWhitelistError = errorDetails?.messages?.[0]?.messages?.[0]?.id === 1001;

  if (isWhitelistError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
        <p className="max-w-md">
          Votre adresse e-mail n'est pas sur la liste des comptes autorisés à accéder à cette application.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Veuillez réessayer avec un autre compte ou contacter l'administrateur.
        </p>
        <div className="mt-8">
          <AuthButton />
        </div>
      </div>
    );
  }

  // Generic error display
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (process.env.NODE_ENV === 'development' && errorDetails) ? (
        // In development, show the full technical details
        <div className="w-full max-w-2xl">
          <pre className=" p-4 rounded-md text-left text-sm overflow-auto"><code>{JSON.stringify(errorDetails, null, 2)}</code></pre>
        </div>
      ) : (
        // In production, show a generic message
        <p className="max-w-md">
          Une erreur inattendue s'est produite. Veuillez réessayer plus tard ou contacter le support si le problème persiste.
        </p>
      )}
    </div>
  );
}
