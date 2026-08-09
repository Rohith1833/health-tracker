import React, { useEffect, useState } from 'react';
import { useSettings } from '@/features/settings/hooks/use-settings';
import {
  Settings,
  Droplets,
  Moon,
  Utensils,
  Bell,
  Scale,
  Dumbbell,
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export function SettingsPage() {
  const { settings, isLoading, isMutating, error, saveSettings, refresh } = useSettings();

  const [waterGoal, setWaterGoal] = useState('2500');
  const [calorieGoal, setCalorieGoal] = useState('2200');
  const [sleepGoalHours, setSleepGoalHours] = useState('8');

  const [enableNotifications, setEnableNotifications] = useState(true);
  const [remindWater, setRemindWater] = useState(true);
  const [remindSleep, setRemindSleep] = useState(true);
  const [remindWeight, setRemindWeight] = useState(true);
  const [remindWorkout, setRemindWorkout] = useState(true);
  const [remindNutrition, setRemindNutrition] = useState(true);
  const [remindChecklist, setRemindChecklist] = useState(true);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setWaterGoal(settings.dailyWaterGoalMl.toString());
      setCalorieGoal(settings.dailyCalorieGoal?.toString() ?? '2200');
      setSleepGoalHours((settings.dailySleepGoalMinutes / 60).toFixed(1));
      setEnableNotifications(settings.enableNotifications);
      setRemindWater(settings.remindWater);
      setRemindSleep(settings.remindSleep);
      setRemindWeight(settings.remindWeight);
      setRemindWorkout(settings.remindWorkout);
      setRemindNutrition(settings.remindNutrition);
      setRemindChecklist(settings.remindChecklist);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMsg(null);

    const wat = Number(waterGoal);
    const cal = calorieGoal ? Number(calorieGoal) : null;
    const slp = Number(sleepGoalHours) * 60;

    if (isNaN(wat) || wat <= 0 || wat > 10000) {
      setValidationError('Please enter a valid water goal (1 - 10,000 ml).');
      return;
    }
    if (cal !== null && (isNaN(cal) || cal <= 0 || cal > 10000)) {
      setValidationError('Please enter a valid calorie goal (1 - 10,000 kcal).');
      return;
    }
    if (isNaN(slp) || slp <= 0 || slp > 1440) {
      setValidationError('Please enter a valid sleep goal (1 - 24 hours).');
      return;
    }

    try {
      await saveSettings({
        dailyWaterGoalMl: wat,
        dailyCalorieGoal: cal,
        dailySleepGoalMinutes: Math.round(slp),
        enableNotifications,
        remindWater,
        remindSleep,
        remindWeight,
        remindWorkout,
        remindNutrition,
        remindChecklist,
      });
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      refresh();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save settings.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <section className="border-b border-border/60 pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Preferences & Targets
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
          Customize your daily fitness goals and manage notification preferences.
        </p>
      </section>

      {/* Message banners */}
      {validationError && (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
          <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}
      {error && (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
          <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Daily Goals Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2 border-b border-border/50 pb-3">
            <Settings className="size-4 text-primary" />
            Daily Tracked Goals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Water Target */}
            <div className="space-y-2">
              <label
                htmlFor="water"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Droplets className="size-4 text-blue-500" />
                Water Goal (ml)
              </label>
              <input
                id="water"
                type="number"
                value={waterGoal}
                onChange={(e) => setWaterGoal(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
              />
            </div>

            {/* Calorie Target */}
            <div className="space-y-2">
              <label
                htmlFor="calories"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Utensils className="size-4 text-emerald-500" />
                Calorie Target
              </label>
              <input
                id="calories"
                type="number"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
              />
            </div>

            {/* Sleep Target */}
            <div className="space-y-2">
              <label
                htmlFor="sleep"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Moon className="size-4 text-purple-500" />
                Sleep Goal (hrs)
              </label>
              <input
                id="sleep"
                type="number"
                step="0.5"
                value={sleepGoalHours}
                onChange={(e) => setSleepGoalHours(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              Notifications & Reminders
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:height-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Conditional individual reminder settings */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-300 ${enableNotifications ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
          >
            {/* Water Reminder */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Droplets className="size-4 text-blue-500" />
                Water Log Reminder
              </span>
              <input
                type="checkbox"
                checked={remindWater}
                onChange={(e) => setRemindWater(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
            </div>

            {/* Sleep Reminder */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Moon className="size-4 text-purple-500" />
                Sleep Log Reminder
              </span>
              <input
                type="checkbox"
                checked={remindSleep}
                onChange={(e) => setRemindSleep(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
            </div>

            {/* Weight Reminder */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Scale className="size-4 text-pink-500" />
                Weight Log Reminder
              </span>
              <input
                type="checkbox"
                checked={remindWeight}
                onChange={(e) => setRemindWeight(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
            </div>

            {/* Workout Reminder */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Dumbbell className="size-4 text-orange-500" />
                Workout Session Reminder
              </span>
              <input
                type="checkbox"
                checked={remindWorkout}
                onChange={(e) => setRemindWorkout(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
            </div>

            {/* Nutrition Reminder */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Utensils className="size-4 text-emerald-500" />
                Meals Entry Reminder
              </span>
              <input
                type="checkbox"
                checked={remindNutrition}
                onChange={(e) => setRemindNutrition(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
            </div>

            {/* Checklist Reminder */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="size-4 text-primary" />
                Daily Checklist Reminder
              </span>
              <input
                type="checkbox"
                checked={remindChecklist}
                onChange={(e) => setRemindChecklist(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isMutating}
          className="w-full rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isMutating && <Loader2 className="size-4 animate-spin" />}
          Save Settings
        </button>
      </form>
    </div>
  );
}
