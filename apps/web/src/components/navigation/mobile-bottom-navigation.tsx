import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { bottomNavRoutes } from '@/routes/config/app-routes';

export function MobileBottomNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/85 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-md lg:hidden shadow-[0_-1px_0_0_rgba(0,0,0,0.02)]"
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
                  'flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-xs font-semibold transition-all duration-150 relative',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground',
                )
              }
              to={route.path}
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-[18px]" aria-hidden="true" />
                  <span className="max-w-full truncate text-[10px] tracking-tight">
                    {route.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1.5 size-1 rounded-full bg-primary animate-fade-in" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
