import { prisma } from '../../lib/prisma.js';

const SESSION_INCLUDE = {
  exercises: {
    include: {
      exercise: true,
      sets: { orderBy: { setNumber: 'asc' as const } },
    },
    orderBy: { order: 'asc' as const },
  },
} as const;

// ── Program Listing ──────────────────────────────────────────────────────────

export async function getPrograms(filters: { difficulty?: string; goal?: string }) {
  return prisma.workoutProgram.findMany({
    where: {
      ...(filters.difficulty && { difficulty: filters.difficulty as any }),
      ...(filters.goal && { goal: filters.goal as any }),
    },
    include: {
      weeks: {
        orderBy: { weekNumber: 'asc' },
        include: {
          days: {
            orderBy: { dayNumber: 'asc' },
            include: {
              exercises: {
                include: { exercise: true },
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      },
    },
    orderBy: [{ difficulty: 'asc' }, { goal: 'asc' }],
  });
}

export async function getProgramById(programId: string) {
  return prisma.workoutProgram.findUnique({
    where: { id: programId },
    include: {
      weeks: {
        orderBy: { weekNumber: 'asc' },
        include: {
          days: {
            orderBy: { dayNumber: 'asc' },
            include: {
              exercises: {
                include: { exercise: true },
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      },
    },
  });
}

// ── Active Enrollment ────────────────────────────────────────────────────────

export async function getActiveEnrollment(userId: string) {
  const enrollment = await prisma.userWorkoutProgram.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: {
      program: {
        include: {
          weeks: {
            orderBy: { weekNumber: 'asc' },
            include: {
              days: {
                orderBy: { dayNumber: 'asc' },
                include: {
                  exercises: {
                    include: { exercise: true },
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment) return null;

  const currentWeekData = enrollment.program.weeks.find(
    (w) => w.weekNumber === enrollment.currentWeek,
  );
  const currentDayData = currentWeekData?.days.find((d) => d.dayNumber === enrollment.currentDay);

  const totalDays = enrollment.program.weeks.reduce((sum, w) => sum + w.days.length, 0);
  const completedDays = (enrollment.currentWeek - 1) * 7 + (enrollment.currentDay - 1);
  const progressPercent = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return {
    enrollment,
    currentDay: currentDayData ?? null,
    totalWeeks: enrollment.program.weeks.length,
    progressPercent,
  };
}

// ── Enroll in Program ────────────────────────────────────────────────────────

export async function enrollInProgram(userId: string, programId: string) {
  const program = await prisma.workoutProgram.findUnique({ where: { id: programId } });
  if (!program) throw new Error('PROGRAM_NOT_FOUND');

  // Cancel any previous active enrollment
  await prisma.userWorkoutProgram.updateMany({
    where: { userId, status: 'ACTIVE' },
    data: { status: 'CANCELLED' },
  });

  return prisma.userWorkoutProgram.create({
    data: {
      userId,
      programId,
      currentWeek: 1,
      currentDay: 1,
      status: 'ACTIVE',
    },
    include: { program: true },
  });
}

// ── Start Program Day ────────────────────────────────────────────────────────
// Creates a WorkoutSession from today's program day exercises.
// Does NOT advance currentDay — advancement happens on finish.

export async function startProgramDay(userId: string) {
  // 1. Find active enrollment
  const enrollment = await prisma.userWorkoutProgram.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: {
      program: {
        include: {
          weeks: {
            orderBy: { weekNumber: 'asc' },
            include: {
              days: {
                orderBy: { dayNumber: 'asc' },
                include: {
                  exercises: {
                    include: { exercise: true },
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment) throw new Error('NO_ACTIVE_PROGRAM');

  // 2. Prevent duplicate active session
  const existing = await prisma.workoutSession.findFirst({
    where: { userId, endTime: null, deletedAt: null },
  });
  if (existing) throw new Error('ACTIVE_WORKOUT_EXISTS');

  // 3. Find current day
  const currentWeekData = enrollment.program.weeks.find(
    (w) => w.weekNumber === enrollment.currentWeek,
  );
  const currentDay = currentWeekData?.days.find((d) => d.dayNumber === enrollment.currentDay);

  if (!currentDay) throw new Error('PROGRAM_DAY_NOT_FOUND');
  if (currentDay.isRestDay) throw new Error('CURRENT_DAY_IS_REST');

  // 4. Create the workout session with program day exercises
  const now = new Date();
  const session = await prisma.workoutSession.create({
    data: {
      userId,
      userWorkoutProgramId: enrollment.id,
      programDayId: currentDay.id,
      startTime: now,
      logDate: now,
      exercises: {
        create: currentDay.exercises.map((pe, idx) => ({
          exerciseId: pe.exerciseId,
          order: idx + 1,
          sets: {
            create: Array.from({ length: pe.sets }, (_, i) => ({
              setNumber: i + 1,
              reps: pe.reps ?? undefined,
              restTime: pe.restTime ?? undefined,
            })),
          },
        })),
      },
    },
    include: {
      ...SESSION_INCLUDE,
    },
  });

  return session;
}

// ── Complete Rest Day ────────────────────────────────────────────────────────
// Marks a rest day as complete and advances the program pointer.

export async function completeRestDay(userId: string) {
  const enrollment = await prisma.userWorkoutProgram.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: {
      program: {
        include: {
          weeks: {
            orderBy: { weekNumber: 'asc' },
            include: { days: { orderBy: { dayNumber: 'asc' } } },
          },
        },
      },
    },
  });

  if (!enrollment) throw new Error('NO_ACTIVE_PROGRAM');

  const currentWeekData = enrollment.program.weeks.find(
    (w) => w.weekNumber === enrollment.currentWeek,
  );
  const currentDay = currentWeekData?.days.find((d) => d.dayNumber === enrollment.currentDay);

  if (!currentDay) throw new Error('PROGRAM_DAY_NOT_FOUND');
  if (!currentDay.isRestDay) throw new Error('CURRENT_DAY_IS_NOT_REST');

  return advanceProgramPointer(enrollment);
}

// ── Advance Program Pointer ──────────────────────────────────────────────────
// Called after a workout is finished OR a rest day is marked complete.

export async function advanceProgramPointer(enrollment: {
  id: string;
  currentWeek: number;
  currentDay: number;
  program: {
    weeks: { weekNumber: number; days: { dayNumber: number }[] }[];
  };
}) {
  const totalWeeks = enrollment.program.weeks.length;
  const currentWeekData = enrollment.program.weeks.find(
    (w) => w.weekNumber === enrollment.currentWeek,
  );
  const daysInWeek = currentWeekData?.days.length ?? 7;

  let nextWeek = enrollment.currentWeek;
  let nextDay = enrollment.currentDay + 1;

  if (nextDay > daysInWeek) {
    nextWeek += 1;
    nextDay = 1;
  }

  if (nextWeek > totalWeeks) {
    // Program complete
    return prisma.userWorkoutProgram.update({
      where: { id: enrollment.id },
      data: { status: 'COMPLETED' },
    });
  }

  return prisma.userWorkoutProgram.update({
    where: { id: enrollment.id },
    data: { currentWeek: nextWeek, currentDay: nextDay },
  });
}

// ── Quit Program ─────────────────────────────────────────────────────────────

export async function quitProgram(userId: string) {
  const enrollment = await prisma.userWorkoutProgram.findFirst({
    where: { userId, status: 'ACTIVE' },
  });
  if (!enrollment) throw new Error('NO_ACTIVE_PROGRAM');

  return prisma.userWorkoutProgram.update({
    where: { id: enrollment.id },
    data: { status: 'CANCELLED' },
  });
}
