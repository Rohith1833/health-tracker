type ShellPlaceholderPageProps = {
  title: string;
  description?: string;
};

export function ShellPlaceholderPage({ title, description }: ShellPlaceholderPageProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl items-center justify-center">
      <div className="w-full rounded-lg border border-dashed border-border bg-card p-6 text-card-foreground sm:p-8">
        <p className="text-sm font-medium text-primary">Application shell</p>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {description ??
            'This route is connected to the protected application layout. Feature UI will be built later.'}
        </p>
      </div>
    </section>
  );
}
