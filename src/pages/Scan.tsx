import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { saveScan, setCurrentScan } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";

const Scan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setImageBlob(blob);
        setCapturedImage(URL.createObjectURL(blob));
        setCaptured(true);
        stopCamera();
        toast.success("Photo captured! Ready to analyze.");
      }
    }, "image/jpeg", 0.8);
  };

  const retake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCaptured(false);
    setCapturedImage("");
    setImageBlob(null);
    startCamera();
  };

  const analyze = async () => {
    if (!imageBlob) return;

    setAnalyzing(true);
    toast.info("Analyzing your skin...", { description: "This may take a few seconds" });

    try {
      // Send binary image to webhook
      const webhookResponse = await fetch("https://shadow424.app.n8n.cloud/webhook/skin-scan-ai", {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
        },
        body: imageBlob,
      });

      if (!webhookResponse.ok) {
        throw new Error("Webhook request failed");
      }

      const webhookData = await webhookResponse.json();

      // Validate response structure - expecting array with analysis object
      if (!Array.isArray(webhookData) || webhookData.length === 0 || !webhookData[0]?.analysis) {
        throw new Error('Invalid webhook response format');
      }

      const apiAnalysis = webhookData[0].analysis;

      // Transform webhook response to SkinAnalysis format
      const glowScore = Math.round(apiAnalysis.glowScore / 10);
      
      // Map webhook metrics to our app's metrics with severity
      const mapMetric = (score: number) => {
        const normalizedScore = Math.round(score / 10);
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
        darkSpots: { ...mapMetric(apiAnalysis.evenness), description: "Pigmentation issues" },
      };

      // Calculate strength and focus area
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
      setAnalyzing(false);
    }
  };

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold bg-gradient-glow bg-clip-text text-transparent"
          >
            SkinScan
          </button>
          <div className="text-sm text-muted-foreground">
            Step 1 of 3: Capture
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          {/* Instructions */}
          {!captured && (
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl font-bold">Position Your Face</h1>
              <p className="text-lg text-muted-foreground">
                Center your face in the circle and make sure you're in good lighting
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-glow-pulse" />
                  <span className="text-muted-foreground">Good lighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">Face centered</span>
                </div>
              </div>
            </div>
          )}

          {/* Camera/Preview */}
          <div className="relative aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-glow">
            {!captured ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-72 h-72 rounded-full border-4 border-primary/50 border-dashed animate-glow-pulse" />
                </div>
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured selfie"
                className="w-full h-full object-cover"
              />
            )}

            {analyzing && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Sparkles className="w-16 h-16 text-primary animate-glow-pulse" />
                <div className="text-white text-xl font-semibold">Analyzing Your Skin...</div>
                <div className="text-white/70 text-sm">This won't take long</div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!captured ? (
              <Button
                size="lg"
                onClick={capturePhoto}
                disabled={!stream}
                className="bg-gradient-glow hover:opacity-90 transition-opacity text-lg px-12 shadow-glow"
              >
                <Camera className="mr-2 h-5 w-5" />
                Capture Photo
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={retake}
                  disabled={analyzing}
                  className="text-lg px-8"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Retake
                </Button>
                <Button
                  size="lg"
                  onClick={analyze}
                  disabled={analyzing}
                  className="bg-gradient-glow hover:opacity-90 transition-opacity text-lg px-12 shadow-glow"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {analyzing ? "Analyzing..." : "Analyze Skin"}
                </Button>
              </>
            )}
          </div>

          {/* Tips */}
          <div className="bg-accent/50 rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-foreground">Tips for best results:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use natural lighting or bright indoor lighting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Remove makeup for most accurate analysis
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Keep your face centered and look directly at the camera
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Avoid shadows on your face
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scan;
