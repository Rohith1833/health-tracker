import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  fetchExercises,
  fetchCategories,
  fetchDifficulties,
  toggleFavorite,
} from '../services/exercise.api';
import type { ExerciseCategory, Difficulty, GetExercisesOptions } from '../types/exercise.types';

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
    staleTime: Infinity, // enum values never change
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
      // Cancel any in-flight queries
      await queryClient.cancelQueries({ queryKey: exerciseKeys.lists() });

      // Snapshot all exercise list caches for rollback
      const previousData = queryClient.getQueriesData({ queryKey: exerciseKeys.lists() });

      // Optimistically toggle isFavorite in all cached pages
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
      // Roll back on error
      if (context?.previousData) {
        for (const [queryKey, value] of context.previousData) {
          queryClient.setQueryData(queryKey, value);
        }
      }
    },
    onSettled: () => {
      // Always refetch to ensure server state is reflected
      void queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
    },
  });
}

export type { ExerciseCategory, Difficulty };
