import { Droplets } from 'lucide-react';

interface WaterProgressRingProps {
  progress: number;
  consumedMl: number;
  goalMl: number;
}

export function WaterProgressRing({ progress, consumedMl, goalMl }: WaterProgressRingProps) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, progress) / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="h-64 w-64 -rotate-90 transform" viewBox="0 0 200 200">
        <circle
          className="text-secondary stroke-current"
          strokeWidth="10"
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
        />
        <circle
          className="text-blue-500 stroke-current transition-all duration-500 ease-in-out"
          strokeWidth="10"
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
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 mb-2">
          <Droplets className="size-5" />
        </span>
        <span className="text-3xl font-extrabold tracking-tight text-foreground">
          {Math.round(consumedMl)}{' '}
          <span className="text-sm font-semibold text-muted-foreground">ml</span>
        </span>
        <span className="mt-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {Math.round(progress)}% of {goalMl} ml
        </span>
      </div>
    </div>
  );
}
