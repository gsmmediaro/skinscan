import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { saveScan, setCurrentScan } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { PreCaptureInstructions } from "@/components/PreCaptureInstructions";
import { CameraCapture } from "@/components/CameraCapture";
import { ReviewCapture } from "@/components/ReviewCapture";
import { Sparkles } from "lucide-react";

type ScanStage = "instructions" | "camera" | "review" | "analyzing";

const Scan = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<ScanStage>("instructions");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const startCamera = async () => {
    try {
      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode, 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
      });
      setStream(mediaStream);
      setStage("camera");
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Unable to access camera. Please check permissions.");
      setStage("instructions");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleStartCapture = () => {
    startCamera();
  };

  const handleSkipInstructions = () => {
    startCamera();
  };

  const handleCapture = (blob: Blob, imageUrl: string) => {
    setImageBlob(blob);
    setCapturedImage(imageUrl);
    stopCamera();
    setStage("review");
    toast.success("Photo captured! Review and analyze when ready.");
  };

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage("");
    setImageBlob(null);
    startCamera();
  };

  const handleFlipCamera = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    
    // Restart camera with new facing mode
    if (stream) {
      stopCamera();
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: newFacingMode, 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          },
        });
        setStream(mediaStream);
      } catch (error) {
        console.error("Camera flip error:", error);
        toast.error("Unable to flip camera");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!imageBlob) return;

    setStage("analyzing");
    toast.info("Analyzing your skin...", { description: "This may take a few seconds" });

    try {
      const formData = new FormData();
      formData.append('image', imageBlob, 'selfie.jpg');

      const backendUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze`;
      
      const webhookResponse = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: formData,
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Backend error:', errorText);
        throw new Error(`Analysis failed (${webhookResponse.status})`);
      }

      const responseText = await webhookResponse.text();
      let webhookData;
      
      try {
        webhookData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }

      let apiAnalysis;
      if (Array.isArray(webhookData)) {
        if (webhookData.length === 0 || !webhookData[0]?.analysis) {
          throw new Error('Invalid webhook response format');
        }
        apiAnalysis = webhookData[0].analysis;
      } else if (webhookData?.analysis) {
        apiAnalysis = webhookData.analysis;
      } else {
        throw new Error('Invalid webhook response format');
      }

      const glowScore = Math.round(apiAnalysis.glowScore);
      
      const mapMetric = (score: number) => {
        const normalizedScore = Math.round(score);
        let severity: "low" | "medium" | "high";
        if (score >= 70) severity = "low";
        else if (score >= 40) severity = "medium";
        else severity = "high";
        
        return { score: normalizedScore, severity };
      };

      const metrics = {
        acne: { ...mapMetric(100 - apiAnalysis.evenness), description: "Blemishes and breakouts" },
        redness: { ...mapMetric(100 - apiAnalysis.evenness), description: "Skin inflammation" },
        texture: { ...mapMetric(apiAnalysis.texture), description: "Skin smoothness" },
        fineLines: { ...mapMetric(100 - apiAnalysis.wrinkles), description: "Early signs of aging" },
        darkSpots: { ...mapMetric(100 - apiAnalysis.evenness), description: "Pigmentation issues" },
      };

      const metricScores = Object.entries(metrics).map(([key, value]) => ({
        name: key,
        score: value.score,
      }));
      const sortedMetrics = [...metricScores].sort((a, b) => b.score - a.score);
      
      const strength = sortedMetrics[0].name.charAt(0).toUpperCase() + sortedMetrics[0].name.slice(1);
      const focusArea = sortedMetrics[sortedMetrics.length - 1].name.charAt(0).toUpperCase() + 
                        sortedMetrics[sortedMetrics.length - 1].name.slice(1);

      const analysis: SkinAnalysis = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageData: capturedImage,
        glowScore,
        strength,
        focusArea,
        metrics,
        unlocked: false,
      };

      saveScan(analysis);
      setCurrentScan(analysis);
      navigate(`/results/${analysis.id}`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed. Please try again.");
      setStage("review");
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-foreground"
          >
            SkinScan
          </button>
          <div className="text-sm text-muted-foreground">
            {stage === "instructions" && "Prepare"}
            {stage === "camera" && "Step 1 of 3: Capture"}
            {stage === "review" && "Step 2 of 3: Review"}
            {stage === "analyzing" && "Step 3 of 3: Analyzing"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        {stage === "instructions" && (
          <PreCaptureInstructions 
            onStart={handleStartCapture}
            onSkip={handleSkipInstructions}
          />
        )}

        {stage === "camera" && (
          <CameraCapture
            stream={stream}
            onCapture={handleCapture}
            onFlipCamera={handleFlipCamera}
          />
        )}

        {stage === "review" && (
          <ReviewCapture
            imageUrl={capturedImage}
            onRetake={handleRetake}
            onAnalyze={handleAnalyze}
            analyzing={false}
          />
        )}

        {stage === "analyzing" && (
          <div className="text-center space-y-6 animate-fade-in">
            <Sparkles className="w-24 h-24 text-success mx-auto animate-glow-pulse" />
            <h2 className="text-3xl font-bold">Analyzing Your Skin...</h2>
            <p className="text-lg text-muted-foreground">Our AI is examining 12 skin health factors</p>
            <div className="text-sm text-muted-foreground">This won't take long</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scan;
