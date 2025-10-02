import { LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  unlockedAt?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

export const AchievementBadge = ({ 
  achievement, 
  size = "md",
  showProgress = true 
}: AchievementBadgeProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={cn(
            "rounded-full flex items-center justify-center transition-all duration-300",
            sizeClasses[size],
            achievement.unlocked
              ? "bg-gradient-to-br from-primary to-accent shadow-glow"
              : "bg-muted"
          )}
        >
          {achievement.unlocked ? (
            <span className={cn("animate-bounce-in", iconSizes[size])}>
              {achievement.icon}
            </span>
          ) : (
            <LockIcon className={cn("text-muted-foreground", iconSizes[size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl"])} />
          )}
        </div>
        
        {!achievement.unlocked && showProgress && achievement.progress > 0 && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full px-2">
            <div className="bg-background rounded-full h-1.5 overflow-hidden border border-border">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className={cn(
          "font-semibold",
          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base",
          achievement.unlocked ? "text-foreground" : "text-muted-foreground"
        )}>
          {achievement.name}
        </p>
        {size !== "sm" && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {achievement.description}
          </p>
        )}
        {achievement.unlocked && achievement.unlockedAt && size === "lg" && (
          <p className="text-xs text-success mt-1">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};