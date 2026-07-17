import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { bottomNavRoutes } from '@/routes/config/app-routes';

export function MobileBottomNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {bottomNavRoutes.map((route) => {
          const Icon = route.icon;

          return (
            <NavLink
              key={route.path}
              className={({ isActive }) =>
                cn(
                  'flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
              to={route.path}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="max-w-full truncate">{route.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
