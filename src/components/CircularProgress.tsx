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
    if (score >= 86) return "hsl(var(--success))";
    if (score >= 71) return "hsl(var(--warning))";
    if (score >= 41) return "hsl(25, 95%, 61%)"; // Orange
    return "hsl(var(--danger))";
  };

  const getTextColor = (score: number) => {
    if (score >= 86) return "text-success";
    if (score >= 71) return "text-warning";
    if (score >= 41) return "text-[hsl(25,95%,61%)]";
    return "text-danger";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
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
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold ${getTextColor(score)} animate-count-up`}>
            {score}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Glow Score</div>
        </div>
      </div>
      
      {/* Delta and subtext */}
      {delta !== undefined && delta !== 0 && (
        <div className={`flex items-center gap-1 mt-4 ${delta > 0 ? 'text-success' : 'text-danger'}`}>
          {delta > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-semibold">{delta > 0 ? '+' : ''}{delta} from last scan</span>
        </div>
      )}
      
      {subtext && (
        <div className="text-sm text-muted-foreground mt-2">{subtext}</div>
      )}
    </div>
  );
};
