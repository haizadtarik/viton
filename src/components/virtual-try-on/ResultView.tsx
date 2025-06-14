
import { useTryOnStore } from '@/store/try-on-store';
import { Button } from '../ui/button';
import { Icons } from '../icons';

export function ResultView() {
  const { resultImages, reset } = useTryOnStore();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImages[0];
    link.download = 'virtual-try-on-result.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in gap-8">
      <h1 className="text-4xl font-bold text-center text-slate-800">Here's Your New Look!</h1>
      <div className="w-full max-w-lg aspect-[3/4] rounded-4xl bg-slate-200 overflow-hidden shadow-2xl">
        <img src={resultImages[0]} alt="Virtual try-on result" className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-4">
        <Button onClick={handleDownload} size="lg" className="rounded-full px-6 py-6">
            <Icons.Download className="mr-2 h-5 w-5"/>
            Download
        </Button>
        <Button onClick={reset} size="lg" variant="outline" className="rounded-full px-6 py-6">
            <Icons.RefreshCcw className="mr-2 h-5 w-5"/>
            Try Another
        </Button>
      </div>
    </div>
  );
}
