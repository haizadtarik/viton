
import React, { useState } from 'react';
import { useTryOnStore } from '@/store/try-on-store';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { vitonApi } from '@/services/viton-api';
import { ImageSourceToggle } from './ImageSourceToggle';
import { UploadView } from './UploadView';
import { CameraView } from './CameraView';
import { UrlView } from './UrlView';

export function GarmentUpload() {
  const { modelImage, garmentImage, setGarmentImage, setAppState, setResultImages } = useTryOnStore();
  const [source, setSource] = useState<'upload' | 'camera' | 'url'>('upload');
  const { toast } = useToast();

  const handleImageProvided = (dataUrl: string) => {
    setGarmentImage(dataUrl);
  };
  
  const handleGenerate = async () => {
    if (!modelImage || !garmentImage) {
        toast({ title: "Missing Images", description: "Please provide both a model and a garment image.", variant: "destructive" });
        return;
    }
    setAppState('LOADING');
    try {
        const results = await vitonApi.generate(modelImage, garmentImage);
        setResultImages(results);
        setAppState('RESULT');
    } catch (error) {
        console.error("Error generating try-on:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred. Please try again.";
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 9000,
        });
        setAppState('GARMENT_UPLOAD');
    }
  };

  const renderGarmentSelector = () => {
      if (garmentImage) {
          return (
              <div className="w-64 h-80 rounded-3xl bg-slate-200 overflow-hidden shadow-lg relative">
                  <img src={garmentImage} alt="Garment" className="w-full h-full object-contain"/>
                  <Button onClick={() => setGarmentImage(null)} variant="secondary" size="sm" className="absolute top-2 right-2 rounded-full">
                      Change
                  </Button>
              </div>
          )
      }
      return (
        <div className="flex flex-col gap-4 items-center">
            <ImageSourceToggle value={source} onChange={setSource} />
            <div className="w-64 h-80 rounded-3xl overflow-hidden bg-slate-200">
              {source === 'upload' ? (
                  <UploadView onUpload={handleImageProvided} title="Drop garment here" className="h-full" />
              ) : source === 'camera' ? (
                  <CameraView onCapture={handleImageProvided} onCameraError={() => setSource('upload')} />
              ) : (
                  <UrlView onUrlLoad={handleImageProvided} title="Enter garment URL" className="h-full" />
              )}
            </div>
        </div>
      )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center animate-fade-in gap-8 p-4">
        <h1 className="text-4xl font-bold text-center text-slate-800">Provide Garment</h1>
        <div className="flex flex-wrap justify-center gap-8 items-end">
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-medium text-slate-600">Your Model</h2>
                <div className="w-64 h-80 rounded-3xl bg-slate-200 overflow-hidden shadow-lg">
                    <img src={modelImage!} alt="Your captured photo" className="w-full h-full object-cover"/>
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-medium text-slate-600">The Garment</h2>
                {renderGarmentSelector()}
            </div>
        </div>
        <Button onClick={handleGenerate} size="lg" className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg" disabled={!garmentImage}>
            <Icons.Sparkles className="mr-2 h-5 w-5"/>
            Generate Try-On
        </Button>
    </div>
  );
}
