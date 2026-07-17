import { Droplets } from 'lucide-react';

interface WaterProgressRingProps {
  progress: number;
  consumedMl: number;
  goalMl: number;
}

export function WaterProgressRing({ progress, consumedMl, goalMl }: WaterProgressRingProps) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="h-64 w-64 -rotate-90 transform" viewBox="0 0 200 200">
        <circle
          className="text-muted stroke-current"
          strokeWidth="12"
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
        />
        <circle
          className="text-blue-500 stroke-current transition-all duration-500 ease-in-out"
          strokeWidth="12"
          strokeLinecap="round"
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <Droplets className="mb-2 size-8 text-blue-500" />
        <span className="text-4xl font-bold text-foreground">
          {Math.round(consumedMl)} <span className="text-xl text-muted-foreground">ml</span>
        </span>
        <span className="mt-1 text-sm font-medium text-muted-foreground">of {goalMl} ml goal</span>
      </div>
    </div>
  );
}
