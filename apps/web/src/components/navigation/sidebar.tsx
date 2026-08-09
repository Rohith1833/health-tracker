import { NavLink } from 'react-router-dom';
import { env } from '@/config/env';
import { cn } from '@/lib/utils';
import { sidebarRoutes } from '@/routes/config/app-routes';

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
      <div className="px-6 py-6 flex flex-col justify-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Health & Workspace
        </span>
        <h1 className="mt-1 text-base font-bold tracking-tight text-foreground">{env.appName}</h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2" aria-label="Main navigation">
        {sidebarRoutes.map((route) => {
          const Icon = route.icon;

          return (
            <NavLink
              key={route.path}
              className={({ isActive }) =>
                cn(
                  'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/5 text-primary font-semibold shadow-[inset_3px_0_0_0_var(--primary)] pl-4'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )
              }
              to={route.path}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden="true" />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
