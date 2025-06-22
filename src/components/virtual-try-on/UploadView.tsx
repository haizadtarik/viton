
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';

interface UploadViewProps {
  onUpload: (dataUrl: string) => void;
  title: string;
  className?: string;
}

export function UploadView({ onUpload, title, className }: UploadViewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onUpload(base64);
      };
      reader.readAsDataURL(file);
      setPreview(URL.createObjectURL(file));
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        `w-full h-full rounded-3xl border-4 border-dashed flex items-center justify-center text-center p-4 cursor-pointer transition-colors`,
        isDragActive ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50' : 'border-slate-300 bg-slate-100/50',
        className
      )}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="w-full h-full object-contain"/>
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Icons.UploadCloud className="h-12 w-12" />
          <p>{title}</p>
        </div>
      )}
    </div>
  );
}
