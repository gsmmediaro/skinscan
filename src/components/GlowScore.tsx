import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export const GlowScore = ({ score, size = "lg", animate = true }: GlowScoreProps) => {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!animate) return;
    
    setIsAnimating(true);
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animate]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]";
    if (score >= 60) return "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
    return "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500/30 to-green-500/5";
    if (score >= 60) return "from-yellow-500/30 to-yellow-500/5";
    return "from-red-500/30 to-red-500/5";
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "#4ade80"; // green-400
    if (score >= 60) return "#facc15"; // yellow-400
    return "#f87171"; // red-400
  };

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const textSizes = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#262626"
          strokeWidth="8"
        />
        {/* Progress circle with glow */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getStrokeColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>

      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn(
          "font-display font-bold tracking-tight transition-all duration-300",
          textSizes[size],
          getScoreColor(score),
          animate && !isAnimating && displayScore === score && "animate-count-up"
        )}>
          {displayScore}
        </div>
        <div className="text-sm font-medium text-neutral-400 mt-1">
          Glow Score
        </div>
      </div>

      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 -z-10 rounded-full blur-3xl transition-opacity duration-500 bg-gradient-to-br",
        getScoreGradient(score),
        animate && isAnimating ? "opacity-40" : "opacity-60"
      )} />
    </div>
  );
};
