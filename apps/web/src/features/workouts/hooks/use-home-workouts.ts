import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  fetchHomePrograms,
  fetchHomeProgramById,
  startHomeWorkout,
  finishHomeWorkout,
  fetchHomeHistory,
  fetchHomeStats,
  fetchHomeRecommendations,
  type HomeWorkoutGoal,
} from '../services/home-workout.api';
import type { Difficulty } from '@/features/exercises/types/exercise.types';

export const homeWorkoutKeys = {
  all: ['home-workouts'] as const,
  programs: (filters?: { goal?: HomeWorkoutGoal; difficulty?: Difficulty; featured?: boolean }) =>
    [...homeWorkoutKeys.all, 'programs', filters] as const,
  program: (id: string) => [...homeWorkoutKeys.all, 'program', id] as const,
  history: (options: { page: number; limit: number }) =>
    [...homeWorkoutKeys.all, 'history', options] as const,
  stats: () => [...homeWorkoutKeys.all, 'stats'] as const,
  recommendations: () => [...homeWorkoutKeys.all, 'recommendations'] as const,
};

export function useHomePrograms(filters?: {
  goal?: HomeWorkoutGoal;
  difficulty?: Difficulty;
  featured?: boolean;
}) {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: homeWorkoutKeys.programs(filters),
    queryFn: () => fetchHomePrograms(token, filters),
    enabled: !!token,
  });
}

export function useHomeProgram(id: string) {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: homeWorkoutKeys.program(id),
    queryFn: () => fetchHomeProgramById(token, id),
    enabled: !!token && !!id,
  });
}

export function useStartHomeWorkout() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useMutation({
    mutationFn: (programId: string) => startHomeWorkout(token, programId),
  });
}

export function useFinishHomeWorkout() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useMutation({
    mutationFn: (input: { historyId: string; duration: number; calories: number }) =>
      finishHomeWorkout(token, input),
    onSuccess: () => {
      // Invalidate stats, history, and dashboard caches to reflect changes
      void queryClient.invalidateQueries({ queryKey: homeWorkoutKeys.stats() });
      void queryClient.invalidateQueries({
        queryKey: homeWorkoutKeys.history({ page: 1, limit: 20 }),
      });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-today'] });
    },
  });
}

export function useHomeHistory(options: { page: number; limit: number }) {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: homeWorkoutKeys.history(options),
    queryFn: () => fetchHomeHistory(token, options),
    enabled: !!token,
  });
}

export function useHomeStats() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: homeWorkoutKeys.stats(),
    queryFn: () => fetchHomeStats(token),
    enabled: !!token,
  });
}

export function useHomeRecommendations() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: homeWorkoutKeys.recommendations(),
    queryFn: () => fetchHomeRecommendations(token),
    enabled: !!token,
  });
}
