'use client';

import { useAuth, AuthButton } from '@mabru/ui';

export default function Page() {
  const { user, isLoading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Resume Page</h1>
        {isLoading ? (
          <p>Loading user status...</p>
        ) : user ? (
          <div className="flex flex-col items-center gap-4 mt-4">
            {user.profile.picture && (
              <img src={user.profile.picture} alt="Profile" className="w-24 h-24 rounded-full" />
            )}
            <p>Welcome, {user.profile.name || user.profile.email}</p>
          </div>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
      <AuthButton />
    </main>
  );
}
