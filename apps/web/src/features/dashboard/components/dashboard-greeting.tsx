import { CalendarDays } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';

function getDisplayName(email?: string, name?: string) {
  if (name) {
    return name.split(' ')[0];
  }

  return email?.split('@')[0] ?? 'there';
}

export function DashboardGreeting() {
  const { user } = useAuth();
  const displayName = getDisplayName(user?.email, user?.user_metadata?.name as string | undefined);
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Workspace Overview
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
          Hello, {displayName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground/90">
          Stay consistent today: track your routines and hit your goals.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm">
        <CalendarDays className="size-4 text-muted-foreground/80" aria-hidden="true" />
        <span>{today}</span>
      </div>
    </section>
  );
}
