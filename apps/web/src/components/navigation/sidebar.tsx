import { NavLink } from 'react-router-dom';
import { env } from '@/config/env';
import { cn } from '@/lib/utils';
import { sidebarRoutes } from '@/routes/config/app-routes';

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="border-b border-border px-5 py-5">
        <p className="text-sm font-medium text-primary">Health & Routine</p>
        <h1 className="mt-1 text-lg font-semibold tracking-normal">{env.appName}</h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        {sidebarRoutes.map((route) => {
          const Icon = route.icon;

          return (
            <NavLink
              key={route.path}
              className={({ isActive }) =>
                cn(
                  'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
              to={route.path}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
