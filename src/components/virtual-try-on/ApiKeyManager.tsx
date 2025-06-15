
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { openAiApi } from '@/services/openai-api';
import { useToast } from '@/hooks/use-toast';

export const ApiKeyManager = ({ onKeySet }: { onKeySet: () => void }) => {
    const [apiKey, setApiKey] = useState('');
    const [currentKey, setCurrentKey] = useState(openAiApi.getApiKey());
    const { toast } = useToast();

    const handleSave = () => {
        if (apiKey) {
            openAiApi.setApiKey(apiKey);
            toast({ title: "API Key Saved", description: "Your OpenAI API key has been saved." });
            setApiKey('');
            setCurrentKey(apiKey);
            onKeySet();
        }
    };
    
    const handleClear = () => {
        openAiApi.setApiKey('');
        toast({ title: "API Key Cleared"});
        setCurrentKey(null);
        onKeySet();
    }
    
    if(currentKey) {
        return (
            <div className="flex items-center gap-2 p-4 border rounded-lg bg-slate-50 justify-between">
                <p className="text-sm text-slate-600">OpenAI API Key is set.</p>
                <Button onClick={handleClear} variant="link" size="sm">Remove key</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-slate-50">
            <h3 className="font-semibold text-slate-700">Set OpenAI API Key</h3>
            <p className="text-sm text-slate-500">To use the style assessment feature, please provide your key. It's stored only in your browser.</p>
            <div className="flex items-center gap-2">
                <Input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-white"
                />
                <Button onClick={handleSave} disabled={!apiKey}>Save Key</Button>
            </div>
        </div>
    )
}
