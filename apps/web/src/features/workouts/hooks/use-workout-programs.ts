import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/use-auth';
import * as api from '../services/workout-programs.api';

export const programKeys = {
  all: ['workoutPrograms'] as const,
  list: (filters?: object) => [...programKeys.all, 'list', filters] as const,
  active: () => [...programKeys.all, 'active'] as const,
};

export function useWorkoutPrograms(filters?: { difficulty?: string; goal?: string }) {
  const { session } = useAuth();
  const token = session?.access_token;

  return useQuery({
    queryKey: programKeys.list(filters),
    queryFn: () => (token ? api.getPrograms(token, filters) : null),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Programs change rarely
  });
}

export function useActiveEnrollment() {
  const { session } = useAuth();
  const token = session?.access_token;

  return useQuery({
    queryKey: programKeys.active(),
    queryFn: () => (token ? api.getActiveEnrollment(token) : null),
    enabled: !!token,
  });
}

export function useEnrollInProgram() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: (programId: string) => {
      if (!token) throw new Error('Unauthorized');
      return api.enrollInProgram(token, programId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.active() });
    },
  });
}

export function useStartProgramDay() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Unauthorized');
      return api.startProgramDay(token);
    },
    onSuccess: (newSession) => {
      // Populate the active workout cache so the user is transitioned seamlessly
      queryClient.setQueryData(['activeWorkout'], newSession);
      queryClient.invalidateQueries({ queryKey: programKeys.active() });
    },
  });
}

export function useCompleteRestDay() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Unauthorized');
      return api.completeRestDay(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.active() });
    },
  });
}

export function useQuitProgram() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token;

  return useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Unauthorized');
      return api.quitProgram(token);
    },
    onSuccess: () => {
      queryClient.setQueryData(programKeys.active(), null);
    },
  });
}
