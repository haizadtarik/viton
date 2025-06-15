
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

  const currentStateIndex = (() => {
    if (appState === 'WELCOME') {
      return -1;
    }
    if (appState === 'RESULT') {
      // All steps are completed
      return STEPS.length;
    }
    if (appState === 'LOADING') {
      // While loading, we show Result as "active" and previous steps as "completed".
      return STEPS.findIndex(s => s.id === 'RESULT');
    }
    return STEPS.findIndex(step => step.id === appState);
  })();

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
