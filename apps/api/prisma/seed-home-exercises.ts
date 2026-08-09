import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

const MUSCLE_GROUPS = [
  { name: 'Chest', slug: 'chest' },
  { name: 'Back', slug: 'back' },
  { name: 'Shoulders', slug: 'shoulders' },
  { name: 'Core', slug: 'core' },
  { name: 'Legs', slug: 'legs' },
  { name: 'Arms', slug: 'arms' },
  { name: 'Glutes', slug: 'glutes' },
  { name: 'Cardio', slug: 'cardio' },
  { name: 'Stretch', slug: 'stretch' },
];

const EXERCISES = [
  // ── WARM-UP & MOBILITY ──────────────────────────────────────────────────────
  {
    name: 'Arm Circles',
    slug: 'arm-circles',
    description:
      'A gentle dynamic stretch designed to warm up the shoulder joints and increase blood flow to the upper body.',
    instructions:
      'Stand tall with your feet shoulder-width apart. Extend your arms straight out to the sides at shoulder height, palms facing down. Begin making small forward circles with your arms, gradually increasing the circle size. Reverse the direction to backward circles after 30 seconds. Keep your shoulders relaxed and down, away from your ears.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Shoulders',
    equipment: 'none',
    caloriesPerMinute: 3.5,
    defaultDuration: 60,
    defaultReps: null,
    restTime: 15,
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['arms'],
  },
  {
    name: 'Neck Rolls',
    slug: 'neck-rolls',
    description:
      'A mobility exercise to release tension and improve range of motion in the cervical spine.',
    instructions:
      'Sit or stand in a comfortable position with your back straight. Gently drop your chin toward your chest. Slowly roll your right ear toward your right shoulder, then tilt your head back, roll your left ear to your left shoulder, and return to the center. Move slowly and mindfully, avoiding any sudden movements or pinching sensations. Reverse direction after 3 repetitions.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Shoulders',
    equipment: 'none',
    caloriesPerMinute: 2.0,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 10,
    primaryMuscles: ['stretch'],
    secondaryMuscles: ['shoulders'],
  },
  {
    name: 'Cat-Cow Stretch',
    slug: 'cat-cow-stretch',
    description:
      'A classic yoga sequence that mobilizes the entire spine, stretching the torso and neck.',
    instructions:
      'Start on your hands and knees in a tabletop position, with wrists directly under shoulders and knees under hips. Inhale, drop your belly toward the mat, lift your chest and chin, looking up (Cow Pose). Exhale, draw your belly button to your spine, round your back toward the ceiling, and tuck your chin to your chest (Cat Pose). Flow smoothly between these poses with your breath.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 3.0,
    defaultDuration: 60,
    defaultReps: null,
    restTime: 15,
    primaryMuscles: ['core', 'stretch'],
    secondaryMuscles: ['back'],
  },
  {
    name: 'Bird Dog',
    slug: 'bird-dog',
    description:
      'A core-stabilizing exercise that strengthens the lower back, glutes, and shoulders while improving coordination.',
    instructions:
      'Begin in a tabletop position on your hands and knees. Keep your spine neutral and gaze down at the floor. Extend your right arm straight forward while simultaneously extending your left leg straight back. Hold for 2 seconds, keeping your hips parallel to the floor. Return to the starting position and repeat with your left arm and right leg.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 4.0,
    defaultDuration: 60,
    defaultReps: 12,
    restTime: 15,
    primaryMuscles: ['core', 'glutes'],
    secondaryMuscles: ['shoulders', 'back'],
  },
  {
    name: "World's Greatest Stretch",
    slug: 'worlds-greatest-stretch',
    description:
      'An all-in-one dynamic stretch that targets the thoracic spine, hip flexors, hamstrings, and calves.',
    instructions:
      'Step forward into a deep lunge with your left foot, dropping your hips. Place your right hand flat on the floor inside your left foot. Reach your left arm straight up toward the ceiling, twisting your torso to look at your hand. Squeeze your shoulder blades together. Lower your left elbow toward the inside of your left ankle for a deeper hip stretch, then step back and repeat on the other side.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Legs',
    equipment: 'none',
    caloriesPerMinute: 5.5,
    defaultDuration: 90,
    defaultReps: null,
    restTime: 20,
    primaryMuscles: ['stretch', 'legs'],
    secondaryMuscles: ['back', 'shoulders', 'glutes'],
  },
  {
    name: 'Dynamic Chest Opener',
    slug: 'dynamic-chest-opener',
    description:
      'A warm-up exercise to stretch the pectoral muscles and front deltoids before upper body work.',
    instructions:
      'Stand tall with feet hip-width apart. Extend your arms straight out in front of you. Swing both arms wide out to the sides, feeling a gentle stretch in your chest. Swing them back to the front, crossing one arm over the other. Repeat in a rhythmic, continuous motion, alternating which arm crosses on top each time.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Chest',
    equipment: 'none',
    caloriesPerMinute: 3.5,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 10,
    primaryMuscles: ['chest', 'stretch'],
    secondaryMuscles: ['shoulders'],
  },
  {
    name: 'Hip Circles',
    slug: 'hip-circles',
    description:
      'Mobilizes the hip joints, pelvic region, and lower back to prepare for lower body exercises.',
    instructions:
      'Stand with your feet slightly wider than hip-width apart, hands on your hips. Slowly rotate your hips in a circular motion, pushing them forward, to the side, backward, and to the other side. Make the circles as large and smooth as possible. Complete 10 rotations clockwise, then reverse the direction for another 10.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Legs',
    equipment: 'none',
    caloriesPerMinute: 3.0,
    defaultDuration: 60,
    defaultReps: null,
    restTime: 10,
    primaryMuscles: ['stretch'],
    secondaryMuscles: ['legs', 'glutes'],
  },

  // ── CHEST ───────────────────────────────────────────────────────────────────
  {
    name: 'Classic Push-up',
    slug: 'classic-push-up',
    description:
      'A foundational upper body compound movement targeting the chest, triceps, and anterior shoulders.',
    instructions:
      'Place your hands flat on the floor slightly wider than shoulder-width, with feet hip-width apart. Keep your body straight from head to heels, bracing your core and squeezing your glutes. Lower your chest until it nearly touches the floor, keeping your elbows tucked at a 45-degree angle. Push upward until your arms are fully extended.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Chest',
    equipment: 'none',
    caloriesPerMinute: 8.0,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 45,
    primaryMuscles: ['chest'],
    secondaryMuscles: ['arms', 'shoulders', 'core'],
  },
  {
    name: 'Incline Push-up',
    slug: 'incline-push-up',
    description:
      'An elevated push-up variation that shifts focus to the lower chest, reducing resistance for beginners.',
    instructions:
      'Place your hands shoulder-width apart on the edge of a sturdy chair or bench. Step your feet back until your body forms a straight line. Lower your chest toward the chair by bending your elbows. Push back up to the start position, focusing on engaging your lower chest and maintaining a tight core throughout.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Chest',
    equipment: 'chair',
    caloriesPerMinute: 6.5,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 45,
    primaryMuscles: ['chest'],
    secondaryMuscles: ['arms', 'shoulders', 'core'],
  },
  {
    name: 'Decline Push-up',
    slug: 'decline-push-up',
    description:
      'An advanced push-up placing feet on an elevated surface to target the upper chest and front shoulders.',
    instructions:
      'Place your hands flat on the floor, slightly wider than shoulder-width. Elevate both feet onto a sturdy chair behind you. Align your head, neck, hips, and heels. Lower your chest to the floor by bending your elbows. Maintain a strong plank position. Push back up dynamically without sagging your hips.',
    difficulty: Difficulty.ADVANCED,
    bodyPart: 'Chest',
    equipment: 'chair',
    caloriesPerMinute: 9.5,
    defaultDuration: null,
    defaultReps: 10,
    restTime: 60,
    primaryMuscles: ['chest', 'shoulders'],
    secondaryMuscles: ['arms', 'core'],
  },
  {
    name: 'Wide-Grip Push-up',
    slug: 'wide-grip-push-up',
    description:
      'A push-up variation with hand placement extra wide to place higher emphasis on the outer chest fibers.',
    instructions:
      'Setup in a plank position, but place your hands significantly wider than shoulder-width. Lower your chest toward the floor, keeping your elbows flaring slightly further than a standard push-up but avoiding shoulder pain. Press straight up back to the top. Focus on squeezing your chest muscles at the peak.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Chest',
    equipment: 'none',
    caloriesPerMinute: 8.5,
    defaultDuration: null,
    defaultReps: 12,
    restTime: 45,
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'core'],
  },
  {
    name: 'Diamond Push-up',
    slug: 'diamond-push-up',
    description:
      'A close-grip push-up variation that intensely targets the triceps and inner chest.',
    instructions:
      'Begin in a plank position. Place your hands close together directly under your chest, forming a diamond shape with your thumbs and index fingers. Lower your chest toward your hands, keeping your elbows tucked close to your ribs. Push your body back up, focusing on pushing through your triceps.',
    difficulty: Difficulty.ADVANCED,
    bodyPart: 'Chest',
    equipment: 'none',
    caloriesPerMinute: 9.0,
    defaultDuration: null,
    defaultReps: 10,
    restTime: 60,
    primaryMuscles: ['arms', 'chest'],
    secondaryMuscles: ['shoulders', 'core'],
  },
  {
    name: 'Wall Push-up',
    slug: 'wall-push-up',
    description:
      'A low-impact upper body exercise ideal for beginners, active recovery, or rehabilitation.',
    instructions:
      'Stand arms-length away facing a solid wall. Place your palms flat on the wall at shoulder height. Step your feet back slightly so your body is at a slight angle. Keep your body straight as you bend your elbows to bring your chest close to the wall. Press back out until arms are straight.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Chest',
    equipment: 'wall',
    caloriesPerMinute: 4.5,
    defaultDuration: null,
    defaultReps: 20,
    restTime: 30,
    primaryMuscles: ['chest'],
    secondaryMuscles: ['arms', 'shoulders'],
  },
  {
    name: 'Resistance Band Chest Press',
    slug: 'resistance-band-chest-press',
    description: 'Simulates a bench press using a resistance band anchored behind your back.',
    instructions:
      "Wrap the resistance band around your upper back, holding one end in each hand. Stand tall with your feet hip-width apart. Hold your hands at chest level, elbows bent at 90 degrees. Press your hands forward and inward, extending your arms fully against the band's tension. Squeeze your chest, then slowly return to start.",
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Chest',
    equipment: 'resistance band',
    caloriesPerMinute: 6.0,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 45,
    primaryMuscles: ['chest'],
    secondaryMuscles: ['arms', 'shoulders'],
  },

  // ── BACK ────────────────────────────────────────────────────────────────────
  {
    name: 'Superman Hold',
    slug: 'superman-hold',
    description:
      'An excellent bodyweight exercise targeting the lower back, glutes, and upper back muscles.',
    instructions:
      'Lie face down on a comfortable mat with arms extended straight overhead and legs straight behind you. Simultaneously lift your arms, chest, and thighs off the floor as high as comfortable. Squeeze your lower back and glutes at the top. Hold this position for the target duration, keeping your neck in a neutral line.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Back',
    equipment: 'none',
    caloriesPerMinute: 5.0,
    defaultDuration: 30,
    defaultReps: null,
    restTime: 30,
    primaryMuscles: ['back', 'glutes'],
    secondaryMuscles: ['core'],
  },
  {
    name: 'Prone Y-T-W Raises',
    slug: 'prone-ytw-raises',
    description:
      'A dynamic scapular control movement targeting the middle/lower traps and rear deltoids.',
    instructions:
      'Lie face down on the floor. First, extend arms at a 45-degree angle (forming a Y) and lift thumbs toward the ceiling. Lower down. Next, place arms straight to the sides (forming a T) and raise them up. Lower down. Finally, bend elbows at 90 degrees (forming a W) and pinch shoulder blades together, raising arms. Perform these raises consecutively.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Back',
    equipment: 'none',
    caloriesPerMinute: 4.5,
    defaultDuration: null,
    defaultReps: 12,
    restTime: 45,
    primaryMuscles: ['back', 'shoulders'],
    secondaryMuscles: ['arms'],
  },
  {
    name: 'Towel Row',
    slug: 'towel-row',
    description:
      'Uses isometric tension and a towel to engage the back muscles without any dumbbells.',
    instructions:
      'Sit on the floor with legs extended forward and knees slightly bent. Loop a long towel around the soles of your feet, holding the ends in each hand. Pull the towel towards your torso, creating strong counter-resistance by pushing forward with your feet. Squeeze your lat muscles and middle back. Return with control under tension.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Back',
    equipment: 'towel',
    caloriesPerMinute: 5.5,
    defaultDuration: null,
    defaultReps: 12,
    restTime: 45,
    primaryMuscles: ['back'],
    secondaryMuscles: ['arms', 'core'],
  },
  {
    name: 'Resistance Band Lat Pull-down',
    slug: 'resistance-band-lat-pull-down',
    description:
      'A pulling movement simulating a gym cable pulldown, utilizing a resistance band overhead.',
    instructions:
      'Hold a resistance band overhead, hands wider than shoulder-width apart. Extend your arms fully. Pull your elbows down and back toward your ribs, stretching the band across your upper chest. Focus on pulling from your back (lats) rather than your biceps. Pause, then slowly return to the overhead position.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Back',
    equipment: 'resistance band',
    caloriesPerMinute: 5.5,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 45,
    primaryMuscles: ['back'],
    secondaryMuscles: ['shoulders', 'arms'],
  },
  {
    name: 'Towel Face Pull',
    slug: 'towel-face-pull',
    description:
      'Focuses on the rear delts, rotator cuff, and upper back using a door anchor or high bar.',
    instructions:
      'Anchor a towel firmly around a door handle or sturdy bar. Hold the ends of the towel. Lean back slightly, keeping your body in a straight plank. Pull your hands towards your ears, flaring your elbows high and wide. Focus on pinching your shoulder blades together. Slowly extend your arms to return.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Back',
    equipment: 'towel',
    caloriesPerMinute: 6.0,
    defaultDuration: null,
    defaultReps: 12,
    restTime: 45,
    primaryMuscles: ['back', 'shoulders'],
    secondaryMuscles: ['arms'],
  },
  {
    name: 'Good Morning (Bodyweight)',
    slug: 'good-morning-bodyweight',
    description: 'A hip-hinge movement that strengthens the hamstrings, glutes, and lower back.',
    instructions:
      'Stand tall with feet hip-width apart. Place your fingertips lightly behind your head, elbows wide. Keeping a slight bend in your knees, hinge forward at your hips, pushing your glutes backward. Keep your back flat and chest up. Hinge down until your torso is parallel to the floor, then squeeze your glutes to stand.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Back',
    equipment: 'none',
    caloriesPerMinute: 4.0,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 30,
    primaryMuscles: ['back', 'legs'],
    secondaryMuscles: ['glutes'],
  },

  // ── SHOULDERS ───────────────────────────────────────────────────────────────
  {
    name: 'Pike Push-up',
    slug: 'pike-push-up',
    description: 'An advanced bodyweight press targeting the shoulders (deltoids) and upper chest.',
    instructions:
      'Start in a standard push-up position, then walk your feet forward, raising your hips high in the air so your body forms an inverted V-shape. Keep your back flat. Bend your elbows and lower the crown of your head toward the floor between your hands. Press through your shoulders to return to the start.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Shoulders',
    equipment: 'none',
    caloriesPerMinute: 8.5,
    defaultDuration: null,
    defaultReps: 10,
    restTime: 60,
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['arms', 'chest'],
  },
  {
    name: 'Wall-Assisted Handstand Hold',
    slug: 'wall-assisted-handstand-hold',
    description:
      'A static holds exercise against a wall to build elite shoulder stability, strength, and core control.',
    instructions:
      'Place your hands flat on the floor about a foot away from a solid wall. Kick your legs up so your heels rest lightly against the wall, or walk your feet up the wall. Press the floor away actively to keep shoulders strong. Keep your core tight and look between your hands. Hold for the designated time.',
    difficulty: Difficulty.ADVANCED,
    bodyPart: 'Shoulders',
    equipment: 'wall',
    caloriesPerMinute: 9.0,
    defaultDuration: 30,
    defaultReps: null,
    restTime: 60,
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['arms', 'core'],
  },
  {
    name: 'Resistance Band Lateral Raise',
    slug: 'resistance-band-lateral-raise',
    description:
      'Isolates the lateral deltoids to build shoulder width and definition using a band.',
    instructions:
      'Stand on the middle of a resistance band with feet hip-width apart. Hold the handles or ends in each hand by your sides. Keep your elbows slightly bent and torso stationary. Raise your arms out to the sides until they are parallel to the floor (shoulder height). Lower slowly against the band.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Shoulders',
    equipment: 'resistance band',
    caloriesPerMinute: 5.0,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 45,
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['arms'],
  },
  {
    name: 'Resistance Band Front Raise',
    slug: 'resistance-band-front-raise',
    description: 'Isolates the anterior (front) deltoids using a resistance band.',
    instructions:
      'Stand on a resistance band, holding one end in each hand in front of your thighs. Keep your back straight and core engaged. Raise your arms straight forward in front of you, keeping elbows locked or slightly bent, until hands reach shoulder height. Lower back down slowly.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Shoulders',
    equipment: 'resistance band',
    caloriesPerMinute: 5.0,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 45,
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['core'],
  },
  {
    name: 'Dolphin Pose Hold',
    slug: 'dolphin-pose-hold',
    description: 'A forearm-supported shoulder opener and strength builder.',
    instructions:
      'Start on your forearms and knees, with elbows directly under shoulders. Press forearms down, lift your hips high, and walk your toes forward, keeping knees straight if possible. Keep your head off the floor. Push through your shoulders to shift weight back toward your heels. Hold the position.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Shoulders',
    equipment: 'none',
    caloriesPerMinute: 4.5,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 30,
    primaryMuscles: ['shoulders', 'stretch'],
    secondaryMuscles: ['core', 'back'],
  },

  // ── ARMS ────────────────────────────────────────────────────────────────────
  {
    name: 'Chair Dips',
    slug: 'chair-dips',
    description:
      'An effective bodyweight exercise to isolate and strengthen the triceps using a standard chair.',
    instructions:
      'Sit on the edge of a sturdy chair. Place your hands on the edge next to your hips, fingers pointing forward. Slide your glutes off the chair, extending your legs forward. Bend your elbows to lower your body until upper arms are parallel to the floor. Push up to fully extend arms.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Arms',
    equipment: 'chair',
    caloriesPerMinute: 7.0,
    defaultDuration: null,
    defaultReps: 12,
    restTime: 45,
    primaryMuscles: ['arms'],
    secondaryMuscles: ['chest', 'shoulders'],
  },
  {
    name: 'Resistance Band Bicep Curl',
    slug: 'resistance-band-bicep-curl',
    description: 'Isolates the biceps using constant tension from a resistance band.',
    instructions:
      'Stand on a resistance band with one or both feet. Hold the ends of the band with an underhand grip (palms facing up). Keep your elbows pinned close to your torso. Flex at the elbows to pull your hands toward your shoulders, squeezing the biceps. Lower slowly back to start.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Arms',
    equipment: 'resistance band',
    caloriesPerMinute: 5.5,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 45,
    primaryMuscles: ['arms'],
    secondaryMuscles: [],
  },
  {
    name: 'Overhead Band Triceps Extension',
    slug: 'overhead-band-triceps-extension',
    description: 'Targets the long head of the triceps with overhead band extension.',
    instructions:
      'Stand on one end of the band. Reach behind your head, grasping the other end of the band with both hands, elbows pointing forward. Extend your elbows, pressing your hands straight up toward the ceiling. Keep your core tight and elbows tucked in. Lower back down slowly.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Arms',
    equipment: 'resistance band',
    caloriesPerMinute: 5.5,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 45,
    primaryMuscles: ['arms'],
    secondaryMuscles: ['shoulders'],
  },
  {
    name: 'Plank Press Up',
    slug: 'plank-press-up',
    description:
      'Alternates between forearm plank and high plank to build upper body and triceps power.',
    instructions:
      'Start in a forearm plank position. Place your right hand flat under your right shoulder, then press up, placing your left hand flat to transition to a high plank. Return to forearms by dropping down on your right side first, then left. Maintain a flat torso, preventing hip sway.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Arms',
    equipment: 'none',
    caloriesPerMinute: 8.0,
    defaultDuration: null,
    defaultReps: 12,
    restTime: 45,
    primaryMuscles: ['arms', 'core'],
    secondaryMuscles: ['chest', 'shoulders'],
  },

  // ── CORE & ABS ──────────────────────────────────────────────────────────────
  {
    name: 'Forearm Plank Hold',
    slug: 'forearm-plank-hold',
    description:
      'An essential isometric core stability exercise that strengthens the entire torso.',
    instructions:
      'Place your forearms on the floor, elbows aligned directly under your shoulders. Extend your legs straight behind you, feet hip-width apart. Lift your body up, creating a straight line from head to heels. Engage your abs, glutes, and quadriceps. Do not let your hips sag or hike up.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 4.5,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 30,
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'legs'],
  },
  {
    name: 'Bicycle Crunches',
    slug: 'bicycle-crunches',
    description: 'An excellent dynamic core exercise targeting the rectus abdominis and obliques.',
    instructions:
      'Lie flat on your back, knees bent at 90 degrees. Place hands lightly behind your head. Lift your shoulders off the floor. Twist your torso to bring your right elbow toward your left knee while extending your right leg straight. Alternate sides in a smooth, continuous pedaling motion.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 6.5,
    defaultDuration: null,
    defaultReps: 20,
    restTime: 30,
    primaryMuscles: ['core'],
    secondaryMuscles: [],
  },
  {
    name: 'Side Plank (Right)',
    slug: 'side-plank-right',
    description: 'Isolates the right lateral obliques and hip stabilizers in a static side bridge.',
    instructions:
      'Lie on your right side. Place your right elbow directly under your right shoulder. Stack your feet or place them heel-to-toe. Lift your hips off the floor, forming a straight diagonal line. Extend your left arm straight up. Hold this position, keeping your hips elevated and head neutral.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 4.0,
    defaultDuration: 30,
    defaultReps: null,
    restTime: 30,
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'glutes'],
  },
  {
    name: 'Side Plank (Left)',
    slug: 'side-plank-left',
    description: 'Isolates the left lateral obliques and hip stabilizers.',
    instructions:
      'Lie on your left side. Place your left elbow directly under your left shoulder. Stack your feet or place them heel-to-toe. Lift your hips off the floor, forming a straight diagonal line. Extend your right arm straight up. Hold this position, keeping your hips elevated and head neutral.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 4.0,
    defaultDuration: 30,
    defaultReps: null,
    restTime: 30,
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'glutes'],
  },
  {
    name: 'Russian Twists',
    slug: 'russian-twists',
    description:
      'A rotational core exercise that targets the obliques and improves abdominal stability.',
    instructions:
      'Sit on the floor, bend your knees, and lift your feet a few inches off the ground, balancing on your sit bones. Lean back slightly, keeping your spine straight. Join your hands in front of your chest. Twist your torso to the right, touching the floor, then twist to the left. Move with control.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 6.0,
    defaultDuration: null,
    defaultReps: 24,
    restTime: 30,
    primaryMuscles: ['core'],
    secondaryMuscles: [],
  },
  {
    name: 'Hollow Body Hold',
    slug: 'hollow-body-hold',
    description: 'A high-level gymnastics core hold requiring total body abdominal tension.',
    instructions:
      'Lie flat on your back, legs straight and arms extended overhead. Press your lower back firmly into the floor (no space underneath). Lift your shoulders, head, arms, and legs a few inches off the floor. Squeeze your inner thighs and point your toes. Hold this hollowed shape statically.',
    difficulty: Difficulty.ADVANCED,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 6.0,
    defaultDuration: 20,
    defaultReps: null,
    restTime: 45,
    primaryMuscles: ['core'],
    secondaryMuscles: [],
  },
  {
    name: 'Dead Bug',
    slug: 'dead-bug',
    description: 'A safe and highly effective anti-rotational core stabilization exercise.',
    instructions:
      'Lie flat on your back with arms pointing straight up to the ceiling. Lift your knees to a 90-degree table-top position. Press your lower back flat. Slowly lower your right arm overhead and left leg straight toward the floor without arching your back. Return to start; swap sides.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 3.5,
    defaultDuration: null,
    defaultReps: 12,
    restTime: 15,
    primaryMuscles: ['core'],
    secondaryMuscles: [],
  },
  {
    name: 'Flutter Kicks',
    slug: 'flutter-kicks',
    description: 'Fast, low-impact scissor kicks targeting the lower abs and hip flexors.',
    instructions:
      'Lie on your back, hands placed flat under your tailbone for support. Lift both legs about 6 inches off the floor, keeping them straight. Raise one leg slightly higher, then lower it while raising the other leg in an alternating, rapid fluttering motion. Keep lower back flat on the floor.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Core',
    equipment: 'none',
    caloriesPerMinute: 5.5,
    defaultDuration: 30,
    defaultReps: null,
    restTime: 20,
    primaryMuscles: ['core'],
    secondaryMuscles: ['legs'],
  },

  // ── LEGS ────────────────────────────────────────────────────────────────────
  {
    name: 'Bodyweight Squat',
    slug: 'bodyweight-squat',
    description:
      'The fundamental lower-body exercise targeting the quadriceps, hamstrings, and glutes.',
    instructions:
      'Stand tall with feet shoulder-width apart, toes pointed slightly outward. Keeping your chest up and core engaged, bend your knees and push your hips back as if sitting in a chair. Squat down until thighs are parallel to the floor. Drive through your heels to return to standing.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Legs',
    equipment: 'none',
    caloriesPerMinute: 6.5,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 30,
    primaryMuscles: ['legs'],
    secondaryMuscles: ['glutes', 'core'],
  },
  {
    name: 'Bulgarian Split Squat',
    slug: 'bulgarian-split-squat',
    description:
      'A brutal unilateral leg movement targeting the quadriceps and glutes using a chair.',
    instructions:
      'Stand about two feet in front of a sturdy chair. Extend one leg back, placing the top of your foot flat on the seat of the chair. Keep your chest high. Lower your hips until your back knee is a few inches from the floor, bending the front knee at 90 degrees. Press back up through front heel.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Legs',
    equipment: 'chair',
    caloriesPerMinute: 8.0,
    defaultDuration: null,
    defaultReps: 10,
    restTime: 45,
    primaryMuscles: ['legs', 'glutes'],
    secondaryMuscles: ['core'],
  },
  {
    name: 'Wall Sit Hold',
    slug: 'wall-sit-hold',
    description: 'An isometric leg burner targeting thigh endurance against a wall.',
    instructions:
      'Stand with your back flat against a wall, feet about two feet away. Slide down the wall until your hips and knees are at 90-degree angles, parallel to the floor. Keep your back and shoulders flat against the wall, hands by your sides or on chest. Hold this posture.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Legs',
    equipment: 'wall',
    caloriesPerMinute: 5.0,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 30,
    primaryMuscles: ['legs'],
    secondaryMuscles: ['glutes'],
  },
  {
    name: 'Walking Lunges',
    slug: 'walking-lunges',
    description: 'A dynamic traveling lunge to build quad, glute, and hamstring coordination.',
    instructions:
      'Stand tall with feet hip-width apart. Step forward with your right foot, lowering your hips until your front thigh is parallel to the floor and back knee nearly touches. Push off your left foot, stepping directly forward into a lunge with the left foot. Repeat in a walking path.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Legs',
    equipment: 'none',
    caloriesPerMinute: 7.5,
    defaultDuration: null,
    defaultReps: 16,
    restTime: 45,
    primaryMuscles: ['legs', 'glutes'],
    secondaryMuscles: ['core'],
  },
  {
    name: 'Calf Raises',
    slug: 'calf-raises',
    description: 'Builds size and muscular endurance in the gastrocnemius and soleus (calves).',
    instructions:
      'Stand flat on the floor near a wall or chair for balance. Place feet hip-width apart. Push down through the balls of your feet, lifting your heels as high as possible. Hold for a split second, feeling a hard contraction in your calves, then lower down slowly.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Legs',
    equipment: 'none',
    caloriesPerMinute: 3.5,
    defaultDuration: null,
    defaultReps: 25,
    restTime: 20,
    primaryMuscles: ['legs'],
    secondaryMuscles: [],
  },
  {
    name: 'Single Leg Calf Raise',
    slug: 'single-leg-calf-raise',
    description: 'An advanced calf isolation raise focused on individual leg strength.',
    instructions:
      'Stand on one foot flat on the floor, bending the other knee behind you. Hold a wall lightly for support. Press upward through the ball of the standing foot, contracting your calf hard. Lower down slowly. Perform all reps on one leg before swapping to the other.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Legs',
    equipment: 'none',
    caloriesPerMinute: 4.5,
    defaultDuration: null,
    defaultReps: 15,
    restTime: 30,
    primaryMuscles: ['legs'],
    secondaryMuscles: [],
  },
  {
    name: 'Glute Bridge',
    slug: 'glute-bridge',
    description: 'Excellent posterior chain activation targeting glute and hamstring engagement.',
    instructions:
      'Lie on your back, knees bent, feet flat on the floor hip-width apart. Keeping arms flat by your sides, drive through your heels to lift your hips toward the ceiling. Squeeze your glutes tightly at the top, forming a straight line from knees to shoulders. Lower back down slowly.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Legs',
    equipment: 'none',
    caloriesPerMinute: 4.5,
    defaultDuration: null,
    defaultReps: 20,
    restTime: 30,
    primaryMuscles: ['glutes', 'legs'],
    secondaryMuscles: ['core'],
  },
  {
    name: 'Single-Leg Glute Bridge',
    slug: 'single-leg-glute-bridge',
    description:
      'Intensifies the glute bridge by using one leg to drive the motion, correcting muscle imbalances.',
    instructions:
      'Lie on your back with knees bent, feet flat. Extend your right leg straight up into the air. Push through your left heel to lift your hips off the floor, squeezing the left glute. Keep hips level. Lower back down under control. Finish reps, then switch legs.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Legs',
    equipment: 'none',
    caloriesPerMinute: 5.5,
    defaultDuration: null,
    defaultReps: 12,
    restTime: 30,
    primaryMuscles: ['glutes', 'legs'],
    secondaryMuscles: ['core'],
  },

  // ── CARDIO & HIIT ───────────────────────────────────────────────────────────
  {
    name: 'Jumping Jacks',
    slug: 'jumping-jacks',
    description: 'Classic full-body cardiovascular warm-up and calorie burner.',
    instructions:
      'Stand tall with your feet together, arms resting by your sides. In one explosive motion, jump your feet out to the sides while swinging your arms overhead, clapping hands. Jump back to the start, dropping your arms. Maintain a quick and steady pace.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Cardio',
    equipment: 'none',
    caloriesPerMinute: 8.0,
    defaultDuration: 60,
    defaultReps: null,
    restTime: 15,
    primaryMuscles: ['cardio'],
    secondaryMuscles: ['legs', 'shoulders'],
  },
  {
    name: 'High Knees',
    slug: 'high-knees',
    description:
      'A rapid cardio burst that drives your heart rate up while engaging hip flexors and core.',
    instructions:
      'Stand with feet hip-width apart. Begin jogging in place, but pull your knees up as high as possible toward your chest (aiming for hip height). Swing your arms rapidly in coordination with your legs. Stay on the balls of your feet, keeping your posture upright.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Cardio',
    equipment: 'none',
    caloriesPerMinute: 9.5,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 15,
    primaryMuscles: ['cardio'],
    secondaryMuscles: ['legs', 'core'],
  },
  {
    name: 'Mountain Climbers',
    slug: 'mountain-climbers',
    description:
      'A dynamic plank variation combining core stability with intense cardio conditioning.',
    instructions:
      'Start in a solid high plank position. Keeping your spine flat, drive your right knee toward your chest. Instantly switch legs, drawing the left knee in while extending the right leg back. Continue switching legs as rapidly as possible in a running motion.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Cardio',
    equipment: 'none',
    caloriesPerMinute: 9.0,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 15,
    primaryMuscles: ['cardio', 'core'],
    secondaryMuscles: ['shoulders', 'legs'],
  },
  {
    name: 'Burpees (Bodyweight)',
    slug: 'burpees-bodyweight',
    description: 'An advanced full-body conditioning routine combining a plank, push-up, and jump.',
    instructions:
      'Stand tall. Drop down, placing hands on the floor, and kick your feet back to a high plank. Perform a full push-up, touching chest to floor. Jump your feet back up to your hands, then leap into the air explosively, raising your hands overhead. Land softly.',
    difficulty: Difficulty.ADVANCED,
    bodyPart: 'Cardio',
    equipment: 'none',
    caloriesPerMinute: 11.5,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 30,
    primaryMuscles: ['cardio', 'chest'],
    secondaryMuscles: ['legs', 'arms', 'shoulders'],
  },
  {
    name: 'Skater Jumps',
    slug: 'skater-jumps',
    description: 'A lateral jumping exercise that builds lateral power, balance, and coordination.',
    instructions:
      'Stand on your right leg, knee slightly bent. Jump laterally to the left, landing softly on your left foot while sweeping your right leg behind you (like a speed skater). Swing your arms across your body. Immediately push off the left foot to jump back to the right.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Cardio',
    equipment: 'none',
    caloriesPerMinute: 8.5,
    defaultDuration: 45,
    defaultReps: null,
    restTime: 20,
    primaryMuscles: ['cardio', 'glutes'],
    secondaryMuscles: ['legs'],
  },
  {
    name: 'Squat Jumps',
    slug: 'squat-jumps',
    description: 'An explosive plyometric lower body movement to build power and raise heart rate.',
    instructions:
      'Perform a standard bodyweight squat, lowering until thighs are parallel. From the bottom, drive upwards explosively, jumping as high as possible. Swing your arms up for momentum. Land softly on the balls of your feet, immediately bending knees to absorb impact.',
    difficulty: Difficulty.INTERMEDIATE,
    bodyPart: 'Cardio',
    equipment: 'none',
    caloriesPerMinute: 10.0,
    defaultDuration: 30,
    defaultReps: null,
    restTime: 30,
    primaryMuscles: ['cardio', 'legs'],
    secondaryMuscles: ['glutes'],
  },

  // ── STRETCHING & COOL DOWN ──────────────────────────────────────────────────
  {
    name: "Child's Pose",
    slug: 'childs-pose',
    description:
      'A resting posture that stretches the hips, thighs, and lower back while calming the mind.',
    instructions:
      'Kneel on the floor, touch your big toes together, and sit on your heels. Separate your knees about hip-width apart. Fold forward, placing your torso between your thighs. Extend your arms straight forward on the floor, palms down. Rest your forehead flat on the mat.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Stretching',
    equipment: 'none',
    caloriesPerMinute: 2.0,
    defaultDuration: 60,
    defaultReps: null,
    primaryMuscles: ['stretch'],
    secondaryMuscles: ['back', 'shoulders'],
  },
  {
    name: 'Cobra Stretch',
    slug: 'cobra-stretch',
    description:
      'A yoga posture targeting front torso and abdominal stretches, while promoting spinal flexibility.',
    instructions:
      'Lie flat on your stomach, tops of feet flat on the floor. Place your palms under your shoulders. Keep your elbows tucked close to your body. Inhale and slowly press through your hands to lift your chest off the floor, arching your back slightly. Keep shoulders relaxed down.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Stretching',
    equipment: 'none',
    caloriesPerMinute: 2.5,
    defaultDuration: 45,
    defaultReps: null,
    primaryMuscles: ['stretch', 'core'],
    secondaryMuscles: ['back'],
  },
  {
    name: 'Kneeling Hip Flexor Stretch',
    slug: 'kneeling-hip-flexor-stretch',
    description:
      'Stretches the deep psoas and hip flexor muscles, reducing lower back tightness from sitting.',
    instructions:
      'Kneel on one knee, with the other foot flat in front, knee at 90 degrees. Squeeze your glute on the kneeling side and gently push your hips forward. Raise the arm on the kneeling side straight up and lean slightly to the opposite side to deepen the stretch. Swap sides.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Stretching',
    equipment: 'none',
    caloriesPerMinute: 2.0,
    defaultDuration: 60,
    defaultReps: null,
    primaryMuscles: ['stretch'],
    secondaryMuscles: ['legs'],
  },
  {
    name: 'Seated Hamstring Stretch',
    slug: 'seated-hamstring-stretch',
    description: 'An easy seated stretch to relieve hamstring and lower back tightness.',
    instructions:
      'Sit on the floor, extending your right leg straight out. Tuck your left foot against your inner right thigh. Keep your back straight, hinge at your hips, and reach your hands forward toward your right toes. Hold when you feel a gentle stretch, breathing deeply. Swap legs.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Stretching',
    equipment: 'none',
    caloriesPerMinute: 2.0,
    defaultDuration: 60,
    defaultReps: null,
    primaryMuscles: ['stretch'],
    secondaryMuscles: ['legs', 'back'],
  },
  {
    name: 'Doorway Chest Stretch',
    slug: 'doorway-chest-stretch',
    description: 'Uses a wall or doorway to open up tight pectoral muscles.',
    instructions:
      'Stand in a doorway or near a wall corner. Place your forearm flat against the doorway frame, with elbow bent at 90 degrees at shoulder height. Step forward slightly with one foot until you feel a gentle stretch across your chest and front shoulder. Hold, then swap sides.',
    difficulty: Difficulty.BEGINNER,
    bodyPart: 'Stretching',
    equipment: 'wall',
    caloriesPerMinute: 2.0,
    defaultDuration: 45,
    defaultReps: null,
    primaryMuscles: ['stretch', 'chest'],
    secondaryMuscles: ['shoulders'],
  },
];

async function main() {
  console.log('Seeding muscle groups...');
  // Seed Muscle Groups
  const seededMuscleGroups = [];
  for (const mg of MUSCLE_GROUPS) {
    const record = await prisma.muscleGroup.upsert({
      where: { slug: mg.slug },
      update: {},
      create: {
        name: mg.name,
        slug: mg.slug,
      },
    });
    seededMuscleGroups.push(record);
  }
  console.log(`Seeded ${seededMuscleGroups.length} muscle groups.`);

  // Create a map of slug to id
  const muscleGroupMap = new Map<string, string>();
  for (const mg of seededMuscleGroups) {
    muscleGroupMap.set(mg.slug, mg.id);
  }

  console.log('Cleaning up existing home exercises...');
  // Delete existing relation records and home exercises
  await prisma.homeExerciseMuscleGroup.deleteMany({});
  await prisma.homeExercise.deleteMany({});

  console.log(`Seeding ${EXERCISES.length} home exercises...`);
  for (const ex of EXERCISES) {
    const created = await prisma.homeExercise.create({
      data: {
        name: ex.name,
        slug: ex.slug,
        description: ex.description,
        instructions: ex.instructions,
        difficulty: ex.difficulty,
        bodyPart: ex.bodyPart,
        equipment: ex.equipment,
        caloriesPerMinute: ex.caloriesPerMinute,
        defaultDuration: ex.defaultDuration,
        defaultReps: ex.defaultReps,
        restTime: ex.restTime ?? 30,
        homeFriendly: true,
        isActive: true,
      },
    });

    // Link primary muscles
    for (const slug of ex.primaryMuscles) {
      const mgId = muscleGroupMap.get(slug);
      if (mgId) {
        await prisma.homeExerciseMuscleGroup.create({
          data: {
            exerciseId: created.id,
            muscleGroupId: mgId,
          },
        });
      }
    }

    // Link secondary muscles
    for (const slug of ex.secondaryMuscles) {
      const mgId = muscleGroupMap.get(slug);
      if (mgId) {
        // Prevent duplicate link if it's already in primary
        if (!ex.primaryMuscles.includes(slug)) {
          await prisma.homeExerciseMuscleGroup.create({
            data: {
              exerciseId: created.id,
              muscleGroupId: mgId,
            },
          });
        }
      }
    }
  }

  console.log('Successfully seeded home exercises database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
