
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

type Source = 'upload' | 'camera';

interface ImageSourceToggleProps {
  value: Source;
  onChange: (value: Source) => void;
}

export function ImageSourceToggle({ value, onChange }: ImageSourceToggleProps) {
  return (
    <div className="flex items-center gap-2 rounded-full p-1 bg-slate-200/50">
      <Button
        onClick={() => onChange('upload')}
        variant="ghost"
        size="sm"
        className={cn("rounded-full", value === 'upload' && 'bg-white text-blue-700 shadow-sm')}
      >
        <Icons.UploadCloud className="mr-2 h-5 w-5" />
        Upload Photo
      </Button>
      <Button
        onClick={() => onChange('camera')}
        variant="ghost"
        size="sm"
        className={cn("rounded-full", value === 'camera' && 'bg-white text-blue-700 shadow-sm')}
      >
        <Icons.Camera className="mr-2 h-5 w-5" />
        Use Camera
      </Button>
    </div>
  );
}
