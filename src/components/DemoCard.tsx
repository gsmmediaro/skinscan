import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoCardProps {
  title: string;
  beforeScore: number;
  afterScore: number;
  timeframe: string;
  concerns: string[];
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export const DemoCard = ({
  title,
  beforeScore,
  afterScore,
  timeframe,
  concerns,
  imageUrl,
  onClick,
  className,
}: DemoCardProps) => {
  const improvement = afterScore - beforeScore;

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer group hover:shadow-glow transition-all duration-300 hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-video bg-gradient-subtle relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-primary/40" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">{beforeScore}</span>
          <ArrowRight className="w-3 h-3 text-primary" />
          <span className="text-sm font-bold text-success">{afterScore}</span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-display font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{timeframe}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${afterScore}%` }}
            />
          </div>
          <span className="text-sm font-bold text-success">+{improvement}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {concerns.map((concern, index) => (
            <span
              key={index}
              className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
            >
              {concern}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
          <span>See Full Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
};