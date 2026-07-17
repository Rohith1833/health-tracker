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
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-normal text-foreground">
          Hi, {displayName}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep today simple: log the basics and protect your streak.
        </p>
      </div>
      <div className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4 text-primary" aria-hidden="true" />
        <span>{today}</span>
      </div>
    </section>
  );
}
