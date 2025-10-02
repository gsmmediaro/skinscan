import { Card } from "@/components/ui/card";
import { Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface UGCVideoCardProps {
  userName: string;
  glowScore: number;
  transformationDays: number;
  quote: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  rating?: number;
  onClick?: () => void;
  className?: string;
}

export const UGCVideoCard = ({
  userName,
  glowScore,
  transformationDays,
  quote,
  thumbnailUrl,
  videoUrl,
  rating = 5,
  onClick,
  className,
}: UGCVideoCardProps) => {
  const handleClick = () => {
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer group hover:shadow-glow transition-all duration-300",
        className
      )}
      onClick={handleClick}
    >
      <div className="aspect-[9/16] bg-gradient-subtle relative overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`${userName}'s transformation`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Play className="w-16 h-16 text-primary/40" />
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-primary ml-1" />
          </div>
        </div>

        {/* Glow Score badge */}
        <div className="absolute top-3 right-3 bg-success rounded-full px-3 py-1.5 shadow-lg">
          <span className="text-sm font-bold text-success-foreground">{glowScore}</span>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs font-semibold">{transformationDays} days</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
          ))}
        </div>

        <p className="text-sm font-medium">{userName}</p>

        <p className="text-sm text-muted-foreground italic line-clamp-2">
          "{quote}"
        </p>
      </div>
    </Card>
  );
};