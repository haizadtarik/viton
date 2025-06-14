
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTryOnStore } from '@/store/try-on-store';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { vitonApi } from '@/services/viton-api';

export function GarmentUpload() {
  const { modelImage, setGarmentImage, setAppState, setResultImages } = useTryOnStore();
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setGarmentImage(base64);
        setGarmentPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  }, [setGarmentImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxFiles: 1,
  });
  
  const handleGenerate = async () => {
    if (!modelImage || !useTryOnStore.getState().garmentImage) {
        toast({ title: "Missing Images", description: "Please provide both a model and a garment image.", variant: "destructive" });
        return;
    }
    setAppState('LOADING');
    try {
        const results = await vitonApi.generate(modelImage, useTryOnStore.getState().garmentImage!);
        setResultImages(results);
        setAppState('RESULT');
    } catch (error) {
        console.error("Error generating try-on:", error);
        toast({ title: "Generation Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
        setAppState('GARMENT_UPLOAD');
    }
  };


  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in gap-8">
        <h1 className="text-4xl font-bold text-center text-slate-800">Upload a Garment</h1>
        <div className="flex gap-8">
            <div className="w-64 h-80 rounded-3xl bg-slate-200 overflow-hidden shadow-lg">
                <img src={modelImage!} alt="Your captured photo" className="w-full h-full object-cover"/>
            </div>
            <div
                {...getRootProps()}
                className={`w-64 h-80 rounded-3xl border-4 border-dashed flex items-center justify-center text-center p-4 cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-100/50'
                }`}
            >
                <input {...getInputProps()} />
                {garmentPreview ? (
                    <img src={garmentPreview} alt="Garment preview" className="w-full h-full object-contain"/>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Icons.UploadCloud className="h-12 w-12" />
                        <p>Drop your garment here, or click to select</p>
                    </div>
                )}
            </div>
        </div>
        <Button onClick={handleGenerate} size="lg" className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg" disabled={!garmentPreview}>
            <Icons.Sparkles className="mr-2 h-5 w-5"/>
            Generate Try-On
        </Button>
    </div>
  );
}
