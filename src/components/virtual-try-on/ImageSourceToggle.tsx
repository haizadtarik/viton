
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

type Source = 'upload' | 'camera' | 'url';

interface ImageSourceToggleProps {
  value: Source;
  onChange: (value: Source) => void;
}

export function ImageSourceToggle({ value, onChange }: ImageSourceToggleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: { value: Source; icon: any; label: string }[] = [
    { value: 'upload', icon: Icons.UploadCloud, label: 'Upload' },
    { value: 'camera', icon: Icons.Camera, label: 'Camera' },
    { value: 'url', icon: Icons.Link, label: 'URL' }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sectionWidth = rect.width / 3;
    
    let newValue: Source;
    if (x < sectionWidth) {
      newValue = 'upload';
    } else if (x < sectionWidth * 2) {
      newValue = 'camera';
    } else {
      newValue = 'url';
    }
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMoveGlobal = (e: MouseEvent) => {
    if (isDragging) {
      handleMouseMove(e);
    }
  };

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="frosted-glass flex items-center gap-2 rounded-full border border-white/30 p-2 shadow-lg select-none"
      onMouseDown={handleMouseDown}
    >
      {options.map(({ value: optionValue, icon: Icon, label }) => (
        <button
          key={optionValue}
          onClick={() => onChange(optionValue)}
          className={cn(
            "flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
            "h-10 w-auto px-4 py-2 gap-2",
            value === optionValue 
              ? "bg-blue-600 text-white shadow-sm ring-2 ring-white/50" 
              : "text-slate-600 hover:bg-blue-500 hover:text-white cursor-pointer"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
