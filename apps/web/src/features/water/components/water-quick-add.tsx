import { GlassWater, CupSoda, Milk } from 'lucide-react';

interface WaterQuickAddProps {
  onAdd: (amountMl: number) => void;
  isMutating: boolean;
}

export function WaterQuickAdd({ onAdd, isMutating }: WaterQuickAddProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Quick Logging
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">Quick Add</h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Tap an option to log standard volume intake.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:bg-secondary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          disabled={isMutating}
          onClick={() => onAdd(250)}
        >
          <GlassWater className="size-6 text-blue-500" />
          <span className="text-xs font-bold text-foreground">Glass</span>
          <span className="text-[10px] font-semibold text-muted-foreground">250 ml</span>
        </button>
        <button
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:bg-secondary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          disabled={isMutating}
          onClick={() => onAdd(500)}
        >
          <CupSoda className="size-6 text-blue-500" />
          <span className="text-xs font-bold text-foreground">Bottle</span>
          <span className="text-[10px] font-semibold text-muted-foreground">500 ml</span>
        </button>
        <button
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:bg-secondary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          disabled={isMutating}
          onClick={() => onAdd(1000)}
        >
          <Milk className="size-6 text-blue-500" />
          <span className="text-xs font-bold text-foreground">Jug</span>
          <span className="text-[10px] font-semibold text-muted-foreground">1000 ml</span>
        </button>
      </div>
    </section>
  );
}
