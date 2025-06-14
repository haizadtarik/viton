
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AppState = 'WELCOME' | 'MODEL_CAPTURE' | 'GARMENT_UPLOAD' | 'LOADING' | 'RESULT';

interface TryOnState {
  appState: AppState;
  modelImage: string | null;
  garmentImage: string | null;
  resultImages: string[];
  setAppState: (state: AppState) => void;
  setModelImage: (image: string | null) => void;
  setGarmentImage: (image: string | null) => void;
  setResultImages: (images: string[]) => void;
  reset: () => void;
}

const initialState = {
  appState: 'WELCOME' as AppState,
  modelImage: null,
  garmentImage: null,
  resultImages: [],
};

export const useTryOnStore = create<TryOnState>()(
  persist(
    (set) => ({
      ...initialState,
      setAppState: (state) => set({ appState: state }),
      setModelImage: (image) => set({ modelImage: image }),
      setGarmentImage: (image) => set({ garmentImage: image }),
      setResultImages: (images) => set({ resultImages: images }),
      reset: () => set(initialState),
    }),
    {
      name: 'virtual-try-on-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
