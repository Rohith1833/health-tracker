import { Bell, LogOut, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ThemeSwitch } from '@/components/theme/theme-switch';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getRouteByPath } from '@/routes/config/app-routes';

type TopNavigationProps = {
  onOpenMobileMenu: () => void;
};

export function TopNavigation({ onOpenMobileMenu }: TopNavigationProps) {
  const location = useLocation();
  const currentRoute = getRouteByPath(location.pathname);
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-background lg:hidden"
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenMobileMenu}
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase text-muted-foreground">Health Tracker</p>
          <h2 className="truncate text-lg font-semibold">{currentRoute?.title ?? 'Workspace'}</h2>
        </div>

        <button
          className="hidden size-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex"
          type="button"
          aria-label="Open notifications"
          title="Notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
        </button>

        <ThemeSwitch />

        <div className="hidden min-w-0 items-center gap-3 rounded-md border border-border bg-card px-3 py-2 md:flex">
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium">
              {user?.user_metadata?.name ?? 'Signed in'}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <button
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            type="button"
            aria-label="Logout"
            title="Logout"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
