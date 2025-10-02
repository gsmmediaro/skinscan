import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface CameraCaptureProps {
  stream: MediaStream | null;
  onCapture: (blob: Blob, imageUrl: string) => void;
}

export const CameraCapture = ({ stream, onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Position Your Face</h2>
        <p className="text-muted-foreground">Center your face and make sure you're in good lighting</p>
      </div>

      {/* Camera Preview */}
      <div className="relative aspect-[3/4] max-h-[70vh] bg-black rounded-3xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Face Guide Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-80 rounded-[50%] border-4 border-primary/50 border-dashed" />
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Capture Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleCapture}
          disabled={!stream}
          className="bg-success hover:bg-success/90 text-white text-lg px-12"
        >
          <Camera className="mr-2 h-5 w-5" />
          Take Photo
        </Button>
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
  );
};
