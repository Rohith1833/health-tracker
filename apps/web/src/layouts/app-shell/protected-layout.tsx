import { X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MobileBottomNavigation } from '@/components/navigation/mobile-bottom-navigation';
import { Sidebar } from '@/components/navigation/sidebar';
import { TopNavigation } from '@/components/navigation/top-navigation';
import { env } from '@/config/env';
import { cn } from '@/lib/utils';
import { sidebarRoutes } from '@/routes/config/app-routes';

export function ProtectedLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavigation onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileBottomNavigation />

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-foreground/30"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative flex h-full w-80 max-w-[85vw] flex-col border-r border-border bg-card shadow-lg">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-primary">Health & Routine</p>
                <h1 className="truncate text-base font-semibold">{env.appName}</h1>
              </div>
              <button
                className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-background"
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Mobile menu">
              {sidebarRoutes.map((route) => {
                const Icon = route.icon;

                return (
                  <NavLink
                    key={route.path}
                    className={({ isActive }) =>
                      cn(
                        'flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )
                    }
                    to={route.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{route.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
