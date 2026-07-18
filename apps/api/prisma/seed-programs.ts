import { PrismaClient, Difficulty, ProgramGoal } from '@prisma/client';

const prisma = new PrismaClient();

// ── Helper ────────────────────────────────────────────────────────────────────

/** Returns the DB exercise by name (partial, case-insensitive) or throws. */
async function ex(partialName: string) {
  const found = await prisma.exercise.findFirst({
    where: { name: { contains: partialName, mode: 'insensitive' } },
  });
  if (!found) throw new Error(`Exercise not found: "${partialName}"`);
  return found.id;
}

// ── Program Definitions ───────────────────────────────────────────────────────

async function buildPrograms() {
  const running = await ex('Running');
  const cycling = await ex('Cycling');
  const jumpRope = await ex('Jump Rope');
  const burpees = await ex('Burpees');
  const rowing = await ex('Rowing');
  const pushUp = await ex('Push-up');
  const pullUp = await ex('Pull-up');
  const benchPress = await ex('Bench Press');
  const overheadPress = await ex('Overhead Press');
  const dumbbellRow = await ex('Dumbbell Row');
  const squat = await ex('Barbell Squat');
  const deadlift = await ex('Deadlift');
  const walkingLunges = await ex('Walking Lunges');
  const legPress = await ex('Leg Press');
  const calfRaises = await ex('Calf Raises');
  const plank = await ex('Plank');
  const russianTwists = await ex('Russian Twists');
  const hangingLegRaises = await ex('Hanging Leg Raises');
  const sunSalutation = await ex('Yoga Sun Salutation');
  const hamstringStretch = await ex('Hamstring Stretch');
  const singleLegDL = await ex('Single-Leg Deadlift');
  const boxJumps = await ex('Box Jumps');

  type ProgramDef = {
    title: string;
    description: string;
    difficulty: Difficulty;
    goal: ProgramGoal;
    weeks: WeekDef[];
  };

  type WeekDef = {
    days: DayDef[];
  };

  type DayDef = {
    title?: string;
    isRestDay?: boolean;
    exercises?: {
      exerciseId: string;
      order: number;
      sets: number;
      reps?: number;
      restTime?: number;
    }[];
  };

  const PROGRAMS: ProgramDef[] = [
    // ─── BEGINNER PROGRAMS ────────────────────────────────────────────────────
    {
      title: 'Beginner Fat Burner',
      description:
        'A gentle 4-week introduction to cardio and light strength training designed to kick-start fat loss. Perfect for complete beginners.',
      difficulty: Difficulty.BEGINNER,
      goal: ProgramGoal.WEIGHT_LOSS,
      weeks: Array.from({ length: 4 }, (_, wi) => ({
        days: [
          {
            title: 'Cardio Intro',
            exercises: [
              { exerciseId: running, order: 1, sets: 3, reps: undefined, restTime: 60 },
              { exerciseId: calfRaises, order: 2, sets: 3, reps: 15, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Full-Body Light',
            exercises: [
              { exerciseId: pushUp, order: 1, sets: 3, reps: 10 + wi * 2, restTime: 60 },
              { exerciseId: walkingLunges, order: 2, sets: 3, reps: 12, restTime: 60 },
              { exerciseId: plank, order: 3, sets: 3, reps: undefined, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Cardio + Core',
            exercises: [
              { exerciseId: cycling, order: 1, sets: 3, reps: undefined, restTime: 60 },
              { exerciseId: russianTwists, order: 2, sets: 3, reps: 20, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Active Recovery', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Beginner Muscle Builder',
      description:
        'Start your muscle-building journey with simple, effective resistance exercises. Focuses on proper form and gradual progression.',
      difficulty: Difficulty.BEGINNER,
      goal: ProgramGoal.MUSCLE_GAIN,
      weeks: Array.from({ length: 4 }, (_, wi) => ({
        days: [
          {
            title: 'Upper Body Basics',
            exercises: [
              { exerciseId: pushUp, order: 1, sets: 3, reps: 8 + wi, restTime: 90 },
              { exerciseId: dumbbellRow, order: 2, sets: 3, reps: 10 + wi, restTime: 90 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Lower Body Basics',
            exercises: [
              { exerciseId: squat, order: 1, sets: 3, reps: 10 + wi, restTime: 90 },
              { exerciseId: walkingLunges, order: 2, sets: 3, reps: 10, restTime: 90 },
              { exerciseId: calfRaises, order: 3, sets: 3, reps: 15, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Full Body Pump',
            exercises: [
              { exerciseId: pushUp, order: 1, sets: 3, reps: 8 + wi, restTime: 90 },
              { exerciseId: squat, order: 2, sets: 3, reps: 10, restTime: 90 },
              { exerciseId: plank, order: 3, sets: 3, reps: undefined, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Beginner Strength Foundations',
      description:
        'Learn the foundational movement patterns to build raw strength safely. Low reps, plenty of rest, and a focus on technique.',
      difficulty: Difficulty.BEGINNER,
      goal: ProgramGoal.STRENGTH,
      weeks: Array.from({ length: 4 }, (_, wi) => ({
        days: [
          {
            title: 'Strength Day A',
            exercises: [
              { exerciseId: squat, order: 1, sets: 4, reps: 5, restTime: 120 },
              { exerciseId: benchPress, order: 2, sets: 4, reps: 5, restTime: 120 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Strength Day B',
            exercises: [
              { exerciseId: deadlift, order: 1, sets: 4, reps: 5, restTime: 120 },
              { exerciseId: overheadPress, order: 2, sets: 4, reps: 5, restTime: 120 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Accessory Work',
            exercises: [
              { exerciseId: walkingLunges, order: 1, sets: 3, reps: 10, restTime: 90 },
              { exerciseId: plank, order: 2, sets: 3, reps: undefined, restTime: 60 },
            ],
          },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Beginner Couch to 5K Prep',
      description:
        'Build your cardiovascular endurance from scratch. A mix of walking, light jogging, and basic core work to prepare you for continuous running.',
      difficulty: Difficulty.BEGINNER,
      goal: ProgramGoal.ENDURANCE,
      weeks: Array.from({ length: 4 }, (_, wi) => ({
        days: [
          {
            title: 'Walk/Jog Intervals',
            exercises: [
              { exerciseId: running, order: 1, sets: 4 + wi, reps: undefined, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Core & Stability',
            exercises: [
              { exerciseId: plank, order: 1, sets: 3, reps: undefined, restTime: 60 },
              { exerciseId: russianTwists, order: 2, sets: 3, reps: 20, restTime: 60 },
              { exerciseId: calfRaises, order: 3, sets: 3, reps: 15, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Steady State Light',
            exercises: [{ exerciseId: cycling, order: 1, sets: 2, reps: undefined, restTime: 60 }],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Active Recovery', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Beginner Bodyweight Builder',
      description:
        'Build a foundation of strength using only your bodyweight. No equipment needed — just consistency.',
      difficulty: Difficulty.BEGINNER,
      goal: ProgramGoal.GENERAL_FITNESS,
      weeks: Array.from({ length: 4 }, (_, wi) => ({
        days: [
          {
            title: 'Upper Body',
            exercises: [
              { exerciseId: pushUp, order: 1, sets: 3, reps: 10 + wi * 2, restTime: 60 },
              { exerciseId: plank, order: 2, sets: 3, reps: undefined, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Lower Body',
            exercises: [
              { exerciseId: walkingLunges, order: 1, sets: 3, reps: 12, restTime: 60 },
              { exerciseId: calfRaises, order: 2, sets: 3, reps: 20, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Full Body + Core',
            exercises: [
              { exerciseId: pushUp, order: 1, sets: 2, reps: 10 + wi * 2, restTime: 60 },
              { exerciseId: walkingLunges, order: 2, sets: 2, reps: 12, restTime: 60 },
              { exerciseId: russianTwists, order: 3, sets: 3, reps: 16, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Rest & Stretch', isRestDay: true },
        ],
      })),
    },

    // ─── INTERMEDIATE PROGRAMS ────────────────────────────────────────────────
    {
      title: 'Intermediate Fat Loss Accelerator',
      description:
        'A 6-week program combining HIIT cardio, circuit training, and core work to maximize calorie burn and accelerate fat loss.',
      difficulty: Difficulty.INTERMEDIATE,
      goal: ProgramGoal.WEIGHT_LOSS,
      weeks: Array.from({ length: 6 }, (_, wi) => ({
        days: [
          {
            title: 'HIIT Cardio',
            exercises: [
              { exerciseId: burpees, order: 1, sets: 4, reps: 10 + wi, restTime: 30 },
              { exerciseId: jumpRope, order: 2, sets: 4, reps: undefined, restTime: 30 },
            ],
          },
          {
            title: 'Upper Body + Core',
            exercises: [
              { exerciseId: pushUp, order: 1, sets: 4, reps: 15 + wi, restTime: 60 },
              { exerciseId: dumbbellRow, order: 2, sets: 4, reps: 12, restTime: 60 },
              { exerciseId: russianTwists, order: 3, sets: 3, reps: 20, restTime: 45 },
            ],
          },
          { title: 'Active Recovery', isRestDay: true },
          {
            title: 'Lower Body Circuit',
            exercises: [
              { exerciseId: walkingLunges, order: 1, sets: 4, reps: 16, restTime: 60 },
              { exerciseId: legPress, order: 2, sets: 3, reps: 15, restTime: 60 },
              { exerciseId: calfRaises, order: 3, sets: 3, reps: 20, restTime: 45 },
            ],
          },
          {
            title: 'Full Body Cardio',
            exercises: [
              { exerciseId: rowing, order: 1, sets: 3, reps: undefined, restTime: 60 },
              { exerciseId: burpees, order: 2, sets: 3, reps: 10 + wi, restTime: 45 },
              { exerciseId: plank, order: 3, sets: 3, reps: undefined, restTime: 30 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Intermediate Muscle Builder',
      description:
        'An 8-week progressive overload program targeting hypertrophy with compound movements and isolation work. Split into Push, Pull, and Legs.',
      difficulty: Difficulty.INTERMEDIATE,
      goal: ProgramGoal.MUSCLE_GAIN,
      weeks: Array.from({ length: 8 }, (_, wi) => ({
        days: [
          {
            title: 'Push (Chest, Shoulders, Triceps)',
            exercises: [
              {
                exerciseId: benchPress,
                order: 1,
                sets: 4,
                reps: 10 - Math.floor(wi / 3),
                restTime: 90,
              },
              { exerciseId: overheadPress, order: 2, sets: 3, reps: 10, restTime: 90 },
              { exerciseId: pushUp, order: 3, sets: 3, reps: 15, restTime: 60 },
            ],
          },
          {
            title: 'Pull (Back, Biceps)',
            exercises: [
              { exerciseId: pullUp, order: 1, sets: 4, reps: 8, restTime: 90 },
              { exerciseId: dumbbellRow, order: 2, sets: 4, reps: 12, restTime: 90 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Legs',
            exercises: [
              { exerciseId: squat, order: 1, sets: 4, reps: 8, restTime: 120 },
              { exerciseId: walkingLunges, order: 2, sets: 3, reps: 12, restTime: 90 },
              { exerciseId: legPress, order: 3, sets: 3, reps: 15, restTime: 90 },
              { exerciseId: calfRaises, order: 4, sets: 3, reps: 20, restTime: 60 },
            ],
          },
          {
            title: 'Push (Volume)',
            exercises: [
              { exerciseId: benchPress, order: 1, sets: 3, reps: 12, restTime: 75 },
              { exerciseId: overheadPress, order: 2, sets: 3, reps: 12, restTime: 75 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Active Recovery / Cardio', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Intermediate Barbell Strength',
      description:
        'Focus heavily on the main barbell lifts. A 5x5 style progression scheme for intermediate lifters wanting to get seriously strong.',
      difficulty: Difficulty.INTERMEDIATE,
      goal: ProgramGoal.STRENGTH,
      weeks: Array.from({ length: 6 }, (_, wi) => ({
        days: [
          {
            title: 'Squat & Push',
            exercises: [
              { exerciseId: squat, order: 1, sets: 5, reps: 5, restTime: 150 },
              { exerciseId: benchPress, order: 2, sets: 5, reps: 5, restTime: 150 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Deadlift & Pull',
            exercises: [
              { exerciseId: deadlift, order: 1, sets: 5, reps: 5, restTime: 180 },
              { exerciseId: pullUp, order: 2, sets: 3, reps: 8, restTime: 120 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Overhead & Accessory',
            exercises: [
              { exerciseId: overheadPress, order: 1, sets: 5, reps: 5, restTime: 150 },
              { exerciseId: dumbbellRow, order: 2, sets: 3, reps: 10, restTime: 90 },
              { exerciseId: plank, order: 3, sets: 3, reps: undefined, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Intermediate Endurance Base',
      description:
        'Build your aerobic base with progressive cardio intervals and functional strength sessions. Ideal for anyone training for a 5K or wanting better stamina.',
      difficulty: Difficulty.INTERMEDIATE,
      goal: ProgramGoal.ENDURANCE,
      weeks: Array.from({ length: 6 }, (_, wi) => ({
        days: [
          {
            title: 'Steady-State Cardio',
            exercises: [
              { exerciseId: running, order: 1, sets: 3 + wi, reps: undefined, restTime: 60 },
            ],
          },
          {
            title: 'Functional Strength',
            exercises: [
              { exerciseId: pushUp, order: 1, sets: 3, reps: 15, restTime: 60 },
              { exerciseId: squat, order: 2, sets: 3, reps: 15, restTime: 60 },
              { exerciseId: plank, order: 3, sets: 3, reps: undefined, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Interval Cardio',
            exercises: [
              { exerciseId: cycling, order: 1, sets: 2 + wi, reps: undefined, restTime: 45 },
              { exerciseId: jumpRope, order: 2, sets: 3, reps: undefined, restTime: 30 },
            ],
          },
          {
            title: 'Rowing + Core',
            exercises: [
              { exerciseId: rowing, order: 1, sets: 3, reps: undefined, restTime: 60 },
              { exerciseId: russianTwists, order: 2, sets: 3, reps: 20, restTime: 45 },
              { exerciseId: hangingLegRaises, order: 3, sets: 3, reps: 12, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Intermediate General Strength',
      description:
        'A balanced full-body routine using compound lifts and accessories to improve total-body functional fitness and aesthetics.',
      difficulty: Difficulty.INTERMEDIATE,
      goal: ProgramGoal.GENERAL_FITNESS,
      weeks: Array.from({ length: 6 }, (_, wi) => ({
        days: [
          {
            title: 'Compound A',
            exercises: [
              { exerciseId: squat, order: 1, sets: 4, reps: 8, restTime: 120 },
              { exerciseId: benchPress, order: 2, sets: 4, reps: 8, restTime: 120 },
              { exerciseId: dumbbellRow, order: 3, sets: 3, reps: 10, restTime: 90 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Compound B',
            exercises: [
              { exerciseId: deadlift, order: 1, sets: 4, reps: 5, restTime: 150 },
              { exerciseId: overheadPress, order: 2, sets: 3, reps: 10, restTime: 90 },
              { exerciseId: pullUp, order: 3, sets: 3, reps: 8, restTime: 90 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Accessory + Core',
            exercises: [
              { exerciseId: walkingLunges, order: 1, sets: 3, reps: 12, restTime: 75 },
              { exerciseId: calfRaises, order: 2, sets: 3, reps: 20, restTime: 60 },
              { exerciseId: plank, order: 3, sets: 3, reps: undefined, restTime: 45 },
              { exerciseId: russianTwists, order: 4, sets: 3, reps: 20, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },

    // ─── ADVANCED PROGRAMS ────────────────────────────────────────────────────
    {
      title: 'Advanced Fat Loss & Conditioning',
      description:
        'A brutal 6-week conditioning program combining heavy HIIT, plyometrics, and metabolic resistance training for maximum fat loss.',
      difficulty: Difficulty.ADVANCED,
      goal: ProgramGoal.WEIGHT_LOSS,
      weeks: Array.from({ length: 6 }, (_, wi) => ({
        days: [
          {
            title: 'Plyometric Power',
            exercises: [
              { exerciseId: boxJumps, order: 1, sets: 5, reps: 8, restTime: 60 },
              { exerciseId: burpees, order: 2, sets: 5, reps: 15, restTime: 30 },
              { exerciseId: jumpRope, order: 3, sets: 5, reps: undefined, restTime: 30 },
            ],
          },
          {
            title: 'Metabolic Strength',
            exercises: [
              { exerciseId: deadlift, order: 1, sets: 4, reps: 8, restTime: 90 },
              { exerciseId: pushUp, order: 2, sets: 4, reps: 20, restTime: 45 },
              { exerciseId: pullUp, order: 3, sets: 4, reps: 10, restTime: 60 },
              { exerciseId: russianTwists, order: 4, sets: 3, reps: 30, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Rowing & Core',
            exercises: [
              { exerciseId: rowing, order: 1, sets: 5, reps: undefined, restTime: 45 },
              { exerciseId: hangingLegRaises, order: 2, sets: 4, reps: 15, restTime: 60 },
              { exerciseId: plank, order: 3, sets: 4, reps: undefined, restTime: 45 },
            ],
          },
          {
            title: 'Lower Body Power',
            exercises: [
              { exerciseId: squat, order: 1, sets: 4, reps: 10, restTime: 90 },
              { exerciseId: boxJumps, order: 2, sets: 4, reps: 10, restTime: 60 },
              { exerciseId: walkingLunges, order: 3, sets: 3, reps: 20, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Active Recovery', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Advanced Muscle Gain',
      description:
        'A high-volume PPL (Push/Pull/Legs) split across 10 weeks for maximising muscle hypertrophy. Combines heavy compound lifts with isolation.',
      difficulty: Difficulty.ADVANCED,
      goal: ProgramGoal.MUSCLE_GAIN,
      weeks: Array.from({ length: 10 }, (_, wi) => ({
        days: [
          {
            title: 'Push (Heavy)',
            exercises: [
              { exerciseId: benchPress, order: 1, sets: 5, reps: 6, restTime: 120 },
              { exerciseId: overheadPress, order: 2, sets: 4, reps: 8, restTime: 90 },
              { exerciseId: pushUp, order: 3, sets: 3, reps: 20, restTime: 60 },
            ],
          },
          {
            title: 'Pull (Heavy)',
            exercises: [
              { exerciseId: deadlift, order: 1, sets: 4, reps: 5, restTime: 180 },
              { exerciseId: pullUp, order: 2, sets: 4, reps: 8, restTime: 90 },
              { exerciseId: dumbbellRow, order: 3, sets: 3, reps: 12, restTime: 75 },
            ],
          },
          {
            title: 'Legs',
            exercises: [
              { exerciseId: squat, order: 1, sets: 5, reps: 8, restTime: 120 },
              { exerciseId: walkingLunges, order: 2, sets: 4, reps: 12, restTime: 90 },
              { exerciseId: legPress, order: 3, sets: 3, reps: 15, restTime: 90 },
              { exerciseId: calfRaises, order: 4, sets: 4, reps: 20, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Push (Volume)',
            exercises: [
              { exerciseId: benchPress, order: 1, sets: 3, reps: 12, restTime: 75 },
              { exerciseId: overheadPress, order: 2, sets: 3, reps: 12, restTime: 75 },
              { exerciseId: pushUp, order: 3, sets: 4, reps: 15, restTime: 60 },
            ],
          },
          {
            title: 'Pull (Volume)',
            exercises: [
              { exerciseId: pullUp, order: 1, sets: 4, reps: 10, restTime: 90 },
              { exerciseId: dumbbellRow, order: 2, sets: 4, reps: 15, restTime: 75 },
            ],
          },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Advanced Powerlifting Prep',
      description:
        'An intense 8-week program focused on maximising the Big Three — Squat, Bench, and Deadlift — through progressive overload and heavy sets.',
      difficulty: Difficulty.ADVANCED,
      goal: ProgramGoal.STRENGTH,
      weeks: Array.from({ length: 8 }, (_, wi) => ({
        days: [
          {
            title: 'Squat Day',
            exercises: [
              { exerciseId: squat, order: 1, sets: 5, reps: 5 - Math.floor(wi / 3), restTime: 180 },
              { exerciseId: walkingLunges, order: 2, sets: 3, reps: 10, restTime: 90 },
              { exerciseId: legPress, order: 3, sets: 3, reps: 12, restTime: 90 },
            ],
          },
          {
            title: 'Bench Day',
            exercises: [
              {
                exerciseId: benchPress,
                order: 1,
                sets: 5,
                reps: 5 - Math.floor(wi / 3),
                restTime: 180,
              },
              { exerciseId: overheadPress, order: 2, sets: 3, reps: 8, restTime: 120 },
              { exerciseId: pushUp, order: 3, sets: 3, reps: 20, restTime: 60 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Deadlift Day',
            exercises: [
              { exerciseId: deadlift, order: 1, sets: 5, reps: 3, restTime: 240 },
              { exerciseId: pullUp, order: 2, sets: 3, reps: 8, restTime: 120 },
              { exerciseId: dumbbellRow, order: 3, sets: 3, reps: 10, restTime: 90 },
            ],
          },
          {
            title: 'Accessory',
            exercises: [
              { exerciseId: hangingLegRaises, order: 1, sets: 4, reps: 12, restTime: 60 },
              { exerciseId: calfRaises, order: 2, sets: 4, reps: 20, restTime: 60 },
              { exerciseId: russianTwists, order: 3, sets: 3, reps: 20, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Advanced Endurance & Stamina',
      description:
        'An 8-week progressive program for athletes wanting to push their aerobic ceiling. Features long runs, rowing intervals, and functional strength.',
      difficulty: Difficulty.ADVANCED,
      goal: ProgramGoal.ENDURANCE,
      weeks: Array.from({ length: 8 }, (_, wi) => ({
        days: [
          {
            title: 'Long Cardio',
            exercises: [
              { exerciseId: running, order: 1, sets: 4 + wi, reps: undefined, restTime: 60 },
            ],
          },
          {
            title: 'Strength Circuit',
            exercises: [
              { exerciseId: squat, order: 1, sets: 3, reps: 15, restTime: 60 },
              { exerciseId: pullUp, order: 2, sets: 3, reps: 10, restTime: 60 },
              { exerciseId: pushUp, order: 3, sets: 3, reps: 20, restTime: 60 },
              { exerciseId: plank, order: 4, sets: 3, reps: undefined, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          {
            title: 'Rowing Intervals',
            exercises: [
              {
                exerciseId: rowing,
                order: 1,
                sets: 5 + Math.floor(wi / 2),
                reps: undefined,
                restTime: 45,
              },
              { exerciseId: jumpRope, order: 2, sets: 4, reps: undefined, restTime: 30 },
            ],
          },
          {
            title: 'Recovery Strength',
            exercises: [
              { exerciseId: cycling, order: 1, sets: 3, reps: undefined, restTime: 60 },
              { exerciseId: hangingLegRaises, order: 2, sets: 3, reps: 15, restTime: 60 },
              { exerciseId: russianTwists, order: 3, sets: 3, reps: 20, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
    {
      title: 'Advanced Tactical Athlete',
      description:
        'Ultimate general physical preparedness for military, police, and extreme athletes. Blends heavy lifts with grueling conditioning.',
      difficulty: Difficulty.ADVANCED,
      goal: ProgramGoal.GENERAL_FITNESS,
      weeks: Array.from({ length: 8 }, (_, wi) => ({
        days: [
          {
            title: 'Heavy Lower + Cardio',
            exercises: [
              { exerciseId: squat, order: 1, sets: 5, reps: 5, restTime: 150 },
              { exerciseId: running, order: 2, sets: 4, reps: undefined, restTime: 60 },
            ],
          },
          {
            title: 'Upper Strength',
            exercises: [
              { exerciseId: benchPress, order: 1, sets: 5, reps: 5, restTime: 120 },
              { exerciseId: pullUp, order: 2, sets: 5, reps: 10, restTime: 90 },
              { exerciseId: pushUp, order: 3, sets: 4, reps: 25, restTime: 60 },
            ],
          },
          { title: 'Active Recovery', isRestDay: true },
          {
            title: 'Grit & Conditioning',
            exercises: [
              { exerciseId: deadlift, order: 1, sets: 4, reps: 5, restTime: 180 },
              { exerciseId: burpees, order: 2, sets: 5, reps: 20, restTime: 60 },
              { exerciseId: boxJumps, order: 3, sets: 4, reps: 10, restTime: 60 },
            ],
          },
          {
            title: 'Core & Engine',
            exercises: [
              { exerciseId: rowing, order: 1, sets: 5, reps: undefined, restTime: 45 },
              { exerciseId: hangingLegRaises, order: 2, sets: 4, reps: 15, restTime: 60 },
              { exerciseId: plank, order: 3, sets: 3, reps: undefined, restTime: 45 },
            ],
          },
          { title: 'Rest Day', isRestDay: true },
          { title: 'Full Rest', isRestDay: true },
        ],
      })),
    },
  ];

  return PROGRAMS;
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding workout programs...');

  await prisma.userWorkoutProgram.deleteMany({});
  await prisma.workoutProgramExercise.deleteMany({});
  await prisma.workoutProgramDay.deleteMany({});
  await prisma.workoutProgramWeek.deleteMany({});
  await prisma.workoutProgram.deleteMany({});

  const programs = await buildPrograms();

  for (const program of programs) {
    const created = await prisma.workoutProgram.create({
      data: {
        title: program.title,
        description: program.description,
        difficulty: program.difficulty,
        goal: program.goal,
      },
    });

    for (let wi = 0; wi < program.weeks.length; wi++) {
      const week = program.weeks[wi];
      const createdWeek = await prisma.workoutProgramWeek.create({
        data: { programId: created.id, weekNumber: wi + 1 },
      });

      for (let di = 0; di < week.days.length; di++) {
        const day = week.days[di];
        const createdDay = await prisma.workoutProgramDay.create({
          data: {
            weekId: createdWeek.id,
            dayNumber: di + 1,
            title: day.title,
            isRestDay: day.isRestDay ?? false,
          },
        });

        if (!day.isRestDay && day.exercises) {
          for (const exercise of day.exercises) {
            await prisma.workoutProgramExercise.create({
              data: {
                dayId: createdDay.id,
                exerciseId: exercise.exerciseId,
                order: exercise.order,
                sets: exercise.sets,
                reps: exercise.reps ?? null,
                restTime: exercise.restTime ?? null,
              },
            });
          }
        }
      }
    }

    console.log(`  ✓ ${created.title} (${created.difficulty} | ${created.goal})`);
  }

  console.log(`\nSeeded ${programs.length} workout programs successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
