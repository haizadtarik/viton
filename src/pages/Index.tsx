
import { useTryOnStore } from '@/store/try-on-store';
import { WelcomeScreen } from '@/components/virtual-try-on/WelcomeScreen';
import { ModelSelection } from '@/components/virtual-try-on/ModelSelection';
import { GarmentUpload } from '@/components/virtual-try-on/GarmentUpload';
import { LoadingView } from '@/components/virtual-try-on/LoadingView';
import { ResultView } from '@/components/virtual-try-on/ResultView';
import { Dock } from '@/components/virtual-try-on/Dock';
import { useEffect, useState } from 'react';

const Index = () => {
  // This ensures the store is rehydrated from localStorage before rendering.
  const [isHydrated, setIsHydrated] = useState(false);
  const { appState } = useTryOnStore();
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const renderContent = () => {
    if (!isHydrated) {
      return null; // Or a loading spinner
    }
    switch (appState) {
      case 'WELCOME':
        return <WelcomeScreen />;
      case 'MODEL_SELECTION':
        return <ModelSelection />;
      case 'GARMENT_UPLOAD':
        return <GarmentUpload />;
      case 'LOADING':
        return <LoadingView />;
      case 'RESULT':
        return <ResultView />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {renderContent()}
      {isHydrated && appState !== 'WELCOME' && <Dock />}
    </div>
  );
};

export default Index;
