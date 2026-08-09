export type UserProfile = {
  id: string;
  userId: string;
  heightCm: number | null;
  targetWeightKg: number | null;
  timezone: string;
  profileCompleted: boolean;
};

export type UpdateProfileInput = {
  heightCm: number | null;
  targetWeightKg: number | null;
  timezone: string;
};
