
import { useTryOnStore } from '@/store/try-on-store';
import { Button } from '../ui/button';
import { Icons } from '../icons';

export function WelcomeScreen() {
    const { setAppState } = useTryOnStore();
    return (
        <div className="text-center animate-fade-in">
            <h1 className="text-6xl font-bold text-slate-800">Virtual Try-On</h1>
            <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
                See how an outfit looks on you in seconds. Powered by AI.
            </p>
            <Button onClick={() => setAppState('MODEL_CAPTURE')} size="lg" className="mt-12 rounded-full px-10 py-8 text-xl font-bold shadow-lg animate-pulse-subtle bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700">
                <Icons.Camera className="mr-3 h-7 w-7"/>
                Start Try-On
            </Button>
        </div>
    );
}
