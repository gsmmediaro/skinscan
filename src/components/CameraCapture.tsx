import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FlipHorizontal, Grid3x3, Zap, ZapOff } from "lucide-react";
import { useFaceDetection } from "@/hooks/useFaceDetection";
interface CameraCaptureProps {
  stream: MediaStream | null;
  onCapture: (blob: Blob, imageUrl: string) => void;
  onFlipCamera: () => void;
}

export const CameraCapture = ({ stream, onCapture, onFlipCamera }: CameraCaptureProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [videoSize, setVideoSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [feedback, setFeedback] = useState<string>("Position your face in the oval");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [stabilityTimer, setStabilityTimer] = useState<number>(0);
  const { ready, faceDetected, positionQuality, lightingQuality, landmarks } = useFaceDetection(videoRef);
// Bind stream to video element
useEffect(() => {
  if (videoRef.current && stream) {
    videoRef.current.srcObject = stream;
  }
}, [stream]);

// Track container and video sizes to align overlays with object-contain
useEffect(() => {
  const update = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: rect.height });
    }
    if (videoRef.current && (videoRef.current.videoWidth || videoRef.current.videoHeight)) {
      setVideoSize({ w: videoRef.current.videoWidth, h: videoRef.current.videoHeight });
    }
  };
  update();
  window.addEventListener("resize", update);
  const onLoaded = () => update();
  videoRef.current?.addEventListener("loadedmetadata", onLoaded);
  return () => {
    window.removeEventListener("resize", update);
    videoRef.current?.removeEventListener("loadedmetadata", onLoaded);
  };
}, []);

  // Feedback + stability gating
  useEffect(() => {
    if (!faceDetected) {
      setFeedback("Position your face in the oval");
      setStabilityTimer(0);
      return;
    }
    if (positionQuality === "perfect" && lightingQuality !== "dark") {
      setFeedback("Perfect! Hold still...");
      setStabilityTimer((p) => Math.min(p + 1, 10));
    } else if (positionQuality === "adjust") {
      setFeedback("Almost there - center your face");
      setStabilityTimer(0);
    } else {
      setFeedback("Move closer to the camera");
      setStabilityTimer(0);
    }
  }, [faceDetected, positionQuality, lightingQuality]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countInterval);
          captureImage();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        onCapture(blob, imageUrl);
      }
    }, "image/jpeg", 0.9);
  };

  const getOverlayColor = () => {
    if (!faceDetected) return "border-muted-foreground/30";
    switch (positionQuality) {
      case "perfect":
        return "border-success";
      case "adjust":
        return "border-warning";
      case "poor":
        return "border-danger";
    }
  };

  const getLightingIcon = () => {
    switch (lightingQuality) {
      case "excellent":
        return "✓";
      case "good":
        return "○";
      case "dark":
        return "⚠";
    }
  };

  const getLightingColor = () => {
    switch (lightingQuality) {
      case "excellent":
        return "text-success";
      case "good":
        return "text-warning";
      case "dark":
        return "text-danger";
    }
  };
  // Compute displayed video rect for object-contain
  const getDrawRect = () => {
    const cw = containerSize.w || 1;
    const ch = containerSize.h || 1;
    const vw = videoSize.w || 1;
    const vh = videoSize.h || 1;
    const scale = Math.min(cw / vw, ch / vh);
    const width = vw * scale;
    const height = vh * scale;
    const offsetX = (cw - width) / 2;
    const offsetY = (ch - height) / 2;
    return { offsetX, offsetY, width, height };
  };
  const rect = getDrawRect();

  const canCapture = faceDetected && positionQuality === "perfect" && lightingQuality !== "dark" && stabilityTimer >= 6;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Feedback Bubble */}
      <div className="text-center">
        <div className={`inline-block px-6 py-3 rounded-full ${
          positionQuality === "perfect" && lightingQuality !== "dark" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        } font-medium animate-fade-in`}>
          {feedback}
        </div>
      </div>

      {/* Camera Preview */}
      <div ref={containerRef} className="relative aspect-[3/4] max-h-[70vh] bg-black rounded-3xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />

        {/* Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
            </div>
          </div>
        )}

        {/* Face Guide Overlay (Oval) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className={`rounded-[50%] border-4 ${getOverlayColor()} transition-colors duration-300`}
            style={{
              width: `${rect.width * 0.6}px`,
              height: `${rect.height * 0.75}px`,
              animation: positionQuality === "perfect" ? "pulse 2s ease-in-out infinite" : "none"
            }}
          />
        </div>

        {/* Mesh overlay */}
        {faceDetected && landmarks.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {landmarks.slice(0, 200).map((p, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-success/80"
                style={{ 
                  left: `${rect.offsetX + p.x * rect.width}px`, 
                  top: `${rect.offsetY + p.y * rect.height}px`, 
                  transform: "translate(-50%, -50%)" 
                }}
              />
            ))}
          </div>
        )}

        {/* Lighting Meter */}
        <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm ${getLightingColor()} font-medium text-sm flex items-center gap-2`}>
          <span>{getLightingIcon()}</span>
          <span>Lighting: {lightingQuality.charAt(0).toUpperCase() + lightingQuality.slice(1)}</span>
        </div>

        {/* Camera Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={onFlipCamera}
            className="p-3 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition"
            aria-label="Flip camera"
          >
            <FlipHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-3 rounded-full backdrop-blur-sm text-white transition ${
              showGrid ? "bg-success/60 hover:bg-success/80" : "bg-black/60 hover:bg-black/80"
            }`}
            aria-label="Toggle grid"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFlashEnabled(!flashEnabled)}
            className={`p-3 rounded-full backdrop-blur-sm text-white transition ${
              flashEnabled ? "bg-success/60 hover:bg-success/80" : "bg-black/60 hover:bg-black/80"
            }`}
            aria-label="Toggle flash"
          >
            {flashEnabled ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Capture Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleCapture}
          disabled={!canCapture || countdown !== null}
          className={`w-20 h-20 rounded-full p-0 ${
            canCapture ? "bg-success hover:bg-success/90 animate-glow-pulse" : "bg-muted"
          }`}
          aria-label={canCapture ? "Capture photo (ready)" : "Capture disabled - align face and lighting"}
        >
          <div className="w-16 h-16 rounded-full border-4 border-white" />
        </Button>
      </div>
    </div>
  );
};
