import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-center animate-fade-in">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/5 text-destructive mb-5">
          <HelpCircle className="size-6" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Error 404
        </span>
        <h1 className="mt-1 text-xl font-extrabold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="mt-2 text-xs font-semibold text-muted-foreground/85 leading-relaxed">
          The page you requested does not exist or may have been relocated.
        </p>
        <Link
          className="mt-6 w-full rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
          to="/dashboard"
        >
          Go back dashboard
        </Link>
      </section>
    </main>
  );
}
