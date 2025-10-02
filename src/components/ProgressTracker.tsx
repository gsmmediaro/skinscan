import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Flame } from "lucide-react";

export const ProgressTracker = () => {
  const [morningComplete, setMorningComplete] = useState(false);
  const [eveningComplete, setEveningComplete] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card className="p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-bold">7 Day Streak!</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={morningComplete}
            onCheckedChange={(checked) => setMorningComplete(checked as boolean)}
            id="morning"
          />
          <label htmlFor="morning" className="text-sm font-medium cursor-pointer">
            Morning routine completed
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            checked={eveningComplete}
            onCheckedChange={(checked) => setEveningComplete(checked as boolean)}
            id="evening"
          />
          <label htmlFor="evening" className="text-sm font-medium cursor-pointer">
            Evening routine completed
          </label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3 text-sm">Weekly View</h4>
        <div className="w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full scale-90 origin-top-left"
          />
        </div>
      </div>
    </Card>
  );
};
