
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Icons } from '@/components/icons';

type Source = 'upload' | 'camera' | 'url';

interface ImageSourceToggleProps {
  value: Source;
  onChange: (value: Source) => void;
}

export function ImageSourceToggle({ value, onChange }: ImageSourceToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue) => newValue && onChange(newValue as Source)}
      className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg"
    >
      <ToggleGroupItem
        value="upload"
        className="flex flex-col items-center gap-1 p-3 data-[state=on]:bg-white data-[state=on]:text-blue-700 data-[state=on]:shadow-sm"
      >
        <Icons.UploadCloud className="h-5 w-5" />
        <span className="text-xs font-medium">Upload</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="camera"
        className="flex flex-col items-center gap-1 p-3 data-[state=on]:bg-white data-[state=on]:text-blue-700 data-[state=on]:shadow-sm"
      >
        <Icons.Camera className="h-5 w-5" />
        <span className="text-xs font-medium">Camera</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="url"
        className="flex flex-col items-center gap-1 p-3 data-[state=on]:bg-white data-[state=on]:text-blue-700 data-[state=on]:shadow-sm"
      >
        <Icons.Link className="h-5 w-5" />
        <span className="text-xs font-medium">URL</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
