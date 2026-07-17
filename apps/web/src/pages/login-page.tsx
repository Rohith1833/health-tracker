import { useState } from 'react';
import { env } from '@/config/env';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function LoginPage() {
  const { error, signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleGoogleSignIn() {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">{env.appName}</p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in to continue</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Use your Google account to access your private health and routine workspace.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <button
          className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
          type="button"
          disabled={isSubmitting}
          onClick={() => void handleGoogleSignIn()}
        >
          {isSubmitting ? 'Connecting...' : 'Continue with Google'}
        </button>
      </section>
    </main>
  );
}
