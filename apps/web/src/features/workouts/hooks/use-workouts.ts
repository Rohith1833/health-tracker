import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/use-auth';
import * as api from '../services/workout.api';
import type { WorkoutSet } from '../types/workout.types';

export function useActiveWorkout() {
  const { session } = useAuth();
  const token = session?.access_token;

  return useQuery({
    queryKey: ['activeWorkout'],
    queryFn: () => (token ? api.getActiveWorkout(token) : null),
    enabled: !!token,
  });
}

export function useWorkoutHistory(page: number, limit: number) {
  const { session } = useAuth();
  const token = session?.access_token;

  return useQuery({
    queryKey: ['workoutHistory', page, limit],
    queryFn: () => (token ? api.getWorkoutHistory(token, page, limit) : null),
    enabled: !!token,
  });
}

export function useStartWorkout() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: (data: { logDate: string; startTime: string }) => {
      if (!token) throw new Error('Unauthorized');
      return api.startWorkout(token, data);
    },
    onSuccess: (newWorkout) => {
      queryClient.setQueryData(['activeWorkout'], newWorkout);
    },
  });
}

export function useCancelWorkout() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: (workoutId: string) => {
      if (!token) throw new Error('Unauthorized');
      return api.cancelWorkout(token, workoutId);
    },
    onSuccess: () => {
      queryClient.setQueryData(['activeWorkout'], null);
    },
  });
}

export function useAddExercise() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: ({ workoutId, exerciseId, order }: { workoutId: string; exerciseId: string; order: number }) => {
      if (!token) throw new Error('Unauthorized');
      return api.addExercise(token, workoutId, { exerciseId, order });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeWorkout'] });
    },
  });
}

export function useRemoveExercise() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: ({ workoutId, exerciseId }: { workoutId: string; exerciseId: string }) => {
      if (!token) throw new Error('Unauthorized');
      return api.removeExercise(token, workoutId, exerciseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeWorkout'] });
    },
  });
}

export function useAddSet() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: ({ workoutId, exerciseId }: { workoutId: string; exerciseId: string }) => {
      if (!token) throw new Error('Unauthorized');
      return api.addSet(token, workoutId, exerciseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeWorkout'] });
    },
  });
}

export function useUpdateSet() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: ({
      workoutId,
      exerciseId,
      setId,
      data,
    }: {
      workoutId: string;
      exerciseId: string;
      setId: string;
      data: Partial<WorkoutSet>;
    }) => {
      if (!token) throw new Error('Unauthorized');
      return api.updateSet(token, workoutId, exerciseId, setId, data);
    },
    onSuccess: () => {
      // In a real app we could optimistically update the specific set in cache,
      // but invalidation is safer and simpler for this demo
      queryClient.invalidateQueries({ queryKey: ['activeWorkout'] });
    },
  });
}

export function useRemoveSet() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: ({
      workoutId,
      exerciseId,
      setId,
    }: {
      workoutId: string;
      exerciseId: string;
      setId: string;
    }) => {
      if (!token) throw new Error('Unauthorized');
      return api.removeSet(token, workoutId, exerciseId, setId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeWorkout'] });
    },
  });
}

export function useFinishWorkout() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: ({
      workoutId,
      data,
    }: {
      workoutId: string;
      data: { endTime: string; notes?: string };
    }) => {
      if (!token) throw new Error('Unauthorized');
      return api.finishWorkout(token, workoutId, data);
    },
    onSuccess: () => {
      queryClient.setQueryData(['activeWorkout'], null);
      queryClient.invalidateQueries({ queryKey: ['workoutHistory'] });
      // Invalidate dashboard metrics as well
    },
  });
}
