-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ChecklistItemCategory" AS ENUM ('WATER', 'SLEEP', 'WEIGHT', 'WORKOUT', 'NUTRITION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ChecklistSystemKey" AS ENUM ('WATER_GOAL', 'SLEEP_LOG', 'WEIGHT_LOG', 'WORKOUT_SESSION', 'NUTRITION_LOG');

-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('CARDIO', 'STRENGTH', 'FLEXIBILITY', 'BALANCE', 'PLYOMETRICS');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "ProgramGoal" AS ENUM ('WEIGHT_LOSS', 'MUSCLE_GAIN', 'STRENGTH', 'ENDURANCE', 'GENERAL_FITNESS');

-- CreateEnum
CREATE TYPE "HomeWorkoutGoal" AS ENUM ('WEIGHT_LOSS', 'MUSCLE_GAIN', 'STRENGTH', 'ENDURANCE', 'GENERAL_FITNESS', 'FLEXIBILITY');

-- CreateEnum
CREATE TYPE "HomeWorkoutStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "app_users" (
    "id" UUID NOT NULL,
    "supabase_user_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(150),
    "avatar_url" TEXT,
    "auth_provider" VARCHAR(50) NOT NULL DEFAULT 'google',
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "height_cm" DECIMAL(5,2),
    "target_weight_kg" DECIMAL(5,2),
    "timezone" VARCHAR(80) NOT NULL DEFAULT 'UTC',
    "profile_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "daily_water_goal_ml" INTEGER NOT NULL DEFAULT 2500,
    "daily_calorie_goal" INTEGER,
    "daily_sleep_goal_minutes" INTEGER NOT NULL DEFAULT 480,
    "enable_notifications" BOOLEAN NOT NULL DEFAULT true,
    "remind_water" BOOLEAN NOT NULL DEFAULT true,
    "remind_sleep" BOOLEAN NOT NULL DEFAULT true,
    "remind_weight" BOOLEAN NOT NULL DEFAULT true,
    "remind_workout" BOOLEAN NOT NULL DEFAULT true,
    "remind_nutrition" BOOLEAN NOT NULL DEFAULT true,
    "remind_checklist" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weight_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "weight_kg" DECIMAL(5,2) NOT NULL,
    "body_fat_percentage" DECIMAL(5,2),
    "muscle_mass_kg" DECIMAL(5,2),
    "logged_at" TIMESTAMPTZ(6) NOT NULL,
    "log_date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "weight_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bmi_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "bmi_value" DECIMAL(5,2) NOT NULL,
    "bmi_category" VARCHAR(50) NOT NULL,
    "logged_at" TIMESTAMPTZ(6) NOT NULL,
    "log_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "bmi_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount_ml" INTEGER NOT NULL,
    "logged_at" TIMESTAMPTZ(6) NOT NULL,
    "log_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "water_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sleep_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "quality_rating" SMALLINT,
    "log_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "sleep_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_workout_program_id" UUID,
    "program_day_id" UUID,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6),
    "duration_minutes" INTEGER,
    "calories_burned" INTEGER,
    "notes" TEXT,
    "log_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_exercises" (
    "id" UUID NOT NULL,
    "workout_session_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workout_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sets" (
    "id" UUID NOT NULL,
    "workout_exercise_id" UUID NOT NULL,
    "set_number" INTEGER NOT NULL,
    "reps" INTEGER,
    "weight" DECIMAL(5,2),
    "duration" INTEGER,
    "rest_time" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workout_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "meal_type" VARCHAR(50) NOT NULL,
    "log_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "meal_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_entries" (
    "id" UUID NOT NULL,
    "meal_log_id" UUID NOT NULL,
    "food_name" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(8,2) NOT NULL,
    "unit" VARCHAR(50) NOT NULL DEFAULT 'serving',
    "calories" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "protein_g" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "carbs_g" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "fat_g" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "meal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" "ChecklistItemCategory" NOT NULL DEFAULT 'CUSTOM',
    "system_key" "ChecklistSystemKey",
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_completions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "checklist_item_id" UUID NOT NULL,
    "completion_date" DATE NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "checklist_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ExerciseCategory" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "equipment" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "target_muscles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "secondary_muscles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mets" DOUBLE PRECISION,
    "instructions" TEXT NOT NULL,
    "tips" TEXT,
    "image_url" TEXT,
    "video_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_favorites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_programs" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "goal" "ProgramGoal" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workout_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_program_weeks" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "week_number" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_program_weeks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_program_days" (
    "id" UUID NOT NULL,
    "week_id" UUID NOT NULL,
    "day_number" INTEGER NOT NULL,
    "title" TEXT,
    "is_rest_day" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_program_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_program_exercises" (
    "id" UUID NOT NULL,
    "day_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER,
    "rest_time" INTEGER,

    CONSTRAINT "workout_program_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workout_programs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "current_week" INTEGER NOT NULL DEFAULT 1,
    "current_day" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_workout_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscle_groups" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "muscle_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_exercises" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "body_part" VARCHAR(100) NOT NULL,
    "equipment" VARCHAR(100) NOT NULL DEFAULT 'none',
    "calories_per_minute" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "default_duration" INTEGER,
    "default_reps" INTEGER,
    "rest_time" INTEGER,
    "home_friendly" BOOLEAN NOT NULL DEFAULT true,
    "thumbnail_url" TEXT,
    "gif_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "home_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_exercise_muscle_groups" (
    "exercise_id" UUID NOT NULL,
    "muscle_group_id" UUID NOT NULL,

    CONSTRAINT "home_exercise_muscle_groups_pkey" PRIMARY KEY ("exercise_id","muscle_group_id")
);

-- CreateTable
CREATE TABLE "home_workout_programs" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "goal" "HomeWorkoutGoal" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "estimated_minutes" INTEGER NOT NULL,
    "estimated_calories" INTEGER NOT NULL,
    "thumbnail" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "home_workout_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_workout_program_exercises" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "duration" INTEGER,
    "reps" INTEGER,
    "rest" INTEGER DEFAULT 30,

    CONSTRAINT "home_workout_program_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workout_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "program_id" UUID,
    "duration" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "completed_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "HomeWorkoutStatus" NOT NULL DEFAULT 'COMPLETED',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_workout_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workout_stats" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "total_workouts" INTEGER NOT NULL DEFAULT 0,
    "total_minutes" INTEGER NOT NULL DEFAULT 0,
    "total_calories" INTEGER NOT NULL DEFAULT 0,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_workout_date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_workout_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_exercise_favorites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "home_exercise_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_users_supabase_user_id_key" ON "app_users"("supabase_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_users_email_key" ON "app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "weight_logs_user_id_log_date_idx" ON "weight_logs"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "weight_logs_user_id_logged_at_idx" ON "weight_logs"("user_id", "logged_at");

-- CreateIndex
CREATE INDEX "bmi_logs_user_id_log_date_idx" ON "bmi_logs"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "water_logs_user_id_log_date_idx" ON "water_logs"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "sleep_logs_user_id_log_date_idx" ON "sleep_logs"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "workout_sessions_user_id_log_date_idx" ON "workout_sessions"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "workout_sessions_user_workout_program_id_idx" ON "workout_sessions"("user_workout_program_id");

-- CreateIndex
CREATE INDEX "workout_exercises_workout_session_id_idx" ON "workout_exercises"("workout_session_id");

-- CreateIndex
CREATE INDEX "workout_exercises_exercise_id_idx" ON "workout_exercises"("exercise_id");

-- CreateIndex
CREATE INDEX "workout_sets_workout_exercise_id_idx" ON "workout_sets"("workout_exercise_id");

-- CreateIndex
CREATE INDEX "meal_logs_user_id_log_date_idx" ON "meal_logs"("user_id", "log_date");

-- CreateIndex
CREATE UNIQUE INDEX "meal_logs_user_id_meal_type_log_date_key" ON "meal_logs"("user_id", "meal_type", "log_date");

-- CreateIndex
CREATE INDEX "meal_entries_meal_log_id_idx" ON "meal_entries"("meal_log_id");

-- CreateIndex
CREATE INDEX "checklist_items_user_id_sort_order_idx" ON "checklist_items"("user_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_items_user_id_system_key_key" ON "checklist_items"("user_id", "system_key");

-- CreateIndex
CREATE INDEX "checklist_completions_user_id_completion_date_idx" ON "checklist_completions"("user_id", "completion_date");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_completions_user_id_checklist_item_id_completion__key" ON "checklist_completions"("user_id", "checklist_item_id", "completion_date");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_favorites_user_id_exercise_id_key" ON "exercise_favorites"("user_id", "exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "muscle_groups_name_key" ON "muscle_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "muscle_groups_slug_key" ON "muscle_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "home_exercises_slug_key" ON "home_exercises"("slug");

-- CreateIndex
CREATE INDEX "home_exercises_slug_idx" ON "home_exercises"("slug");

-- CreateIndex
CREATE INDEX "home_exercises_difficulty_idx" ON "home_exercises"("difficulty");

-- CreateIndex
CREATE INDEX "home_exercises_body_part_idx" ON "home_exercises"("body_part");

-- CreateIndex
CREATE INDEX "home_workout_programs_goal_idx" ON "home_workout_programs"("goal");

-- CreateIndex
CREATE INDEX "home_workout_programs_difficulty_idx" ON "home_workout_programs"("difficulty");

-- CreateIndex
CREATE INDEX "home_workout_programs_is_featured_idx" ON "home_workout_programs"("is_featured");

-- CreateIndex
CREATE INDEX "home_workout_program_exercises_program_id_order_idx" ON "home_workout_program_exercises"("program_id", "order");

-- CreateIndex
CREATE INDEX "user_workout_history_user_id_completed_at_idx" ON "user_workout_history"("user_id", "completed_at");

-- CreateIndex
CREATE INDEX "user_workout_history_user_id_status_idx" ON "user_workout_history"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_workout_stats_user_id_key" ON "user_workout_stats"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "home_exercise_favorites_user_id_exercise_id_key" ON "home_exercise_favorites"("user_id", "exercise_id");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weight_logs" ADD CONSTRAINT "weight_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bmi_logs" ADD CONSTRAINT "bmi_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "water_logs" ADD CONSTRAINT "water_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sleep_logs" ADD CONSTRAINT "sleep_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_user_workout_program_id_fkey" FOREIGN KEY ("user_workout_program_id") REFERENCES "user_workout_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_session_id_fkey" FOREIGN KEY ("workout_session_id") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_entries" ADD CONSTRAINT "meal_entries_meal_log_id_fkey" FOREIGN KEY ("meal_log_id") REFERENCES "meal_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_completions" ADD CONSTRAINT "checklist_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_completions" ADD CONSTRAINT "checklist_completions_checklist_item_id_fkey" FOREIGN KEY ("checklist_item_id") REFERENCES "checklist_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_favorites" ADD CONSTRAINT "exercise_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_favorites" ADD CONSTRAINT "exercise_favorites_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_program_weeks" ADD CONSTRAINT "workout_program_weeks_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_program_days" ADD CONSTRAINT "workout_program_days_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "workout_program_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_program_exercises" ADD CONSTRAINT "workout_program_exercises_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "workout_program_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_program_exercises" ADD CONSTRAINT "workout_program_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workout_programs" ADD CONSTRAINT "user_workout_programs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workout_programs" ADD CONSTRAINT "user_workout_programs_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_exercise_muscle_groups" ADD CONSTRAINT "home_exercise_muscle_groups_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "home_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_exercise_muscle_groups" ADD CONSTRAINT "home_exercise_muscle_groups_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_workout_program_exercises" ADD CONSTRAINT "home_workout_program_exercises_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "home_workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_workout_program_exercises" ADD CONSTRAINT "home_workout_program_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "home_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workout_history" ADD CONSTRAINT "user_workout_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workout_history" ADD CONSTRAINT "user_workout_history_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "home_workout_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workout_stats" ADD CONSTRAINT "user_workout_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_exercise_favorites" ADD CONSTRAINT "home_exercise_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_exercise_favorites" ADD CONSTRAINT "home_exercise_favorites_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "home_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

