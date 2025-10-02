import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { subDays, format, isSameDay } from "date-fns";

interface StreakCalendarProps {
  scanDates: Date[];
  streakDays: number;
  className?: string;
}

export const StreakCalendar = ({ scanDates, streakDays, className }: StreakCalendarProps) => {
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, 29 - i));

  const isScanDay = (date: Date) => {
    return scanDates.some(scanDate => isSameDay(scanDate, date));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-bold">30-Day Activity</h3>
          <p className="text-sm text-muted-foreground">
            Current streak: <span className="font-semibold text-success">{streakDays} days</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {last30Days.map((date, index) => {
          const hasScan = isScanDay(date);
          const isToday = isSameDay(date, today);

          return (
            <div
              key={index}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center transition-all",
                hasScan
                  ? "bg-success/20 border-2 border-success"
                  : "bg-muted border border-border",
                isToday && "ring-2 ring-primary ring-offset-2"
              )}
              title={format(date, "MMM d, yyyy")}
            >
              {hasScan ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <Circle className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-success/20 border-2 border-success rounded" />
          <span>Scan completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-muted border border-border rounded" />
          <span>No scan</span>
        </div>
      </div>
    </div>
  );
};