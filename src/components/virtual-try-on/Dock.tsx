
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useTryOnStore } from '@/store/try-on-store';

const STEPS = [
  { id: 'MODEL_SELECTION', name: 'Model', icon: Icons.User },
  { id: 'GARMENT_UPLOAD', name: 'Garment', icon: Icons.Shirt },
  { id: 'RESULT', name: 'Result', icon: Icons.Sparkles },
];

export function Dock() {
  const { appState } = useTryOnStore();

  const currentStateIndex = STEPS.findIndex(step => 
      appState === 'WELCOME' ? -1 : 
      appState === 'LOADING' ? STEPS.findIndex(s => s.id === 'GARMENT_UPLOAD') :
      step.id === appState
  );

  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="frosted-glass flex items-center gap-2 rounded-full border border-white/30 p-2 shadow-lg">
        {STEPS.map((step, index) => {
          const isCompleted = currentStateIndex > index;
          const isActive = currentStateIndex === index;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                isCompleted ? "bg-blue-600 text-white" : "text-slate-600",
                isActive && "bg-white shadow-sm text-blue-700"
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
