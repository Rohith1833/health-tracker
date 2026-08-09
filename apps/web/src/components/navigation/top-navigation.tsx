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
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors lg:hidden"
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenMobileMenu}
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Workspace
          </span>
          <h2 className="text-base font-bold tracking-tight text-foreground -mt-0.5">
            {currentRoute?.title ?? 'Overview'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="hidden size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            type="button"
            aria-label="Open notifications"
            title="Notifications"
          >
            <Bell className="size-4" aria-hidden="true" />
          </button>

          <ThemeSwitch />

          <div className="flex items-center gap-3 border-l border-border pl-3 ml-1">
            <div className="hidden flex-col text-right md:flex">
              <span className="text-xs font-semibold text-foreground">
                {user?.user_metadata?.name ?? 'Signed In'}
              </span>
              <span className="text-[10px] text-muted-foreground tracking-tight">
                {user?.email}
              </span>
            </div>
            <button
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-150"
              type="button"
              aria-label="Logout"
              title="Logout"
              onClick={() => void logout()}
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
