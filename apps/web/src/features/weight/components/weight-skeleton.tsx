function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function WeightSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-4">
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-80" />
        <SkeletonBlock className="h-96" />
      </div>
      <SkeletonBlock className="h-[34rem]" />
    </div>
  );
}
