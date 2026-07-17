export function AuthLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <h1 className="text-lg font-semibold">Checking your session</h1>
        <p className="mt-2 text-sm text-muted-foreground">Preparing your secure workspace.</p>
      </div>
    </div>
  );
}
