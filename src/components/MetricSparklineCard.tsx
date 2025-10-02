import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkline } from "./Sparkline";

interface MetricSparklineCardProps {
  title: string;
  currentScore: number;
  trend: number[];
  delta: number;
  onClick?: () => void;
}

export const MetricSparklineCard = ({
  title,
  currentScore,
  trend,
  delta,
  onClick
}: MetricSparklineCardProps) => {
  const getStatusText = () => {
    if (delta > 2) return "Improving";
    if (delta < -2) return "Declining";
    return "Stable";
  };

  const getStatusColor = () => {
    if (delta > 2) return "text-success";
    if (delta < -2) return "text-danger";
    return "text-muted-foreground";
  };

  const getTrendIcon = () => {
    if (delta > 2) return <TrendingUp className="w-4 h-4" />;
    if (delta < -2) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold">{currentScore}</span>
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {delta > 0 ? '+' : ''}{delta}
              </span>
            </div>
          </div>
          <div className={`${getStatusColor()}`}>
            {getTrendIcon()}
          </div>
        </div>
        
        <div className="mb-3">
          <Sparkline 
            data={trend} 
            width={200} 
            height={40}
            color={delta > 2 ? "hsl(var(--success))" : delta < -2 ? "hsl(var(--danger))" : "hsl(var(--muted-foreground))"}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">30-day trend</span>
          <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
