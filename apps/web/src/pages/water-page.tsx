import { useWaterTracking } from '@/features/water/hooks/use-water-tracking';
import { WaterProgressRing } from '@/features/water/components/water-progress-ring';
import { WaterQuickAdd } from '@/features/water/components/water-quick-add';
import { WaterCustomAdd } from '@/features/water/components/water-custom-add';
import { WaterHistory } from '@/features/water/components/water-history';

export function WaterPage() {
  const { summary, isLoading, isMutating, error, addWater, removeWater } = useWaterTracking();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Water tracking</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Track your daily hydration
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Stay hydrated and log your water intake.
          </p>
        </div>
      </section>

      {error ? (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">{error}</div>
      ) : null}

      {isLoading && !summary ? (
        <div className="flex animate-pulse flex-col items-center justify-center p-12">
          <div className="size-64 rounded-full bg-muted" />
        </div>
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Progress Ring and History */}
          <div className="space-y-6">
            <section className="flex justify-center rounded-lg border border-border bg-card p-8 shadow-sm">
              <WaterProgressRing
                progress={summary.progress}
                consumedMl={summary.consumedMl}
                goalMl={summary.goalMl}
              />
            </section>
            <WaterHistory logs={summary.logs} isMutating={isMutating} onDelete={removeWater} />
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-6">
            <WaterQuickAdd onAdd={addWater} isMutating={isMutating} />
            <WaterCustomAdd onAdd={addWater} isMutating={isMutating} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
