
import { Icons } from "../icons";
import { Progress } from "../ui/progress";
import { useEffect, useState } from "react";

const messages = [
  "Stitching the pixels...",
  "Styling the model...",
  "Getting the perfect fit...",
  "Almost ready to unveil...",
];

export function LoadingView() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        // Cycle through messages every 10 seconds
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 10000);
        
        // Update progress every 2 seconds
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return prev; // Stop at 95% to avoid reaching 100% without completion
                return prev + 2;
            });
        }, 2000);
        
        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []);
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in gap-6">
            <Icons.Loader className="h-24 w-24 text-blue-600 animate-spin"/>
            <h2 className="text-2xl font-semibold text-slate-700">{messages[messageIndex]}</h2>
            <div className="w-80 space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-slate-500 text-center">
                    This usually takes 3-5 minutes...
                </p>
            </div>
        </div>
    );
}
