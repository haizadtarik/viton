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
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const options: { value: Source; icon: any; label: string }[] = [
    { value: 'upload', icon: Icons.UploadCloud, label: 'Upload' },
    { value: 'camera', icon: Icons.Camera, label: 'Camera' },
    { value: 'url', icon: Icons.Link, label: 'URL' }
  ];

  // Update indicator position when value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicatorPosition();
    }, 50);
    return () => clearTimeout(timer);
  }, [value]);

  const updateIndicatorPosition = () => {
    const activeIndex = options.findIndex(opt => opt.value === value);
    const activeButton = buttonsRef.current[activeIndex];
    
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      const left = buttonRect.left - containerRect.left;
      const width = buttonRect.width;
      const height = buttonRect.height;
      
      setIndicatorStyle({
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        top: `0px`,
      });
    }
  };

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
      setTimeout(() => setIsAnimating(false), 600);
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
      setTimeout(() => setIsAnimating(false), 600);
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

  // Update indicator on resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => updateIndicatorPosition(), 100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial position setup
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicatorPosition();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="frosted-glass relative flex items-center rounded-full border border-white/30 p-1 shadow-lg select-none overflow-hidden"
      onMouseDown={handleMouseDown}
    >
      {/* Sliding Background Indicator */}
      <div
        className={cn(
          "absolute rounded-full transition-all duration-500 ease-out pointer-events-none z-0",
          "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
          "shadow-lg shadow-blue-500/50",
          isAnimating && "animate-glow",
          isDragging && "animate-magnetic-snap"
        )}
        style={indicatorStyle}
      />
      
      {options.map(({ value: optionValue, icon: Icon, label }, index) => (
        <button
          key={optionValue}
          ref={(el) => (buttonsRef.current[index] = el)}
          onClick={() => handleButtonClick(optionValue)}
          className={cn(
            "relative flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 z-10",
            "h-12 px-6 py-3 gap-2 min-w-[100px]",
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
