import { useWaterTracking } from '@/features/water/hooks/use-water-tracking';
import { WaterProgressRing } from '@/features/water/components/water-progress-ring';
import { WaterQuickAdd } from '@/features/water/components/water-quick-add';
import { WaterCustomAdd } from '@/features/water/components/water-custom-add';
import { WaterHistory } from '@/features/water/components/water-history';

export function WaterPage() {
  const { summary, isLoading, isMutating, error, addWater, removeWater } = useWaterTracking();

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Water Tracking
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Daily Hydration
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            Track your water consumption and meet your daily hydration target.
          </p>
        </div>
      </section>

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive animate-fade-in">
          {error}
        </div>
      ) : null}

      {isLoading && !summary ? (
        <div className="flex animate-pulse flex-col items-center justify-center p-12">
          <div className="size-64 rounded-full bg-muted" />
        </div>
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Progress Ring and History */}
          <div className="space-y-6">
            <section className="flex justify-center rounded-2xl border border-border bg-card p-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
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
