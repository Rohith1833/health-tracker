import { useAuth } from '@/features/auth/hooks/use-auth';

export function ProtectedPlaceholderPage() {
  const { logout, user } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-xl rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-sm font-medium text-primary">Protected route</p>
        <h1 className="mt-2 text-2xl font-semibold">Authentication is configured</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You are signed in as {user?.email ?? 'an authenticated user'}. Dashboard UI will be built
          later.
        </p>
        <button
          className="mt-6 rounded-md border border-border px-4 py-2 text-sm font-medium"
          type="button"
          onClick={() => void logout()}
        >
          Logout
        </button>
      </section>
    </main>
  );
}
