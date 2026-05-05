import { create } from "zustand";
import { EffectName } from "../../../../types/session";
import { ItemLoadState } from "../types";

type FotoBoothCarouselState = {
  index: number;
  activeEffect: EffectName;
  gifHintVisible: boolean;
  isGeneratingAsset: boolean;
  isSuccessCtaOpen: boolean;
  itemStates: Record<number, ItemLoadState>;
  setIndex: (index: number) => void;
  setActiveEffect: (effect: EffectName) => void;
  setIsGeneratingAsset: (isGeneratingAsset: boolean) => void;
  openSuccessCta: () => void;
  closeSuccessCta: () => void;
  setGifHintVisible: (gifHintVisible: boolean) => void;
  markItemLoaded: (index: number) => void;
  markItemError: (index: number) => void;
  retryItem: (index: number) => void;
  reset: () => void;
};

const initialState = {
  index: 0,
  activeEffect: "original" as EffectName,
  gifHintVisible: false,
  isGeneratingAsset: false,
  isSuccessCtaOpen: false,
  itemStates: {} as Record<number, ItemLoadState>,
};

export const useFotoBoothCarouselStore = create<FotoBoothCarouselState>(
  (set) => ({
    ...initialState,
    setIndex: (index) =>
      set({
        index,
        activeEffect: "original",
        isGeneratingAsset: false,
        isSuccessCtaOpen: false,
        gifHintVisible: false,
      }),
    setActiveEffect: (activeEffect) => set({ activeEffect }),
    setIsGeneratingAsset: (isGeneratingAsset) => set({ isGeneratingAsset }),
    openSuccessCta: () =>
      set({
        isSuccessCtaOpen: true,
        isGeneratingAsset: false,
      }),
    closeSuccessCta: () => set({ isSuccessCtaOpen: false }),
    setGifHintVisible: (gifHintVisible) => set({ gifHintVisible }),
    markItemLoaded: (index) =>
      set((state) => ({
        gifHintVisible: false,
        itemStates: {
          ...state.itemStates,
          [index]: {
            retryCount: state.itemStates[index]?.retryCount ?? 0,
            status: "loaded",
          },
        },
      })),
    markItemError: (index) =>
      set((state) => ({
        gifHintVisible: false,
        itemStates: {
          ...state.itemStates,
          [index]: {
            retryCount: state.itemStates[index]?.retryCount ?? 0,
            status: "error",
          },
        },
      })),
    retryItem: (index) =>
      set((state) => ({
        gifHintVisible: false,
        itemStates: {
          ...state.itemStates,
          [index]: {
            retryCount: (state.itemStates[index]?.retryCount ?? 0) + 1,
            status: "idle",
          },
        },
      })),
    reset: () => set(initialState),
  }),
);
