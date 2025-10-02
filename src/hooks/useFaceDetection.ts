import { useEffect, useMemo, useRef, useState } from "react";

// Lazy import types to avoid TS issues if package changes
// We'll use any for model/result to keep implementation simple and robust
let FaceLandmarker: any;
let FilesetResolver: any;

async function loadVision() {
  if (!FilesetResolver) {
    const vision = await import("@mediapipe/tasks-vision");
    FilesetResolver = vision.FilesetResolver;
    FaceLandmarker = vision.FaceLandmarker;
  }
}

export type PositionQuality = "perfect" | "adjust" | "poor";
export type LightingQuality = "excellent" | "good" | "dark";

export function useFaceDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [ready, setReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [positionQuality, setPositionQuality] = useState<PositionQuality>("poor");
  const [lightingQuality, setLightingQuality] = useState<LightingQuality>("dark");
  const [landmarks, setLandmarks] = useState<{ x: number; y: number }[]>([]);

  const landmarkerRef = useRef<any>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const rafRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    canvasRef.current = document.createElement("canvas");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadVision();
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      if (cancelled) return;
      landmarkerRef.current = landmarker;
      setReady(true);

      const loop = () => {
        const video = videoRef.current;
        const landmarker = landmarkerRef.current;
        if (!video || !landmarker) return;

        if (video.currentTime !== lastVideoTimeRef.current) {
          try {
            const res = landmarker.detectForVideo(video, Date.now());
            const points = res?.faceLandmarks?.[0] ?? [];
            if (points.length) {
              setFaceDetected(true);
              setLandmarks(points.map((p: any) => ({ x: p.x, y: p.y })));

              // Bounding box
              const xs = points.map((p: any) => p.x);
              const ys = points.map((p: any) => p.y);
              const minX = Math.min(...xs);
              const maxX = Math.max(...xs);
              const minY = Math.min(...ys);
              const maxY = Math.max(...ys);
              const width = maxX - minX;
              const height = maxY - minY;
              const cx = (minX + maxX) / 2;
              const cy = (minY + maxY) / 2;

              // Heuristics for quality (tuned for phone arms-length framing)
              const centered = Math.abs(cx - 0.5) < 0.12 && Math.abs(cy - 0.5) < 0.12;
              const sizeOk = height > 0.35 && height < 0.85; // roughly 35%-85% of frame height
              const notTooWide = width / height < 1.1; // allow some yaw

              let pos: PositionQuality = "poor";
              if (centered && sizeOk && notTooWide) pos = "perfect";
              else if (sizeOk) pos = "adjust";
              else pos = "poor";
              setPositionQuality(pos);

              // Lighting estimate from average luminance
              const canvas = canvasRef.current!;
              const vw = video.videoWidth;
              const vh = video.videoHeight;
              if (vw && vh) {
                canvas.width = 160;
                canvas.height = Math.round((vh / vw) * 160);
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  let sum = 0;
                  for (let i = 0; i < img.data.length; i += 4 * 16) { // sample every 16 pixels
                    const r = img.data[i];
                    const g = img.data[i + 1];
                    const b = img.data[i + 2];
                    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b; // luminance
                    sum += y;
                  }
                  const samples = img.data.length / (4 * 16);
                  const avg = sum / samples; // 0-255
                  let light: LightingQuality = "dark";
                  if (avg > 170) light = "excellent";
                  else if (avg > 120) light = "good";
                  else light = "dark";
                  setLightingQuality(light);
                }
              }
            } else {
              setFaceDetected(false);
              setLandmarks([]);
              setPositionQuality("poor");
            }
            lastVideoTimeRef.current = video.currentTime;
          } catch {
            // ignore transient errors
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    })();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      landmarkerRef.current?.close?.();
      landmarkerRef.current = null;
    };
  }, [videoRef]);

  return { ready, faceDetected, positionQuality, lightingQuality, landmarks } as const;
}

