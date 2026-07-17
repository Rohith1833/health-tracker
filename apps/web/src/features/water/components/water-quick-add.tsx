import { GlassWater, CupSoda, Milk } from 'lucide-react';

interface WaterQuickAddProps {
  onAdd: (amountMl: number) => void;
  isMutating: boolean;
}

export function WaterQuickAdd({ onAdd, isMutating }: WaterQuickAddProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Quick Add</h2>
      <div className="grid grid-cols-3 gap-3">
        <button
          className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-background p-4 transition-colors hover:bg-muted disabled:opacity-50"
          disabled={isMutating}
          onClick={() => onAdd(250)}
        >
          <GlassWater className="size-6 text-blue-500" />
          <span className="text-sm font-medium">Glass</span>
          <span className="text-xs text-muted-foreground">250 ml</span>
        </button>
        <button
          className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-background p-4 transition-colors hover:bg-muted disabled:opacity-50"
          disabled={isMutating}
          onClick={() => onAdd(500)}
        >
          <CupSoda className="size-6 text-blue-500" />
          <span className="text-sm font-medium">Bottle</span>
          <span className="text-xs text-muted-foreground">500 ml</span>
        </button>
        <button
          className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-background p-4 transition-colors hover:bg-muted disabled:opacity-50"
          disabled={isMutating}
          onClick={() => onAdd(1000)}
        >
          <Milk className="size-6 text-blue-500" />
          <span className="text-sm font-medium">Jug</span>
          <span className="text-xs text-muted-foreground">1000 ml</span>
        </button>
      </div>
    </section>
  );
}
