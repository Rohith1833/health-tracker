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
    <main className="flex min-h-screen items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/[0.02] blur-3xl pointer-events-none" />

      <section className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-[0_8px_30px_rgb(0,0,0,0.03)] z-10 transition-all duration-300">
        <div className="mb-8 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
            {env.appName}
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Access your private health, routine, and sleep dashboard with your secure credentials.
          </p>
        </div>

        {error ? (
          <div
            className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs text-destructive animate-fade-in font-medium"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <button
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-75 disabled:active:scale-100"
          type="button"
          disabled={isSubmitting}
          onClick={() => void handleGoogleSignIn()}
        >
          <GoogleIcon className="size-4 shrink-0" />
          {isSubmitting ? 'Connecting...' : 'Continue with Google'}
        </button>

        <p className="mt-8 text-center text-[10px] text-muted-foreground">
          By signing in, you agree to our terms of service and privacy guidelines.
        </p>
      </section>
    </main>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="100%" height="100%">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
