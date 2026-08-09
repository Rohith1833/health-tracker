import { Sparkles } from 'lucide-react';

type ShellPlaceholderPageProps = {
  title: string;
  description?: string;
};

export function ShellPlaceholderPage({ title, description }: ShellPlaceholderPageProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.01)] animate-fade-in flex flex-col items-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/5 text-primary mb-4">
          <Sparkles className="size-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Application Shell
        </span>
        <h1 className="mt-1 text-xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-xs font-semibold text-muted-foreground/80 max-w-sm leading-relaxed">
          {description ??
            'This module is registered in the routing system. High-fidelity premium interface elements will be integrated in a future release.'}
        </p>
      </div>
    </section>
  );
}
