import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  Utensils,
  Flame,
  Scale,
} from 'lucide-react';
import { useNutritionTracking } from '@/features/nutrition/hooks/use-nutrition-tracking';
import { useDashboardToday } from '@/features/dashboard/hooks/use-dashboard-today';
import type { MealType, MealEntry } from '@/features/nutrition/types/nutrition.types';

const MEAL_TYPES: { key: MealType; label: string; description: string }[] = [
  { key: 'BREAKFAST', label: 'Breakfast', description: 'Morning fuel and hydration' },
  { key: 'LUNCH', label: 'Lunch', description: 'Midday energy balance' },
  { key: 'DINNER', label: 'Dinner', description: 'Evening recovery meal' },
  { key: 'SNACK', label: 'Snacks & Extras', description: 'Occasional bites and fuel' },
];

function calculateMealTotals(entries: MealEntry[]) {
  return entries.reduce(
    (acc, entry) => {
      acc.calories += Number(entry.calories) || 0;
      acc.proteinG += Number(entry.proteinG) || 0;
      acc.carbsG += Number(entry.carbsG) || 0;
      acc.fatG += Number(entry.fatG) || 0;
      return acc;
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}

export function FoodPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MealEntry | null>(null);
  const [modalMealType, setModalMealType] = useState<MealType>('BREAKFAST');

  // Form states
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('serving');
  const [calories, setCalories] = useState('0');
  const [proteinG, setProteinG] = useState('0');
  const [carbsG, setCarbsG] = useState('0');
  const [fatG, setFatG] = useState('0');

  const { summary, isLoading, isMutating, error, refresh, addFood, editFood, removeFood } =
    useNutritionTracking(selectedDate);

  const { data: dashboardData } = useDashboardToday();
  const calorieGoal = dashboardData?.nutrition.goal ?? 2200;

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleSetToday = () => {
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  const openAddModal = (mealType: MealType) => {
    setModalMealType(mealType);
    setEditingEntry(null);
    setFoodName('');
    setQuantity('1');
    setUnit('serving');
    setCalories('0');
    setProteinG('0');
    setCarbsG('0');
    setFatG('0');
    setIsModalOpen(true);
  };

  const openEditModal = (entry: MealEntry, mealType: MealType) => {
    setModalMealType(mealType);
    setEditingEntry(entry);
    setFoodName(entry.foodName);
    setQuantity(String(entry.quantity));
    setUnit(entry.unit);
    setCalories(String(entry.calories));
    setProteinG(String(entry.proteinG));
    setCarbsG(String(entry.carbsG));
    setFatG(String(entry.fatG));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || isMutating) return;

    const payload = {
      mealType: modalMealType,
      date: selectedDate,
      foodName: foodName.trim(),
      quantity: Number(quantity) || 1,
      unit: unit.trim() || 'serving',
      calories: Number(calories) || 0,
      proteinG: Number(proteinG) || 0,
      carbsG: Number(carbsG) || 0,
      fatG: Number(fatG) || 0,
    };

    try {
      if (editingEntry) {
        await editFood(editingEntry.id, payload);
      } else {
        await addFood(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (confirm('Are you sure you want to delete this food item?')) {
      try {
        await removeFood(entryId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const dateLabel = new Date(selectedDate).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const totals = summary?.totals ?? { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
  const mealsMap = new Map(summary?.meals.map((m) => [m.mealType, m.entries]));

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Nutrition Logs
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Food Tracker
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            Monitor meals and macro tracking to fuel your active lifestyle.
          </p>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevDay}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleSetToday}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            Today
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground px-1 tabular-nums">
            {dateLabel}
          </span>
          <button
            type="button"
            onClick={handleNextDay}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      {/* Error display */}
      {error && (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Nutrition Summary Banner */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Calories Consumed
            </span>
            <p className="text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {totals.calories.toLocaleString()} kcal
            </p>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Daily target: {calorieGoal.toLocaleString()} kcal
            </span>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <Flame className="size-5" />
          </span>
        </div>

        {/* Protein Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Protein
            </span>
            <p className="text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {totals.proteinG.toFixed(1)}g
            </p>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Muscle repair & growth
            </span>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Scale className="size-5" />
          </span>
        </div>

        {/* Carbs Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Carbohydrates
            </span>
            <p className="text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {totals.carbsG.toFixed(1)}g
            </p>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Daily active energy
            </span>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Utensils className="size-5" />
          </span>
        </div>

        {/* Fat Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Healthy Fats
            </span>
            <p className="text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {totals.fatG.toFixed(1)}g
            </p>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Hormonal & cellular health
            </span>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Scale className="size-5" />
          </span>
        </div>
      </section>

      {/* Daily Meal Sections */}
      <section className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-muted/65 dark:bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {MEAL_TYPES.map((type) => {
              const entries = mealsMap.get(type.key) ?? [];
              const mealTotals = calculateMealTotals(entries);

              return (
                <div
                  key={type.key}
                  className="rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                    <div className="space-y-0.5">
                      <h2 className="text-base font-extrabold text-foreground">{type.label}</h2>
                      <p className="text-xs text-muted-foreground font-medium">
                        {type.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {entries.length > 0 && (
                        <span className="text-xs font-bold text-muted-foreground tabular-nums bg-secondary px-2.5 py-1 rounded-lg">
                          {mealTotals.calories} kcal &bull; {mealTotals.proteinG.toFixed(0)}g P
                          &bull; {mealTotals.carbsG.toFixed(0)}g C
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => openAddModal(type.key)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/15 px-3 py-1.5 rounded-xl transition-all"
                      >
                        <Plus className="size-3.5" />
                        Log Food
                      </button>
                    </div>
                  </div>

                  {entries.length > 0 ? (
                    <div className="divide-y divide-border/40 mt-2">
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-3.5 first:pt-2 last:pb-1"
                        >
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-xs font-bold text-foreground truncate">
                              {entry.foodName}
                            </h3>
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {entry.quantity} {entry.unit} &bull; {entry.calories} kcal
                            </span>
                          </div>

                          <div className="flex items-center gap-4 ml-4">
                            <span className="text-[10px] font-bold text-muted-foreground/80 tabular-nums hidden sm:inline">
                              {entry.proteinG.toFixed(1)}g P &bull; {entry.carbsG.toFixed(1)}g C
                              &bull; {entry.fatG.toFixed(1)}g F
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditModal(entry, type.key)}
                                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
                              >
                                <Edit2 className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(entry.id)}
                                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-colors"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-xs font-medium text-muted-foreground/80 italic text-center py-2">
                      No foods logged yet for {type.label.toLowerCase()}.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Log/Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-foreground">
                {editingEntry ? 'Edit Food Entry' : 'Log Food Item'}
              </h2>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Meal Category: {modalMealType.toLowerCase()}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Food Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eggs, Salmon, Protein Shake"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Serving Unit
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. g, oz, slice, scoop"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
                    value={proteinG}
                    onChange={(e) => setProteinG(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Carbohydrates (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
                    value={carbsG}
                    onChange={(e) => setCarbsG(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
                    value={fatG}
                    onChange={(e) => setFatG(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {editingEntry ? 'Update Entry' : 'Log Food'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Refresh button */}
      <button
        type="button"
        onClick={() => refresh()}
        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
      >
        <RefreshCw className="size-3.5" />
        Refresh
      </button>
    </div>
  );
}
