interface TimelineStep {
  name: string;
  duration: string;
}

interface RoutineTimelineProps {
  steps: TimelineStep[];
  totalTime: string;
}

export const RoutineTimeline = ({ steps, totalTime }: RoutineTimelineProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Routine Timeline</h3>
        <span className="text-sm text-muted-foreground">Total: {totalTime}</span>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm mb-2 relative z-10">
                {idx + 1}
              </div>
              <div className="text-center max-w-[100px]">
                <p className="text-xs font-medium mb-1">{step.name}</p>
                <p className="text-xs text-muted-foreground">{step.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
