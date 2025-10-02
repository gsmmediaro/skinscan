import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PreCaptureInstructionsProps {
  onStart: () => void;
  onSkip: () => void;
}

export const PreCaptureInstructions = ({ onStart, onSkip }: PreCaptureInstructionsProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Let's Capture Your Skin</h1>
        <p className="text-lg text-muted-foreground">Good lighting is key for accurate analysis</p>
      </div>

      {/* Visual Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border-2 border-success/30 relative">
          <div className="absolute -top-3 -right-3 bg-success text-white rounded-full p-1.5">
            <Check className="w-4 h-4" />
          </div>
          <div className="aspect-square bg-gradient-to-br from-success/10 to-success/5 rounded-xl mb-3 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-24 h-32 mx-auto bg-success/20 rounded-full" />
              <div className="text-xs text-muted-foreground">Well-lit, neutral expression</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-success font-semibold mb-1">Good Example</div>
            <p className="text-xs text-muted-foreground">Clear, even lighting on face</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-danger/30 relative">
          <div className="absolute -top-3 -right-3 bg-danger text-white rounded-full p-1.5">
            <X className="w-4 h-4" />
          </div>
          <div className="aspect-square bg-gradient-to-br from-danger/10 to-danger/5 rounded-xl mb-3 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-24 h-32 mx-auto bg-danger/20 rounded-full opacity-50" />
              <div className="text-xs text-muted-foreground">Shadowy, makeup visible</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-danger font-semibold mb-1">Avoid This</div>
            <p className="text-xs text-muted-foreground">Poor lighting, makeup on</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-danger/30 relative">
          <div className="absolute -top-3 -right-3 bg-danger text-white rounded-full p-1.5">
            <X className="w-4 h-4" />
          </div>
          <div className="aspect-square bg-gradient-to-br from-danger/10 to-danger/5 rounded-xl mb-3 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-32 h-32 mx-auto bg-danger/20 rounded-full blur-sm" />
              <div className="text-xs text-muted-foreground">Overexposed, too close</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-danger font-semibold mb-1">Avoid This</div>
            <p className="text-xs text-muted-foreground">Too bright, improper distance</p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Before you start:</h3>
        <div className="space-y-3">
          {[
            "Good lighting (bright but not direct sun)",
            "Clean face (no makeup)",
            "Hair pulled back",
            "Neutral expression"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-sm bg-muted-foreground/30" />
              </div>
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          onClick={onStart}
          className="bg-success hover:bg-success/90 text-white text-lg px-12"
        >
          Start Camera
        </Button>
      </div>
      
      <div className="text-center">
        <button 
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Already know this? Skip tutorial
        </button>
      </div>
    </div>
  );
};
