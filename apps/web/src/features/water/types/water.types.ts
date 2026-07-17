export interface WaterLog {
  id: string;
  amountMl: number;
  loggedAt: string;
  logDate: string;
}

export interface WaterSummary {
  goalMl: number;
  consumedMl: number;
  remainingMl: number;
  progress: number;
  logs: WaterLog[];
}

export interface WaterLogInput {
  amountMl: number;
  loggedAt: string;
}
