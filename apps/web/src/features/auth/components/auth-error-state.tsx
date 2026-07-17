import { useAuth } from '../hooks/use-auth';

type AuthErrorStateProps = {
  message?: string;
};

export function AuthErrorState({ message }: AuthErrorStateProps) {
  const { clearError, refreshSession } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="text-xl font-semibold">Authentication needs attention</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {message ?? 'We could not verify your session. Please try again.'}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            type="button"
            onClick={() => void refreshSession()}
          >
            Retry
          </button>
          <button
            className="rounded-md border border-border px-4 py-2 text-sm font-medium"
            type="button"
            onClick={clearError}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
