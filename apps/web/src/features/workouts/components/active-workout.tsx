import { useState, useEffect } from 'react';
import { Play, Square, Plus, Trash2, Dumbbell, Clock, Flame, Calendar, Loader2, X, Search, Check, AlertCircle } from 'lucide-react';
import { 
  useActiveWorkout, 
  useStartWorkout, 
  useFinishWorkout, 
  useCancelWorkout,
  useAddExercise,
  useRemoveExercise,
  useAddSet,
  useUpdateSet,
  useRemoveSet,
  useWorkoutHistory
} from '../hooks/use-workouts';
import type { WorkoutExercise, WorkoutSet } from '../types/workout.types';
import { useExercises, useExerciseCategories, useExerciseDifficulties } from '@/features/exercises/hooks/use-exercises';

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ActiveWorkout() {
  const { data: activeWorkout, isLoading } = useActiveWorkout();
  const startMutation = useStartWorkout();
  const finishMutation = useFinishWorkout();
  const cancelMutation = useCancelWorkout();

  const [elapsed, setElapsed] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  useEffect(() => {
    if (!activeWorkout) return;
    const startTime = new Date(activeWorkout.startTime).getTime();
    
    const interval = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-xl border border-dashed bg-card">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading workout state...</p>
      </div>
    );
  }

  if (!activeWorkout) {
    return (
      <EmptyWorkoutState 
        isStarting={startMutation.isPending} 
        onStart={() => {
          const now = new Date();
          startMutation.mutate({
            logDate: now.toISOString().slice(0, 10),
            startTime: now.toISOString(),
          });
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="sticky top-4 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Dumbbell className="size-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold leading-none text-lg">Active Session</h2>
            <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-primary">
              {formatDuration(elapsed)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCancelDialog(true)}
            disabled={cancelMutation.isPending || finishMutation.isPending}
            className="flex-1 sm:flex-none rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowEndDialog(true)}
            disabled={cancelMutation.isPending || finishMutation.isPending}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Square className="size-4" fill="currentColor" />
            Finish
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-6">
        {(!activeWorkout.exercises || activeWorkout.exercises.length === 0) ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Dumbbell className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No exercises added</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-xs">
              Your workout is active! Start by adding your first exercise from the library.
            </p>
          </div>
        ) : (
          activeWorkout.exercises.map((exercise, index) => (
            <ExerciseCard 
              key={exercise.id} 
              workoutId={activeWorkout.id} 
              exercise={exercise} 
              index={index}
            />
          ))
        )}
      </div>

      {/* Add Exercise Button */}
      <button
        onClick={() => setShowExerciseModal(true)}
        className="group w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 py-4 text-primary hover:bg-primary/10 transition-colors"
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Plus className="size-4" />
        </div>
        <span className="font-medium">Add Exercise</span>
      </button>

      {/* Modals */}
      {showExerciseModal && (
        <ExerciseSelectModal 
          workoutId={activeWorkout.id} 
          currentOrder={activeWorkout.exercises?.length || 0}
          onClose={() => setShowExerciseModal(false)} 
        />
      )}

      {showEndDialog && (
        <ConfirmDialog
          title="Finish Workout"
          description="Are you ready to complete this session?"
          confirmText="Finish Workout"
          cancelText="Keep Going"
          onConfirm={() => {
            finishMutation.mutate({
              workoutId: activeWorkout.id,
              data: { endTime: new Date().toISOString() }
            }, {
              onSuccess: () => setShowEndDialog(false)
            });
          }}
          onCancel={() => setShowEndDialog(false)}
          isPending={finishMutation.isPending}
          variant="primary"
        >
          <div className="mt-4 mb-2 rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{formatDuration(elapsed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exercises:</span>
              <span className="font-medium">{activeWorkout.exercises?.length || 0} completed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calories (Est):</span>
              <span className="font-medium">Calculated upon save</span>
            </div>
          </div>
        </ConfirmDialog>
      )}

      {showCancelDialog && (
        <ConfirmDialog
          title="Cancel Workout"
          description="Are you sure? All progress from this session will be permanently lost."
          confirmText="Cancel Workout"
          cancelText="Keep Going"
          onConfirm={() => {
            cancelMutation.mutate(activeWorkout.id, {
              onSuccess: () => setShowCancelDialog(false)
            });
          }}
          onCancel={() => setShowCancelDialog(false)}
          isPending={cancelMutation.isPending}
          variant="destructive"
        />
      )}
    </div>
  );
}

function EmptyWorkoutState({ isStarting, onStart }: { isStarting: boolean; onStart: () => void }) {
  const { data } = useWorkoutHistory(1, 1);
  const lastWorkout = data?.items?.[0];

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 md:p-12 text-center bg-card">
      <div className="rounded-full bg-primary/10 p-5 mb-6">
        <Dumbbell className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">Ready to crush it?</h3>
      <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
        Start a new workout session to track your exercises, sets, and calories burned.
      </p>

      {lastWorkout && (
        <div className="mb-8 w-full max-w-sm rounded-xl border bg-muted/30 p-4 text-left">
          <p className="text-xs font-medium uppercase text-muted-foreground mb-3">Last Session</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{dateFormatter.format(new Date(lastWorkout.startTime))}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {lastWorkout.exercises?.length || 0} exercises completed
              </p>
            </div>
            <div className="text-right text-sm">
              <div className="flex items-center justify-end gap-1.5 font-medium">
                <Clock className="size-3.5 text-muted-foreground" />
                {lastWorkout.durationMinutes} min
              </div>
              {lastWorkout.caloriesBurned ? (
                <div className="flex items-center justify-end gap-1.5 font-medium mt-1">
                  <Flame className="size-3.5 text-orange-500" />
                  {lastWorkout.caloriesBurned} kcal
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <button
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        onClick={onStart}
        disabled={isStarting}
      >
        {isStarting ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" fill="currentColor" />}
        {isStarting ? 'Starting...' : 'Start New Workout'}
      </button>
    </div>
  );
}

function ExerciseCard({ workoutId, exercise, index }: { workoutId: string, exercise: WorkoutExercise, index: number }) {
  const removeExerciseMutation = useRemoveExercise();
  const addSetMutation = useAddSet();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between bg-muted/30 p-4 border-b">
        <div className="flex items-center gap-3">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            {index + 1}
          </span>
          <h3 className="font-semibold text-lg">{exercise.exercise.name}</h3>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Remove Exercise"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      
      <div className="p-4 sm:p-5 space-y-3">
        {(!exercise.sets || exercise.sets.length === 0) ? (
          <div className="text-center py-4 text-sm text-muted-foreground italic">
            No sets added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {exercise.sets.map((set, setIdx) => (
              <SetRow 
                key={set.id} 
                workoutId={workoutId} 
                exerciseId={exercise.id} 
                set={set} 
                index={setIdx} 
              />
            ))}
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={() => addSetMutation.mutate({ workoutId, exerciseId: exercise.id })}
            disabled={addSetMutation.isPending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-muted/50 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            {addSetMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add Set
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Remove Exercise"
          description={`Are you sure you want to remove "${exercise.exercise.name}" from this workout? All sets will be deleted.`}
          confirmText="Remove"
          onConfirm={() => removeExerciseMutation.mutate({ workoutId, exerciseId: exercise.id })}
          onCancel={() => setShowDeleteConfirm(false)}
          isPending={removeExerciseMutation.isPending}
          variant="destructive"
        />
      )}
    </div>
  );
}

function SetRow({ workoutId, exerciseId, set, index }: { workoutId: string, exerciseId: string, set: WorkoutSet, index: number }) {
  const updateSetMutation = useUpdateSet();
  const removeSetMutation = useRemoveSet();
  
  const [weight, setWeight] = useState(set.weight ?? '');
  const [reps, setReps] = useState(set.reps ?? '');
  const [isDone, setIsDone] = useState(false);

  // Sync local state if remote state changes
  useEffect(() => {
    setWeight(set.weight ?? '');
    setReps(set.reps ?? '');
  }, [set.weight, set.reps]);

  const handleUpdate = () => {
    const w = parseFloat(weight as string);
    const r = parseInt(reps as string, 10);
    
    updateSetMutation.mutate({
      workoutId,
      exerciseId,
      setId: set.id,
      data: { 
        weight: isNaN(w) ? null : w,
        reps: isNaN(r) ? null : r,
      }
    });
  };

  return (
    <div className={`group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border p-3 transition-colors ${isDone ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-background'}`}>
      <div className="flex items-center justify-between sm:w-16">
        <span className="text-xs font-semibold uppercase text-muted-foreground">Set {index + 1}</span>
        {/* Mobile delete button */}
        <button
          onClick={() => removeSetMutation.mutate({ workoutId, exerciseId, setId: set.id })}
          className="sm:hidden text-muted-foreground hover:text-destructive p-1"
        >
          <X className="size-4" />
        </button>
      </div>
      
      <div className="flex flex-1 items-center gap-4">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-medium uppercase text-muted-foreground">Weight (kg)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            onBlur={handleUpdate}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            placeholder="-"
            disabled={isDone}
          />
        </div>
        
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-medium uppercase text-muted-foreground">Reps</label>
          <input
            type="number"
            min="0"
            step="1"
            value={reps}
            onChange={e => setReps(e.target.value)}
            onBlur={handleUpdate}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            placeholder="-"
            disabled={isDone}
          />
        </div>

        <div className="flex items-end pb-0.5">
          <button
            onClick={() => setIsDone(!isDone)}
            className={`flex size-9 items-center justify-center rounded-md transition-all ${
              isDone 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
          >
            <Check className="size-4" strokeWidth={isDone ? 3 : 2} />
          </button>
        </div>
      </div>

      {/* Desktop delete button */}
      <button
        onClick={() => removeSetMutation.mutate({ workoutId, exerciseId, setId: set.id })}
        className="absolute -right-2 -top-2 hidden size-6 items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100 sm:flex transition-all shadow-sm"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

function ExerciseSelectModal({ workoutId, currentOrder, onClose }: { workoutId: string, currentOrder: number, onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  
  const addExerciseMutation = useAddExercise();
  
  const { data: categories } = useExerciseCategories();
  const { data: difficulties } = useExerciseDifficulties();
  const { data, isLoading } = useExercises({ 
    page: 1, 
    limit: 100, 
    search: search || undefined,
    category: category ? (category as any) : undefined,
    difficulty: difficulty ? (difficulty as any) : undefined
  });

  const exercises = data?.data || [];
  
  // Sort favorites first
  const sortedExercises = [...exercises].sort((a, b) => {
    if (a.isFavorite === b.isFavorite) return 0;
    return a.isFavorite ? -1 : 1;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border bg-card shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b p-4 sm:px-6">
          <h3 className="font-semibold text-lg">Add Exercise</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="border-b p-4 sm:px-6 space-y-4 bg-muted/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search exercises by name..."
              className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories?.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Difficulties</option>
              {difficulties?.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading exercises...</p>
            </div>
          ) : sortedExercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-10 text-muted-foreground mb-4" />
              <p className="font-medium text-lg">No exercises found</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => {
                    addExerciseMutation.mutate({
                      workoutId,
                      exerciseId: ex.id,
                      order: currentOrder + 1,
                    }, {
                      onSuccess: () => onClose()
                    });
                  }}
                  disabled={addExerciseMutation.isPending}
                  className="group w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-left disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{ex.name}</div>
                      {ex.isFavorite && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                          Favorite
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                      <span className="capitalize">{ex.category.toLowerCase()}</span>
                      <span>•</span>
                      <span className="capitalize">{ex.difficulty.toLowerCase()}</span>
                      <span>•</span>
                      <span className="truncate max-w-[150px] sm:max-w-[300px]">{ex.targetMuscles.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Plus className="size-4" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ 
  title, 
  description, 
  confirmText, 
  cancelText = "Cancel", 
  onConfirm, 
  onCancel, 
  isPending,
  variant = "primary",
  children
}: {
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
  variant?: "primary" | "destructive";
  children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <h3 className={`text-xl font-semibold mb-2 ${variant === 'destructive' ? 'text-destructive' : ''}`}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
        
        {children}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            disabled={isPending}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              variant === 'destructive' 
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            disabled={isPending}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
