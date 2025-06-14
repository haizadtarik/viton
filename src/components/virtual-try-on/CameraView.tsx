
import React, { useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ShutterButton } from './ShutterButton';

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  onCameraError?: () => void;
  className?: string;
}

export function CameraView({ onCapture, onCameraError, className }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast({
          title: "Camera Error",
          description: "Could not access your camera. Please check your browser permissions.",
          variant: "destructive",
        });
        if (onCameraError) onCameraError();
      }
    }
    setupCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onCameraError, toast]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      const dataUrl = canvas.toDataURL('image/jpeg');
      onCapture(dataUrl);
    }
  }, [onCapture]);

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center bg-slate-200", className)}>
      <div className="relative w-full h-full overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scaleX-[-1]" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <ShutterButton onClick={handleCapture} />
        </div>
      </div>
    </div>
  );
}
