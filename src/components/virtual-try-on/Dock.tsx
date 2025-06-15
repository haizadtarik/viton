
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useTryOnStore } from '@/store/try-on-store';

const STEPS = [
  { id: 'MODEL_SELECTION', name: 'Model', icon: Icons.User },
  { id: 'GARMENT_UPLOAD', name: 'Garment', icon: Icons.Shirt },
  { id: 'RESULT', name: 'Result', icon: Icons.Sparkles },
];

export function Dock() {
  const { appState, modelImage, garmentImage, resultImages } = useTryOnStore();

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

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                isCompleted ? "bg-blue-600 text-white" : "text-slate-600",
                isActive && "bg-blue-700 text-white shadow-sm ring-2 ring-white/50"
              )}
            >
              <step.icon className="h-5 w-5" />
              <span>{step.name}</span>
            </div>
          );
        })}
      </div>
    </footer>
  );
}
