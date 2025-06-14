
import React, { useState } from 'react';
import { useTryOnStore } from '@/store/try-on-store';
import { ImageSourceToggle } from './ImageSourceToggle';
import { CameraView } from './CameraView';
import { UploadView } from './UploadView';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function ModelSelection() {
  const [source, setSource] = useState<'upload' | 'camera'>('upload');
  const { modelImage, setModelImage, setAppState } = useTryOnStore();

  const handleImageProvided = (dataUrl: string) => {
    setModelImage(dataUrl);
  };

  const renderModelSelector = () => {
      if (modelImage) {
          return (
              <div className="w-full max-w-lg aspect-[3/4] rounded-3xl bg-slate-200 overflow-hidden shadow-lg relative">
                  <img src={modelImage} alt="Model" className="w-full h-full object-cover"/>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                    <Button onClick={() => setModelImage(null)} variant="secondary" className="rounded-full">
                        Change Image
                    </Button>
                    <Button onClick={() => setAppState('GARMENT_UPLOAD')} className="rounded-full bg-blue-600 text-white hover:bg-blue-700">
                        Continue
                        <Icons.ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  </div>
              </div>
          )
      }
      return (
        <div className="flex flex-col items-center gap-6">
            <ImageSourceToggle value={source} onChange={setSource} />
            <div className="w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden bg-slate-200">
              {source === 'upload' ? (
                  <UploadView onUpload={handleImageProvided} title="Drop your photo here" className="h-full" />
              ) : (
                  <CameraView onCapture={handleImageProvided} onCameraError={() => setSource('upload')} />
              )}
            </div>
        </div>
      )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center animate-fade-in gap-8 p-4">
      <h1 className="text-4xl font-bold text-center text-slate-800">Choose Your Model Image</h1>
      {renderModelSelector()}
    </div>
  );
}
