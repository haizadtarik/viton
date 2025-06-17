
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type Source = 'upload' | 'camera' | 'url';

interface ImageSourceToggleProps {
  value: Source;
  onChange: (value: Source) => void;
}

const sourceOptions: Source[] = ['upload', 'camera', 'url'];

export function ImageSourceToggle({ value, onChange }: ImageSourceToggleProps) {
  const [sliderValue, setSliderValue] = useState<number>(sourceOptions.indexOf(value));

  useEffect(() => {
    // Update slider when value prop changes externally
    setSliderValue(sourceOptions.indexOf(value));
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    const index = newValue[0];
    const newSource = sourceOptions[index] as Source;
    setSliderValue(index);
    onChange(newSource);
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="flex justify-between mb-2 text-sm font-medium text-slate-600">
        <span className={cn("transition-colors", value === 'upload' && "text-blue-700 font-bold")}>Upload</span>
        <span className={cn("transition-colors", value === 'camera' && "text-blue-700 font-bold")}>Camera</span>
        <span className={cn("transition-colors", value === 'url' && "text-blue-700 font-bold")}>URL</span>
      </div>
      <Slider
        value={[sliderValue]}
        max={2}
        step={1}
        onValueChange={handleSliderChange}
        className="w-full"
      />
    </div>
  );
}
