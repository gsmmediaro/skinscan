import { TrendingUp, TrendingDown } from "lucide-react";

interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  delta?: number;
  subtext?: string;
}

export const CircularProgress = ({ 
  score, 
  size = 200, 
  strokeWidth = 12,
  delta,
  subtext
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 86) return "#4ade80"; // green-400
    if (score >= 71) return "#4ade80"; // green-400
    if (score >= 41) return "#facc15"; // yellow-400
    return "#f87171"; // red-400
  };

  const getTextColor = (score: number) => {
    if (score >= 86) return "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]";
    if (score >= 71) return "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]";
    if (score >= 41) return "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
    return "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <defs>
            <filter id="glow-progress">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#262626"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle with glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter="url(#glow-progress)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold ${getTextColor(score)} animate-count-up`}>
            {score}
          </div>
          <div className="text-sm text-neutral-400 mt-1">Glow Score</div>
        </div>
      </div>
      
      {/* Delta and subtext */}
      {delta !== undefined && delta !== 0 && (
        <div className={`flex items-center gap-1 mt-4 ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {delta > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-semibold">{delta > 0 ? '+' : ''}{delta} from last scan</span>
        </div>
      )}

      {subtext && (
        <div className="text-sm text-neutral-400 mt-2">{subtext}</div>
      )}
    </div>
  );
};
