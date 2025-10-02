import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

interface ReviewCaptureProps {
  imageUrl: string;
  onRetake: () => void;
  onAnalyze: () => void;
  analyzing: boolean;
}

export const ReviewCapture = ({ imageUrl, onRetake, onAnalyze, analyzing }: ReviewCaptureProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Review Your Scan</h1>
        <p className="text-lg text-muted-foreground">Make sure the image looks clear and well-lit</p>
      </div>

      {/* Split View */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Capture */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Your Photo</h3>
          <div className="aspect-[3/4] bg-black rounded-2xl overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* AI Detection Preview */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Detection Preview</h3>
          <div className="aspect-[3/4] bg-gradient-to-br from-success/5 to-primary/5 rounded-2xl overflow-hidden relative">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-80 rounded-[50%] border-2 border-success border-dashed" />
              {/* Simulated detection points */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-success rounded-full animate-glow-pulse"
                  style={{
                    top: `${30 + Math.random() * 40}%`,
                    left: `${30 + Math.random() * 40}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Indicators */}
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Quality Check</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="font-medium">Image Quality</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-success text-success" />
                ))}
                <span className="ml-1">Excellent</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="font-medium">Face Detection</div>
              <div className="text-sm text-success">Clear</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="font-medium">Lighting</div>
              <div className="text-sm text-success">Optimal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Preview */}
      <div className="bg-gradient-to-br from-primary/5 to-success/5 rounded-2xl p-6 text-center space-y-3">
        <div className="text-6xl mb-2">🔬</div>
        <h3 className="font-semibold text-lg">Ready to Analyze</h3>
        <p className="text-muted-foreground">
          We'll analyze 12 skin health factors including texture, tone, hydration, and aging signs
        </p>
        <div className="text-sm text-muted-foreground pt-2">
          Estimated time: 15-30 seconds
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          variant="outline"
          onClick={onRetake}
          disabled={analyzing}
          className="text-lg px-8 border-2"
        >
          Retake Photo
        </Button>
        <Button
          size="lg"
          onClick={onAnalyze}
          disabled={analyzing}
          className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white text-lg px-12"
        >
          {analyzing ? "Analyzing..." : "Analyze My Skin"}
        </Button>
      </div>
    </div>
  );
};
