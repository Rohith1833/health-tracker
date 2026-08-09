import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useProfile } from '@/features/profile/hooks/use-profile';
import { User, Globe, Ruler, Target, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'America/Denver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Australia/Sydney',
];

export function ProfilePage() {
  const { session } = useAuth();
  const { profile, isLoading, isMutating, error, saveProfile, refresh } = useProfile();

  const [heightCm, setHeightCm] = useState('');
  const [targetWeightKg, setTargetWeightKg] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setHeightCm(profile.heightCm?.toString() ?? '');
      setTargetWeightKg(profile.targetWeightKg?.toString() ?? '');
      setTimezone(profile.timezone || 'UTC');
    }
  }, [profile]);

  // Autofill user's current browser timezone if not set
  const handleDetectTimezone = () => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) setTimezone(detected);
    } catch {
      // Ignore fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMsg(null);

    const h = heightCm ? Number(heightCm) : null;
    const w = targetWeightKg ? Number(targetWeightKg) : null;

    if (h !== null && (isNaN(h) || h <= 0 || h > 300)) {
      setValidationError('Please enter a valid height between 1 and 300 cm.');
      return;
    }
    if (w !== null && (isNaN(w) || w <= 0 || w > 500)) {
      setValidationError('Please enter a valid target weight between 1 and 500 kg.');
      return;
    }

    try {
      await saveProfile({ heightCm: h, targetWeightKg: w, timezone });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      refresh();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to update profile.');
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
          Settings & Identity
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">My Profile</h1>
        <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
          Manage your personal details, physical measurements, and system timezone.
        </p>
      </section>

      {/* Account Info Cards */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <User className="size-4 text-primary" />
          Account Credentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/75">
              Display Name
            </span>
            <span className="text-foreground font-bold">{session?.user?.email?.split('@')[0]}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/75">
              Registered Email
            </span>
            <span className="text-foreground font-bold">{session?.user?.email}</span>
          </div>
        </div>
      </div>

      {/* Validation or API Alert Messages */}
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

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Height input */}
          <div className="space-y-2">
            <label
              htmlFor="height"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
            >
              <Ruler className="size-4 text-primary" />
              Height (cm)
            </label>
            <input
              id="height"
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 175"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
            />
          </div>

          {/* Target Weight input */}
          <div className="space-y-2">
            <label
              htmlFor="targetWeight"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
            >
              <Target className="size-4 text-primary" />
              Target Weight (kg)
            </label>
            <input
              id="targetWeight"
              type="number"
              step="0.1"
              value={targetWeightKg}
              onChange={(e) => setTargetWeightKg(e.target.value)}
              placeholder="e.g. 70"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
            />
          </div>
        </div>

        {/* Timezone selector */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="timezone"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
            >
              <Globe className="size-4 text-primary" />
              Timezone
            </label>
            <button
              type="button"
              onClick={handleDetectTimezone}
              className="text-[10px] font-bold uppercase text-primary hover:underline"
            >
              Detect Timezone
            </button>
          </div>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
          >
            {COMMON_TIMEZONES.includes(timezone) ? null : (
              <option value={timezone}>{timezone} (Detected)</option>
            )}
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isMutating}
          className="w-full rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isMutating && <Loader2 className="size-4 animate-spin" />}
          Save Profile
        </button>
      </form>
    </div>
  );
}
