
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useTryOnStore } from '@/store/try-on-store';

const STEPS = [
  { id: 'MODEL_SELECTION', name: 'Model', icon: Icons.User },
  { id: 'GARMENT_UPLOAD', name: 'Garment', icon: Icons.Shirt },
  { id: 'RESULT', name: 'Result', icon: Icons.Sparkles },
];

export function Dock() {
  const { appState, modelImage, garmentImage, resultImages, setAppState, setModelImage, setGarmentImage } = useTryOnStore();

  const isStepCompleted = (stepId: string) => {
    switch (stepId) {
      case 'MODEL_SELECTION':
        return !!modelImage;
      case 'GARMENT_UPLOAD':
        return !!garmentImage;
      case 'RESULT':
        return resultImages.length > 0;
      default:
        return false;
    }
  };

  const handleStepClick = (stepId: string) => {
    // Don't allow navigation during loading
    if (appState === 'LOADING') return;

    switch (stepId) {
      case 'MODEL_SELECTION':
        setModelImage(null);
        setAppState('MODEL_SELECTION');
        break;
      case 'GARMENT_UPLOAD':
        if (modelImage) {
          setGarmentImage(null);
          setAppState('GARMENT_UPLOAD');
        }
        break;
      case 'RESULT':
        if (modelImage && garmentImage && resultImages.length > 0) {
          setAppState('RESULT');
        }
        break;
    }
  };

  const activeStepIndex = STEPS.findIndex((step) => step.id === appState);
  const resultStepIndex = STEPS.findIndex((step) => step.id === 'RESULT');

  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="frosted-glass flex items-center gap-2 rounded-full border border-white/30 p-2 shadow-lg">
        {STEPS.map((step, index) => {
          const isCompleted = isStepCompleted(step.id);
          const isActive =
            appState === 'LOADING'
              ? index === resultStepIndex
              : activeStepIndex === index;
          
          // Determine if step is clickable
          const isClickable = () => {
            if (appState === 'LOADING') return false;
            if (step.id === 'MODEL_SELECTION') return true;
            if (step.id === 'GARMENT_UPLOAD') return !!modelImage;
            if (step.id === 'RESULT') return isCompleted;
            return false;
          };

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              disabled={!isClickable()}
              className={cn(
                "flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                "h-10 w-10 md:w-auto md:px-4 md:py-2 md:gap-2",
                isCompleted ? "bg-blue-600 text-white" : "text-slate-600",
                isActive && "bg-blue-700 text-white shadow-sm ring-2 ring-white/50",
                isClickable() ? "hover:bg-blue-500 hover:text-white cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
            >
              <step.icon className="h-5 w-5 shrink-0" />
              <span className="hidden md:inline">{step.name}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
