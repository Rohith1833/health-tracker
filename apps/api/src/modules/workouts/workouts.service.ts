import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type { startWorkoutSchema, addExerciseSchema, updateSetSchema, finishWorkoutSchema } from './workouts.schema.js';

function toDateOnly(value: string) {
  return new Date(value);
}

export async function getActiveWorkout(userId: string) {
  const activeWorkout = await prisma.workoutSession.findFirst({
    where: { userId, endTime: null, deletedAt: null },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: 'asc' } },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  return activeWorkout;
}

export async function startWorkout(userId: string, input: z.infer<typeof startWorkoutSchema>) {
  const existing = await prisma.workoutSession.findFirst({
    where: { userId, endTime: null, deletedAt: null },
  });

  if (existing) {
    throw new Error('ACTIVE_WORKOUT_EXISTS');
  }

  return prisma.workoutSession.create({
    data: {
      userId,
      startTime: new Date(input.startTime),
      logDate: toDateOnly(input.logDate),
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: 'asc' } },
        },
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function cancelWorkout(userId: string, workoutId: string) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: workoutId, userId, deletedAt: null },
  });

  if (!session) {
    throw new Error('Workout not found');
  }

  return prisma.workoutSession.update({
    where: { id: workoutId },
    data: { deletedAt: new Date() },
  });
}

export async function addExercise(
  userId: string,
  workoutId: string,
  input: z.infer<typeof addExerciseSchema>
) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: workoutId, userId, endTime: null, deletedAt: null },
  });

  if (!session) {
    throw new Error('Active workout not found');
  }

  return prisma.workoutExercise.create({
    data: {
      workoutSessionId: workoutId,
      exerciseId: input.exerciseId,
      order: input.order,
      sets: {
        create: {
          setNumber: 1,
        },
      },
    },
    include: {
      exercise: true,
      sets: true,
    },
  });
}

export async function removeExercise(userId: string, workoutId: string, workoutExerciseId: string) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: workoutId, userId, endTime: null, deletedAt: null },
  });

  if (!session) {
    throw new Error('Active workout not found');
  }

  return prisma.workoutExercise.delete({
    where: { id: workoutExerciseId, workoutSessionId: workoutId },
  });
}

export async function addSet(userId: string, workoutId: string, workoutExerciseId: string) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: workoutId, userId, endTime: null, deletedAt: null },
  });

  if (!session) {
    throw new Error('Active workout not found');
  }

  const existingSets = await prisma.workoutSet.count({
    where: { workoutExerciseId },
  });

  return prisma.workoutSet.create({
    data: {
      workoutExerciseId,
      setNumber: existingSets + 1,
    },
  });
}

export async function updateSet(
  userId: string,
  workoutId: string,
  workoutExerciseId: string,
  setId: string,
  input: z.infer<typeof updateSetSchema>
) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: workoutId, userId, endTime: null, deletedAt: null },
  });

  if (!session) {
    throw new Error('Active workout not found');
  }

  return prisma.workoutSet.update({
    where: { id: setId, workoutExerciseId },
    data: {
      reps: input.reps,
      weight: input.weight !== undefined && input.weight !== null ? input.weight : null,
      duration: input.duration,
      restTime: input.restTime,
      notes: input.notes,
    },
  });
}

export async function removeSet(userId: string, workoutId: string, workoutExerciseId: string, setId: string) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: workoutId, userId, endTime: null, deletedAt: null },
  });

  if (!session) {
    throw new Error('Active workout not found');
  }

  const deletedSet = await prisma.workoutSet.delete({
    where: { id: setId, workoutExerciseId },
  });

  // Re-order remaining sets
  const remainingSets = await prisma.workoutSet.findMany({
    where: { workoutExerciseId },
    orderBy: { setNumber: 'asc' },
  });

  for (let i = 0; i < remainingSets.length; i++) {
    if (remainingSets[i].setNumber !== i + 1) {
      await prisma.workoutSet.update({
        where: { id: remainingSets[i].id },
        data: { setNumber: i + 1 },
      });
    }
  }

  return deletedSet;
}

export async function finishWorkout(
  userId: string,
  workoutId: string,
  input: z.infer<typeof finishWorkoutSchema>
) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: workoutId, userId, endTime: null, deletedAt: null },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error('Active workout not found');
  }

  const endTime = new Date(input.endTime);
  const durationSeconds = Math.max(0, Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000));
  const durationMinutes = Math.round(durationSeconds / 60);

  // Calculate calories burned
  // Formula: Calories = MET * weight_in_kg * (duration_in_hours)
  let caloriesBurned = 0;
  
  const latestWeight = await prisma.weightLog.findFirst({
    where: { userId, deletedAt: null },
    orderBy: { loggedAt: 'desc' },
  });

  const weightKg = latestWeight ? Number(latestWeight.weightKg) : 70; // Default to 70kg if no weight logged

  for (const workoutEx of session.exercises) {
    if (workoutEx.exercise.mets) {
      // Calculate duration for this specific exercise if possible, otherwise apportion it?
      // Actually, if we just apportion it equally or calculate total METs average?
      // A simple way: calculate the active time for this exercise by summing set durations, or just take average MET of the whole workout
      // The user just requested: Calculate calories from Exercise MET values and user's weight
      
      // Let's calculate total MET minutes for the workout.
      // Easiest approach: Sum of (MET * weight * (exercise_time_in_hours))
      // Since we don't strictly enforce exercise_time, we can either:
      // A) Average the METs of all exercises and apply to the total duration.
      // B) Or use set durations if available.
      // Let's use Average MET of the workout for the total duration.
    }
  }

  const metsArray = session.exercises.map(ex => ex.exercise.mets).filter(m => m !== null) as number[];
  const avgMet = metsArray.length > 0 
    ? metsArray.reduce((sum, met) => sum + met, 0) / metsArray.length 
    : 3.0; // Default MET for light exercise

  caloriesBurned = Math.round(avgMet * weightKg * (durationMinutes / 60));

  return prisma.workoutSession.update({
    where: { id: workoutId },
    data: {
      endTime,
      durationMinutes,
      caloriesBurned,
      notes: input.notes,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: 'asc' } },
        },
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function getWorkoutHistory(userId: string, options: { limit?: number; page?: number } = {}) {
  const limit = Math.min(options.limit ?? 50, 100);
  const page = Math.max(options.page ?? 1, 1);
  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    prisma.workoutSession.count({ where: { userId, deletedAt: null, endTime: { not: null } } }),
    prisma.workoutSession.findMany({
      where: { userId, deletedAt: null, endTime: { not: null } },
      orderBy: { logDate: 'desc' },
      skip,
      take: limit,
      include: {
        exercises: {
          include: {
            exercise: true,
          }
        }
      }
    }),
  ]);

  return {
    items,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getWorkoutById(userId: string, workoutId: string) {
  return prisma.workoutSession.findFirst({
    where: { id: workoutId, userId, deletedAt: null },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: 'asc' } },
        },
        orderBy: { order: 'asc' },
      },
    },
  });
}
