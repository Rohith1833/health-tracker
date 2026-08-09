import { PrismaClient, Difficulty, HomeWorkoutGoal } from '@prisma/client';

const prisma = new PrismaClient();

const PROGRAMS = [
  // ── BEGINNER ───────────────────────────────────────────────────────────────
  {
    title: 'Full Body Beginner',
    description:
      'A gentle introduction to full-body strength and mobility. Focuses on proper form and consistency.',
    difficulty: Difficulty.BEGINNER,
    goal: HomeWorkoutGoal.GENERAL_FITNESS,
    estimatedMinutes: 20,
    estimatedCalories: 120,
    isFeatured: true,
    exercises: [
      { slug: 'arm-circles', duration: 45, reps: null, rest: 15 },
      { slug: 'bodyweight-squat', duration: null, reps: 10, rest: 30 },
      { slug: 'classic-push-up', duration: null, reps: 8, rest: 45 },
      { slug: 'superman-hold', duration: 30, reps: null, rest: 30 },
      { slug: 'forearm-plank-hold', duration: 30, reps: null, rest: 30 },
      { slug: 'childs-pose', duration: 60, reps: null, rest: 0 },
    ],
  },
  {
    title: 'Morning Routine',
    description:
      'Wake up your mind and body with dynamic stretching and light activation movements.',
    difficulty: Difficulty.BEGINNER,
    goal: HomeWorkoutGoal.FLEXIBILITY,
    estimatedMinutes: 10,
    estimatedCalories: 50,
    isFeatured: false,
    exercises: [
      { slug: 'neck-rolls', duration: 30, reps: null, rest: 10 },
      { slug: 'arm-circles', duration: 30, reps: null, rest: 10 },
      { slug: 'cat-cow-stretch', duration: 60, reps: null, rest: 15 },
      { slug: 'bird-dog', duration: null, reps: 10, rest: 15 },
      { slug: 'glute-bridge', duration: null, reps: 12, rest: 20 },
      { slug: 'cobra-stretch', duration: 45, reps: null, rest: 0 },
    ],
  },
  {
    title: 'Beginner Fat Burn',
    description:
      'Light cardiovascular intervals mixed with bodyweight movements to elevate heart rate and burn calories.',
    difficulty: Difficulty.BEGINNER,
    goal: HomeWorkoutGoal.WEIGHT_LOSS,
    estimatedMinutes: 15,
    estimatedCalories: 110,
    isFeatured: false,
    exercises: [
      { slug: 'jumping-jacks', duration: 45, reps: null, rest: 15 },
      { slug: 'bodyweight-squat', duration: null, reps: 12, rest: 20 },
      { slug: 'high-knees', duration: 30, reps: null, rest: 15 },
      { slug: 'wall-sit-hold', duration: 30, reps: null, rest: 20 },
      { slug: 'jumping-jacks', duration: 45, reps: null, rest: 15 },
      { slug: 'childs-pose', duration: 45, reps: null, rest: 0 },
    ],
  },
  {
    title: 'Beginner Core',
    description:
      'Establish foundational abdominal strength and spinal stability with controlled activation drills.',
    difficulty: Difficulty.BEGINNER,
    goal: HomeWorkoutGoal.GENERAL_FITNESS,
    estimatedMinutes: 12,
    estimatedCalories: 60,
    isFeatured: false,
    exercises: [
      { slug: 'dead-bug', duration: null, reps: 10, rest: 15 },
      { slug: 'side-plank-left', duration: 20, reps: null, rest: 15 },
      { slug: 'side-plank-right', duration: 20, reps: null, rest: 15 },
      { slug: 'bicycle-crunches', duration: null, reps: 12, rest: 20 },
      { slug: 'forearm-plank-hold', duration: 30, reps: null, rest: 20 },
      { slug: 'cobra-stretch', duration: 30, reps: null, rest: 0 },
    ],
  },
  {
    title: '7 Minute Workout',
    description: 'The scientifically proven quick full-body circuit designed for busy schedules.',
    difficulty: Difficulty.BEGINNER,
    goal: HomeWorkoutGoal.GENERAL_FITNESS,
    estimatedMinutes: 7,
    estimatedCalories: 70,
    isFeatured: false,
    exercises: [
      { slug: 'jumping-jacks', duration: 30, reps: null, rest: 10 },
      { slug: 'wall-sit-hold', duration: 30, reps: null, rest: 10 },
      { slug: 'classic-push-up', duration: 30, reps: null, rest: 10 },
      { slug: 'bicycle-crunches', duration: 30, reps: null, rest: 10 },
      { slug: 'bodyweight-squat', duration: 30, reps: null, rest: 10 },
      { slug: 'forearm-plank-hold', duration: 30, reps: null, rest: 10 },
    ],
  },

  // ── INTERMEDIATE ───────────────────────────────────────────────────────────
  {
    title: 'Full Body Intermediate',
    description:
      'A well-rounded routine utilizing progression movements to challenge endurance and muscle building.',
    difficulty: Difficulty.INTERMEDIATE,
    goal: HomeWorkoutGoal.GENERAL_FITNESS,
    estimatedMinutes: 25,
    estimatedCalories: 180,
    isFeatured: true,
    exercises: [
      { slug: 'worlds-greatest-stretch', duration: 60, reps: null, rest: 15 },
      { slug: 'bulgarian-split-squat', duration: null, reps: 10, rest: 30 },
      { slug: 'wide-grip-push-up', duration: null, reps: 12, rest: 45 },
      { slug: 'prone-ytw-raises', duration: null, reps: 12, rest: 30 },
      { slug: 'chair-dips', duration: null, reps: 10, rest: 30 },
      {
        slug: 'mountain-climppers',
        slugAlias: 'mountain-climbers',
        duration: 30,
        reps: null,
        rest: 30,
      },
    ],
  },
  {
    title: 'Strength Builder',
    description:
      'Uses resistance bands and towels to create tension and promote muscular hypertrophy at home.',
    difficulty: Difficulty.INTERMEDIATE,
    goal: HomeWorkoutGoal.STRENGTH,
    estimatedMinutes: 30,
    estimatedCalories: 210,
    isFeatured: false,
    exercises: [
      { slug: 'resistance-band-chest-press', duration: null, reps: 15, rest: 45 },
      { slug: 'resistance-band-lat-pull-down', duration: null, reps: 15, rest: 45 },
      { slug: 'resistance-band-lateral-raise', duration: null, reps: 12, rest: 30 },
      { slug: 'resistance-band-bicep-curl', duration: null, reps: 15, rest: 30 },
      { slug: 'bulgarian-split-squat', duration: null, reps: 12, rest: 45 },
      { slug: 'glute-bridge', duration: null, reps: 20, rest: 30 },
    ],
  },
  {
    title: 'Intermediate Cardio',
    description:
      'High-energy movements to build aerobic capacity, leg power, and athletic endurance.',
    difficulty: Difficulty.INTERMEDIATE,
    goal: HomeWorkoutGoal.ENDURANCE,
    estimatedMinutes: 22,
    estimatedCalories: 200,
    isFeatured: false,
    exercises: [
      { slug: 'jumping-jacks', duration: 60, reps: null, rest: 15 },
      { slug: 'squat-jumps', duration: 30, reps: null, rest: 30 },
      { slug: 'skater-jumps', duration: 40, reps: null, rest: 20 },
      {
        slug: 'mountain-climppers',
        slugAlias: 'mountain-climbers',
        duration: 45,
        reps: null,
        rest: 15,
      },
      { slug: 'high-knees', duration: 30, reps: null, rest: 15 },
      { slug: 'childs-pose', duration: 60, reps: null, rest: 0 },
    ],
  },
  {
    title: 'Intermediate Core',
    description:
      'Challenging rotational and stability core holds targeting obliques and deep abdominal muscles.',
    difficulty: Difficulty.INTERMEDIATE,
    goal: HomeWorkoutGoal.GENERAL_FITNESS,
    estimatedMinutes: 18,
    estimatedCalories: 100,
    isFeatured: false,
    exercises: [
      { slug: 'russian-twists', duration: null, reps: 20, rest: 20 },
      { slug: 'flutter-kicks', duration: 30, reps: null, rest: 20 },
      { slug: 'plank-press-up', duration: null, reps: 10, rest: 30 },
      { slug: 'side-plank-left', duration: 45, reps: null, rest: 15 },
      { slug: 'side-plank-right', duration: 45, reps: null, rest: 15 },
      { slug: 'cobra-stretch', duration: 45, reps: null, rest: 0 },
    ],
  },
  {
    title: 'Mobility Flow',
    description:
      'An active recovery routine focused on hip mobility, thoracic twists, and joint decompression.',
    difficulty: Difficulty.INTERMEDIATE,
    goal: HomeWorkoutGoal.FLEXIBILITY,
    estimatedMinutes: 15,
    estimatedCalories: 70,
    isFeatured: false,
    exercises: [
      { slug: 'worlds-greatest-stretch', duration: 90, reps: null, rest: 20 },
      { slug: 'dolphin-pose-hold', duration: 45, reps: null, rest: 30 },
      { slug: 'kneeling-hip-flexor-stretch', duration: 60, reps: null, rest: 15 },
      { slug: 'seated-hamstring-stretch', duration: 60, reps: null, rest: 15 },
      { slug: 'doorway-chest-stretch', duration: 45, reps: null, rest: 15 },
      { slug: 'childs-pose', duration: 60, reps: null, rest: 0 },
    ],
  },

  // ── ADVANCED ───────────────────────────────────────────────────────────────
  {
    title: 'HIIT Explosion',
    description:
      'An intense full-body high-intensity interval training protocol designed to maximize fat burn.',
    difficulty: Difficulty.ADVANCED,
    goal: HomeWorkoutGoal.WEIGHT_LOSS,
    estimatedMinutes: 20,
    estimatedCalories: 260,
    isFeatured: true,
    exercises: [
      { slug: 'jumping-jacks', duration: 45, reps: null, rest: 10 },
      { slug: 'burpees-bodyweight', duration: 40, reps: null, rest: 20 },
      { slug: 'squat-jumps', duration: 30, reps: null, rest: 15 },
      {
        slug: 'mountain-climppers',
        slugAlias: 'mountain-climbers',
        duration: 45,
        reps: null,
        rest: 15,
      },
      { slug: 'skater-jumps', duration: 45, reps: null, rest: 15 },
      { slug: 'decline-push-up', duration: null, reps: 12, rest: 30 },
    ],
  },
  {
    title: 'Athletic Conditioning',
    description: 'Plyometric power drills combined with core stabilization for advanced athletics.',
    difficulty: Difficulty.ADVANCED,
    goal: HomeWorkoutGoal.ENDURANCE,
    estimatedMinutes: 28,
    estimatedCalories: 240,
    isFeatured: false,
    exercises: [
      { slug: 'worlds-greatest-stretch', duration: 60, reps: null, rest: 15 },
      { slug: 'squat-jumps', duration: 45, reps: null, rest: 15 },
      { slug: 'plank-press-up', duration: null, reps: 15, rest: 30 },
      { slug: 'skater-jumps', duration: 45, reps: null, rest: 15 },
      { slug: 'hollow-body-hold', duration: 30, reps: null, rest: 30 },
      { slug: 'burpees-bodyweight', duration: 30, reps: null, rest: 30 },
    ],
  },
  {
    title: 'Advanced Strength',
    description:
      'Demanding calisthenics progressions (decline presses, handstands) to build raw physical power.',
    difficulty: Difficulty.ADVANCED,
    goal: HomeWorkoutGoal.STRENGTH,
    estimatedMinutes: 35,
    estimatedCalories: 230,
    isFeatured: false,
    exercises: [
      { slug: 'wall-assisted-handstand-hold', duration: 30, reps: null, rest: 60 },
      { slug: 'decline-push-up', duration: null, reps: 15, rest: 45 },
      { slug: 'diamond-push-up', duration: null, reps: 12, rest: 45 },
      { slug: 'single-leg-glute-bridge', duration: null, reps: 12, rest: 30 },
      { slug: 'single-leg-calf-raise', duration: null, reps: 15, rest: 30 },
      { slug: 'hollow-body-hold', duration: 30, reps: null, rest: 30 },
    ],
  },
  {
    title: 'Advanced Cardio',
    description: 'Long-duration cardio-intervals focusing on speed, agility, and lung capacity.',
    difficulty: Difficulty.ADVANCED,
    goal: HomeWorkoutGoal.ENDURANCE,
    estimatedMinutes: 30,
    estimatedCalories: 280,
    isFeatured: false,
    exercises: [
      { slug: 'jumping-jacks', duration: 60, reps: null, rest: 10 },
      { slug: 'high-knees', duration: 45, reps: null, rest: 15 },
      {
        slug: 'mountain-climppers',
        slugAlias: 'mountain-climbers',
        duration: 60,
        reps: null,
        rest: 15,
      },
      { slug: 'skater-jumps', duration: 45, reps: null, rest: 15 },
      { slug: 'burpees-bodyweight', duration: 30, reps: null, rest: 30 },
      { slug: 'childs-pose', duration: 60, reps: null, rest: 0 },
    ],
  },
  {
    title: 'Endurance Builder',
    description:
      'High repetition conditioning designed to increase fatigue threshold across all muscle groups.',
    difficulty: Difficulty.ADVANCED,
    goal: HomeWorkoutGoal.ENDURANCE,
    estimatedMinutes: 30,
    estimatedCalories: 250,
    isFeatured: false,
    exercises: [
      { slug: 'bodyweight-squat', duration: null, reps: 30, rest: 20 },
      { slug: 'classic-push-up', duration: null, reps: 20, rest: 30 },
      { slug: 'walking-lunges', duration: null, reps: 24, rest: 30 },
      { slug: 'chair-dips', duration: null, reps: 15, rest: 30 },
      { slug: 'russian-twists', duration: null, reps: 30, rest: 20 },
      { slug: 'jumping-jacks', duration: 60, reps: null, rest: 15 },
    ],
  },
];

async function main() {
  console.log('Fetching home exercise mappings...');
  const exercises = await prisma.homeExercise.findMany();
  const exerciseMap = new Map<string, string>();
  for (const ex of exercises) {
    exerciseMap.set(ex.slug, ex.id);
  }

  console.log('Cleaning up existing home workout programs...');
  await prisma.homeWorkoutProgramExercise.deleteMany({});
  await prisma.homeWorkoutProgram.deleteMany({});

  console.log(`Seeding ${PROGRAMS.length} home workout programs...`);

  for (const prog of PROGRAMS) {
    const createdProg = await prisma.homeWorkoutProgram.create({
      data: {
        title: prog.title,
        description: prog.description,
        difficulty: prog.difficulty,
        goal: prog.goal,
        estimatedMinutes: prog.estimatedMinutes,
        estimatedCalories: prog.estimatedCalories,
        isFeatured: prog.isFeatured,
        isActive: true,
      },
    });

    let order = 1;
    for (const exInfo of prog.exercises) {
      const slugToLookup = exInfo.slugAlias || exInfo.slug;
      const exerciseId = exerciseMap.get(slugToLookup);

      if (!exerciseId) {
        console.warn(
          `Warning: Exercise with slug "${slugToLookup}" not found. Skipping relation in program "${prog.title}".`,
        );
        continue;
      }

      await prisma.homeWorkoutProgramExercise.create({
        data: {
          programId: createdProg.id,
          exerciseId: exerciseId,
          order: order++,
          duration: exInfo.duration,
          reps: exInfo.reps,
          rest: exInfo.rest,
        },
      });
    }
  }

  console.log('Successfully seeded home workout programs database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
