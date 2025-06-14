
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ShutterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function ShutterButton({ className, isLoading, ...props }: ShutterButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
    >
      <Button
        aria-label="Capture photo"
        className={cn(
          "h-20 w-20 rounded-full bg-white/50 shadow-2xl shadow-blue-500/20 ring-4 ring-white/20 backdrop-blur-sm hover:bg-white/70 hover:scale-105 transition-all duration-300 ease-in-out group",
          isLoading && 'cursor-not-allowed',
          className
        )}
        {...props}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.Loader className="h-10 w-10 animate-spin text-blue-600" />
        ) : (
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Icons.Camera className="h-8 w-8 text-white" />
          </div>
        )}
      </Button>
    </motion.div>
  );
}
