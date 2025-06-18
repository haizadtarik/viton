
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

type Source = 'upload' | 'camera' | 'url';

interface ImageSourceToggleProps {
  value: Source;
  onChange: (value: Source) => void;
}

export function ImageSourceToggle({ value, onChange }: ImageSourceToggleProps) {
  return (
    <div className="frosted-glass flex items-center gap-2 rounded-full border border-white/30 p-2 shadow-lg">
      <button
        onClick={() => onChange('upload')}
        className={cn(
          "flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
          "h-10 w-auto px-4 py-2 gap-2",
          value === 'upload' 
            ? "bg-blue-600 text-white shadow-sm ring-2 ring-white/50" 
            : "text-slate-600 hover:bg-blue-500 hover:text-white cursor-pointer"
        )}
      >
        <Icons.UploadCloud className="h-5 w-5 shrink-0" />
        <span>Upload</span>
      </button>
      
      <button
        onClick={() => onChange('camera')}
        className={cn(
          "flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
          "h-10 w-auto px-4 py-2 gap-2",
          value === 'camera' 
            ? "bg-blue-600 text-white shadow-sm ring-2 ring-white/50" 
            : "text-slate-600 hover:bg-blue-500 hover:text-white cursor-pointer"
        )}
      >
        <Icons.Camera className="h-5 w-5 shrink-0" />
        <span>Camera</span>
      </button>
      
      <button
        onClick={() => onChange('url')}
        className={cn(
          "flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
          "h-10 w-auto px-4 py-2 gap-2",
          value === 'url' 
            ? "bg-blue-600 text-white shadow-sm ring-2 ring-white/50" 
            : "text-slate-600 hover:bg-blue-500 hover:text-white cursor-pointer"
        )}
      >
        <Icons.Link className="h-5 w-5 shrink-0" />
        <span>URL</span>
      </button>
    </div>
  );
}
