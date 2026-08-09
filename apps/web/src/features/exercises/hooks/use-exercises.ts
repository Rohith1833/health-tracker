import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  fetchExercises,
  fetchCategories,
  fetchDifficulties,
  toggleFavorite,
  fetchHomeExercises,
  addHomeFavorite,
  removeHomeFavorite,
  fetchHomeFavorites,
} from '../services/exercise.api';
import type { GetExercisesOptions, GetHomeExercisesOptions } from '../types/exercise.types';

// ── Gym Exercise Keys & Hooks ─────────────────────────────────────────────────

export const exerciseKeys = {
  all: ['exercises'] as const,
  lists: () => [...exerciseKeys.all, 'list'] as const,
  list: (filters: Omit<GetExercisesOptions, never>) => [...exerciseKeys.lists(), filters] as const,
  categories: () => [...exerciseKeys.all, 'categories'] as const,
  difficulties: () => [...exerciseKeys.all, 'difficulties'] as const,
};

export function useExercises(options: GetExercisesOptions) {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: exerciseKeys.list(options),
    queryFn: () => fetchExercises(token, options),
    enabled: !!token,
    placeholderData: (previousData) => previousData,
  });
}

export function useExerciseCategories() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: exerciseKeys.categories(),
    queryFn: () => fetchCategories(token),
    enabled: !!token,
    staleTime: Infinity,
  });
}

export function useExerciseDifficulties() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: exerciseKeys.difficulties(),
    queryFn: () => fetchDifficulties(token),
    enabled: !!token,
    staleTime: Infinity,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useMutation({
    mutationFn: (exerciseId: string) => toggleFavorite(token, exerciseId),
    onMutate: async (exerciseId) => {
      await queryClient.cancelQueries({ queryKey: exerciseKeys.lists() });
      const previousData = queryClient.getQueriesData({ queryKey: exerciseKeys.lists() });

      queryClient.setQueriesData({ queryKey: exerciseKeys.lists() }, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const data = old as {
          data: { id: string; isFavorite: boolean }[];
          meta: unknown;
        };
        return {
          ...data,
          data: data.data.map((ex) =>
            ex.id === exerciseId ? { ...ex, isFavorite: !ex.isFavorite } : ex,
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        for (const [queryKey, value] of context.previousData) {
          queryClient.setQueryData(queryKey, value);
        }
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
    },
  });
}

// ── Home Exercise Keys & Hooks ─────────────────────────────────────────────────

export const homeExerciseKeys = {
  all: ['home-exercises'] as const,
  lists: () => [...homeExerciseKeys.all, 'list'] as const,
  list: (filters: Omit<GetHomeExercisesOptions, never>) =>
    [...homeExerciseKeys.lists(), filters] as const,
  categories: () => [...homeExerciseKeys.all, 'categories'] as const,
  difficulties: () => [...homeExerciseKeys.all, 'difficulties'] as const,
  favorites: () => [...homeExerciseKeys.all, 'favorites'] as const,
};

export function useHomeExercises(options: GetHomeExercisesOptions) {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: homeExerciseKeys.list(options),
    queryFn: () => fetchHomeExercises(token, options),
    enabled: !!token,
    placeholderData: (previousData) => previousData,
  });
}

export function useHomeExerciseCategories() {
  return useQuery({
    queryKey: homeExerciseKeys.categories(),
    queryFn: async () => [
      'Warm-up',
      'Chest',
      'Back',
      'Shoulders',
      'Arms',
      'Core',
      'Legs',
      'Cardio',
      'Stretching',
      'HIIT',
      'Mobility',
      'Cool Down',
    ],
    staleTime: Infinity,
  });
}

export function useHomeExerciseDifficulties() {
  return useQuery({
    queryKey: homeExerciseKeys.difficulties(),
    queryFn: async () => ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    staleTime: Infinity,
  });
}

export function useToggleHomeFavorite() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      isFavorite ? removeHomeFavorite(token, id) : addHomeFavorite(token, id),
    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: homeExerciseKeys.lists() });
      const previousData = queryClient.getQueriesData({ queryKey: homeExerciseKeys.lists() });

      queryClient.setQueriesData({ queryKey: homeExerciseKeys.lists() }, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const data = old as {
          data: { id: string; isFavorite: boolean }[];
          meta: unknown;
        };
        return {
          ...data,
          data: data.data.map((ex) => (ex.id === id ? { ...ex, isFavorite: !isFavorite } : ex)),
        };
      });

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        for (const [queryKey, value] of context.previousData) {
          queryClient.setQueryData(queryKey, value);
        }
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: homeExerciseKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: homeExerciseKeys.favorites() });
    },
  });
}

export function useHomeFavorites(options: { page: number; limit: number }) {
  const { session } = useAuth();
  const token = session?.access_token ?? '';

  return useQuery({
    queryKey: [...homeExerciseKeys.favorites(), options],
    queryFn: () => fetchHomeFavorites(token, options),
    enabled: !!token,
    placeholderData: (previousData) => previousData,
  });
}
