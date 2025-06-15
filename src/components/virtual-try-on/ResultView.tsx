
import { useTryOnStore } from '@/store/try-on-store';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import { useState, useEffect, useCallback } from 'react';
import { openAiApi } from '@/services/openai-api';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Skeleton } from '../ui/skeleton';
import { ApiKeyManager } from './ApiKeyManager';

export function ResultView() {
  const { 
    resultImages, 
    reset, 
    styleDescription, 
    setStyleDescription,
    styleAssessment,
    setStyleAssessment,
    isAssessingStyle,
    setIsAssessingStyle,
  } = useTryOnStore();
  const { toast } = useToast();
  const [apiKeyExists, setApiKeyExists] = useState(false);

  const checkApiKey = useCallback(() => {
    const key = openAiApi.getApiKey();
    setApiKeyExists(!!key);
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImages[0];
    link.download = 'virtual-try-on-result.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleAssessStyle = async () => {
    if (!styleDescription) {
        toast({ title: "Style Description Missing", description: "Please describe your style preference.", variant: "destructive"});
        return;
    }
    setIsAssessingStyle(true);
    setStyleAssessment(null);
    try {
        const assessment = await openAiApi.assessStyle(resultImages[0], styleDescription);
        setStyleAssessment(assessment);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            title: "Assessment Failed",
            description: errorMessage,
            variant: "destructive",
            duration: 9000
        })
    } finally {
        setIsAssessingStyle(false);
    }
  }

  const handleReset = () => {
    setStyleAssessment(null);
    setStyleDescription('');
    reset();
  }

  return (
    <div className="w-full flex flex-col items-center justify-center animate-fade-in gap-8 p-4">
      <h1 className="text-4xl font-bold text-center text-slate-800">Here's Your New Look!</h1>
      <div className="w-full grid md:grid-cols-2 gap-8 max-w-4xl">
        <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full max-w-md aspect-[3/4] rounded-4xl bg-slate-200 overflow-hidden shadow-2xl">
                <img src={resultImages[0]} alt="Virtual try-on result" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-4">
                <Button onClick={handleDownload} size="lg" className="rounded-full px-6 py-6">
                    <Icons.Download className="mr-2 h-5 w-5"/>
                    Download
                </Button>
                <Button onClick={handleReset} size="lg" variant="outline" className="rounded-full px-6 py-6">
                    <Icons.RefreshCcw className="mr-2 h-5 w-5"/>
                    Try Another
                </Button>
            </div>
        </div>
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-slate-700">AI Style Assessment</h2>
            
            <ApiKeyManager onKeySet={checkApiKey} />

            {apiKeyExists && (
            <>
                <div className="flex flex-col gap-2">
                    <label htmlFor="style-desc" className="font-medium text-slate-600">Describe your style</label>
                    <Textarea 
                        id="style-desc"
                        placeholder="e.g., 'casual and comfy', 'bohemian chic', 'minimalist and modern'"
                        value={styleDescription}
                        onChange={(e) => setStyleDescription(e.target.value)}
                        className="min-h-[80px]"
                    />
                </div>
                <Button onClick={handleAssessStyle} disabled={!styleDescription || isAssessingStyle}>
                    <Icons.Sparkles className="mr-2 h-5 w-5"/>
                    {isAssessingStyle ? "Assessing..." : "Assess My Style"}
                </Button>
                <div className="mt-4 p-4 border rounded-lg bg-white min-h-[100px]">
                    {isAssessingStyle ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : styleAssessment ? (
                        <p className="text-slate-700 whitespace-pre-wrap">{styleAssessment}</p>
                    ) : (
                        <p className="text-slate-500 text-center">Your style assessment will appear here.</p>
                    )}
                </div>
            </>
            )}
        </div>
      </div>
    </div>
  );
}
