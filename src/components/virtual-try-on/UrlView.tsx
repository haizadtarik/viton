
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UrlViewProps {
  onUrlLoad: (dataUrl: string) => void;
  title: string;
  className?: string;
}

export function UrlView({ onUrlLoad, title, className }: UrlViewProps) {
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLoadUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a canvas to convert the image to base64
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreview(dataUrl);
        onUrlLoad(dataUrl);
      }
    } catch (error) {
      console.error('Error loading image from URL:', error);
      toast({
        title: "Failed to Load Image",
        description: "Could not load the image from the provided URL. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full h-full rounded-3xl border-4 border-dashed border-slate-300 bg-slate-100/50 flex items-center justify-center text-center p-4", className)}>
      {preview ? (
        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
      ) : (
        <div className="flex flex-col items-center gap-4 text-slate-500 w-full">
          <Icons.Link className="h-12 w-12" />
          <p className="text-sm">{title}</p>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-center"
            />
            <Button 
              onClick={handleLoadUrl} 
              disabled={isLoading || !url.trim()}
              size="sm"
              className="rounded-full"
            >
              {isLoading ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Icons.Download className="mr-2 h-4 w-4" />
                  Load Image
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
