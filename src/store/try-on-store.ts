
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AppState = 'WELCOME' | 'MODEL_SELECTION' | 'GARMENT_UPLOAD' | 'LOADING' | 'RESULT';

interface TryOnState {
  appState: AppState;
  modelImage: string | null;
  garmentImage: string | null;
  resultImages: string[];
  styleDescription: string;
  styleAssessment: string | null;
  isAssessingStyle: boolean;
  setAppState: (state: AppState) => void;
  setModelImage: (image: string | null) => void;
  setGarmentImage: (image: string | null) => void;
  setResultImages: (images: string[]) => void;
  setStyleDescription: (description: string) => void;
  setStyleAssessment: (assessment: string | null) => void;
  setIsAssessingStyle: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  appState: 'WELCOME' as AppState,
  modelImage: null,
  garmentImage: null,
  resultImages: [],
  styleDescription: '',
  styleAssessment: null,
  isAssessingStyle: false,
};

export const useTryOnStore = create<TryOnState>()(
  persist(
    (set) => ({
      ...initialState,
      setAppState: (state) => set({ appState: state }),
      setModelImage: (image) => set({ modelImage: image }),
      setGarmentImage: (image) => set({ garmentImage: image }),
      setResultImages: (images) => set({ resultImages: images }),
      setStyleDescription: (description) => set({ styleDescription: description }),
      setStyleAssessment: (assessment) => set({ styleAssessment: assessment }),
      setIsAssessingStyle: (loading) => set({ isAssessingStyle: loading }),
      reset: () => set(initialState),
    }),
    {
      name: 'virtual-try-on-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
