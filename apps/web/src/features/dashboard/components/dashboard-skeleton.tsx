function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted/65 dark:bg-muted/30 ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div className="space-y-2.5">
          <SkeletonBlock className="h-3.5 w-28" />
          <SkeletonBlock className="h-8 w-56" />
          <SkeletonBlock className="h-4.5 w-80 max-w-full" />
        </div>
        <SkeletonBlock className="h-9 w-44 rounded-xl" />
      </section>

      <div className="space-y-4">
        <SkeletonBlock className="h-4.5 w-24" />
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-32" />
          ))}
        </section>
      </div>

      <SkeletonBlock className="h-44 w-full" />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-36" />
        ))}
      </section>
    </div>
  );
}
