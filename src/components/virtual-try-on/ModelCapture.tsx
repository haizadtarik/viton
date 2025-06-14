
import React, { useRef, useCallback, useEffect } from 'react';
import { useTryOnStore } from '@/store/try-on-store';
import { ShutterButton } from './ShutterButton';
import { useToast } from '@/hooks/use-toast';

export function ModelCapture() {
  const { setModelImage, setAppState } = useTryOnStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
        setAppState('WELCOME');
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [setAppState, toast]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setModelImage(dataUrl);
      setAppState('GARMENT_UPLOAD');
    }
  }, [setModelImage, setAppState]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg aspect-[3/4] rounded-4xl bg-slate-200 overflow-hidden shadow-2xl ring-4 ring-white/50">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scaleX-[-1]" />
      </div>
      <div className="absolute bottom-20">
        <ShutterButton onClick={handleCapture} />
      </div>
    </div>
  );
}
