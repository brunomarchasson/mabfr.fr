'use client';

import { useAuth, AuthButton } from '@mabru/ui';

export default function Page() {
  const { session, isLoading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Hub Page</h1>
        {isLoading ? (
          <p>Loading user status...</p>
        ) : session ? (
          <div className="flex flex-col items-center gap-4 mt-4">
            {/* Assuming session.identity.traits has a picture property */}
            {session.identity?.traits?.picture && (
              <img src={session.identity.traits.picture as string} alt="Profile" className="w-24 h-24 rounded-full" />
            )}
            <p>Welcome, {session.identity?.traits?.name || session.identity?.traits?.email}</p>
          </div>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
      <AuthButton />
    </main>
  );
}