
import React from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

type Source = 'upload' | 'camera' | 'url';

interface ImageSourceToggleProps {
  value: Source;
  onChange: (value: Source) => void;
}

export function ImageSourceToggle({ value, onChange }: ImageSourceToggleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const options: { value: Source; icon: any; label: string }[] = [
    { value: 'upload', icon: Icons.UploadCloud, label: 'Upload' },
    { value: 'camera', icon: Icons.Camera, label: 'Camera' },
    { value: 'url', icon: Icons.Link, label: 'URL' }
  ];

  // Get the active button index for transform-based positioning
  const activeIndex = options.findIndex(opt => opt.value === value);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
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
      setIsAnimating(true);
      onChange(newValue);
      setTimeout(() => setIsAnimating(false), 300);
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

  const handleButtonClick = (optionValue: Source) => {
    if (optionValue !== value) {
      setIsAnimating(true);
      onChange(optionValue);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Add global mouse event listeners
  useEffect(() => {
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
      className="frosted-glass relative flex items-center rounded-full border border-white/30 p-1 shadow-lg select-none overflow-visible"
      onMouseDown={handleMouseDown}
    >
      {/* Sliding Background Indicator - using transform instead of left positioning */}
      <div
        className={cn(
          "absolute rounded-full transition-all duration-300 ease-out pointer-events-none z-0",
          "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
          "shadow-lg shadow-blue-500/50",
          isAnimating && "animate-glow"
        )}
        style={{
          // Index-based positioning immune to scrolling
          transform: `translateX(${activeIndex * 100}%)`,
          width: 'calc(33.333% + 16px)', // 1/3 width + oversize
          height: 'calc(100% + 8px)', // full height + oversize
          left: '-8px', // center the oversize effect
          top: '-4px', // center the oversize effect vertically
        }}
      />
      
      {options.map(({ value: optionValue, icon: Icon, label }, index) => (
        <button
          key={optionValue}
          ref={(el) => (buttonsRef.current[index] = el)}
          onClick={() => handleButtonClick(optionValue)}
          className={cn(
            "relative flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 z-10",
            "h-12 px-6 py-3 gap-2 min-w-[100px] flex-1",
            value === optionValue 
              ? cn(
                  "text-white transform scale-105",
                  isAnimating && "animate-bounce-in"
                )
              : "text-slate-600 hover:text-slate-800 cursor-pointer hover:scale-105"
          )}
        >
          <Icon className={cn(
            "h-5 w-5 shrink-0 transition-all duration-300",
            value === optionValue && "drop-shadow-lg"
          )} />
          <span className={cn(
            "transition-all duration-300 whitespace-nowrap",
            value === optionValue && "font-semibold tracking-wide"
          )}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
