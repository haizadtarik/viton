
import React from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

type Source = 'upload' | 'camera' | 'url';

interface ImageSourceToggleProps {
  value: Source;
  onChange: (value: Source) => void;
}

export function ImageSourceToggle({ value, onChange }: ImageSourceToggleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const options: { value: Source; icon: any; label: string }[] = [
    { value: 'upload', icon: Icons.UploadCloud, label: 'Upload' },
    { value: 'camera', icon: Icons.Camera, label: 'Camera' },
    { value: 'url', icon: Icons.Link, label: 'URL' }
  ];

  // Get the active button index
  const activeIndex = options.findIndex(opt => opt.value === value);

  // Update indicator position using precise measurements
  const updateIndicatorPosition = () => {
    if (!containerRef.current || activeIndex === -1) return;
    
    const activeButton = buttonsRef.current[activeIndex];
    if (!activeButton) return;

    // Get container bounds
    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    
    // Calculate relative position within container
    const relativeLeft = buttonRect.left - containerRect.left;
    const buttonCenter = relativeLeft + (buttonRect.width / 2);
    
    // Oversize amounts
    const oversizeWidth = 16; // 8px on each side
    const oversizeHeight = 8; // 4px on each side
    
    // Calculate indicator dimensions and position
    const indicatorWidth = buttonRect.width + oversizeWidth;
    const indicatorHeight = buttonRect.height + oversizeHeight;
    const indicatorLeft = buttonCenter - (indicatorWidth / 2);
    
    setIndicatorStyle({
      left: `${indicatorLeft}px`,
      width: `${indicatorWidth}px`,
      height: `${indicatorHeight}px`,
      top: `${-oversizeHeight / 2}px`,
    });
  };

  // Update position when active value changes
  useLayoutEffect(() => {
    // Small delay to ensure DOM is fully updated
    const timer = setTimeout(updateIndicatorPosition, 10);
    return () => clearTimeout(timer);
  }, [value, activeIndex]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

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
      {/* Sliding Background Indicator - using precise pixel positioning */}
      <div
        className={cn(
          "absolute rounded-full transition-all duration-300 ease-out pointer-events-none z-0",
          "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
          "shadow-lg shadow-blue-500/50",
          isAnimating && "animate-glow"
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
