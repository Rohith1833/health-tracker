import { useNotifications } from '@/features/notifications/hooks/use-notifications';
import { useSettings } from '@/features/settings/hooks/use-settings';
import {
  Bell,
  BellOff,
  Droplets,
  Moon,
  Scale,
  Dumbbell,
  Utensils,
  CheckSquare,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotificationsPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, refresh } = useNotifications();
  const { settings, saveSettings } = useSettings();

  const handleToggleReminder = async (key: string, val: boolean) => {
    if (!settings) return;
    try {
      await saveSettings({
        ...settings,
        [key]: val,
      });
      refresh();
    } catch {
      // Ignore fallback
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'WATER':
        return <Droplets className="size-5 text-blue-500" />;
      case 'SLEEP':
        return <Moon className="size-5 text-purple-500" />;
      case 'WEIGHT':
        return <Scale className="size-5 text-pink-500" />;
      case 'WORKOUT':
        return <Dumbbell className="size-5 text-orange-500" />;
      case 'NUTRITION':
        return <Utensils className="size-5 text-emerald-500" />;
      case 'CHECKLIST':
        return <CheckSquare className="size-5 text-primary" />;
      default:
        return <Info className="size-5 text-muted-foreground" />;
    }
  };

  const getActionLink = (type: string) => {
    switch (type) {
      case 'WATER':
        return '/water';
      case 'SLEEP':
        return '/sleep';
      case 'WEIGHT':
        return '/weight';
      case 'WORKOUT':
        return '/workouts';
      case 'NUTRITION':
        return '/food';
      case 'CHECKLIST':
        return '/checklist';
      default:
        return '/dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const notifications = data?.notifications ?? [];
  const enableNotifications = settings?.enableNotifications ?? true;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Reminders Center
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            Receive context-aware health reminders and configure subscription triggers.
          </p>
        </div>

        {/* Global toggles header */}
        {settings && (
          <button
            type="button"
            onClick={() => handleToggleReminder('enableNotifications', !enableNotifications)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm
              ${enableNotifications ? 'bg-primary/10 border-primary text-primary hover:bg-primary/15' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'}`}
          >
            {enableNotifications ? (
              <>
                <Bell className="size-4" /> Reminders Enabled
              </>
            ) : (
              <>
                <BellOff className="size-4" /> Reminders Muted
              </>
            )}
          </button>
        )}
      </section>

      {/* Errors */}
      {error && (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
          <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Panel layout */}
      <div className="grid grid-cols-1 gap-6">
        {/* Dynamic Alerts List */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Active Alerts Today
          </h2>

          {!enableNotifications ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center space-y-3.5 shadow-sm">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground/80">
                <BellOff className="size-6" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                All reminders are currently muted. Turn on alerts above to receive notifications.
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center space-y-3.5 shadow-sm">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-foreground">You are fully caught up!</h3>
                <p className="text-xs font-semibold text-muted-foreground/85">
                  All goals and tracking logs have been updated for today. Keep up the excellent
                  work!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl border border-border bg-card p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.005)] flex items-start gap-4 hover:border-primary/30 transition-colors"
                >
                  <div className="mt-0.5 shrink-0">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs font-extrabold text-foreground">{alert.title}</h3>
                    <p className="text-xs text-muted-foreground/90 font-medium leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(getActionLink(alert.type))}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors shrink-0 self-center"
                  >
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Preference Config Toggles */}
        {settings && enableNotifications && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Reminders Preferences
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-foreground">
              <button
                type="button"
                onClick={() => handleToggleReminder('remindWater', !settings.remindWater)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer
                  ${settings.remindWater ? 'border-primary/25 bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground/80 hover:text-foreground'}`}
              >
                Water Logs
                <span className="size-2 rounded-full bg-current" />
              </button>

              <button
                type="button"
                onClick={() => handleToggleReminder('remindSleep', !settings.remindSleep)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer
                  ${settings.remindSleep ? 'border-primary/25 bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground/80 hover:text-foreground'}`}
              >
                Sleep Logs
                <span className="size-2 rounded-full bg-current" />
              </button>

              <button
                type="button"
                onClick={() => handleToggleReminder('remindWeight', !settings.remindWeight)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer
                  ${settings.remindWeight ? 'border-primary/25 bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground/80 hover:text-foreground'}`}
              >
                Weight Logs
                <span className="size-2 rounded-full bg-current" />
              </button>

              <button
                type="button"
                onClick={() => handleToggleReminder('remindWorkout', !settings.remindWorkout)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer
                  ${settings.remindWorkout ? 'border-primary/25 bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground/80 hover:text-foreground'}`}
              >
                Workouts
                <span className="size-2 rounded-full bg-current" />
              </button>

              <button
                type="button"
                onClick={() => handleToggleReminder('remindNutrition', !settings.remindNutrition)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer
                  ${settings.remindNutrition ? 'border-primary/25 bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground/80 hover:text-foreground'}`}
              >
                Nutrition Logs
                <span className="size-2 rounded-full bg-current" />
              </button>

              <button
                type="button"
                onClick={() => handleToggleReminder('remindChecklist', !settings.remindChecklist)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer
                  ${settings.remindChecklist ? 'border-primary/25 bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground/80 hover:text-foreground'}`}
              >
                Daily Checklist
                <span className="size-2 rounded-full bg-current" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
