import { create } from "zustand";
import { EffectName } from "../../../../types/session";
import { CtaSource, ItemLoadState } from "../types";

type FotoBoothCarouselState = {
  index: number;
  activeEffect: EffectName;
  gifHintVisible: boolean;
  pickerAction: CtaSource | null;
  isPickerOpen: boolean;
  isGeneratingAsset: boolean;
  isSuccessCtaOpen: boolean;
  shareFallbackFile: File | null;
  shareFallbackPreviewUrl: string | null;
  isShareFallbackOpen: boolean;
  itemStates: Record<number, ItemLoadState>;
  setIndex: (index: number) => void;
  setActiveEffect: (effect: EffectName) => void;
  openPicker: (action: CtaSource) => void;
  closePicker: () => void;
  setIsGeneratingAsset: (isGeneratingAsset: boolean) => void;
  openSuccessCta: () => void;
  closeSuccessCta: () => void;
  openShareFallback: (file: File, previewUrl: string) => void;
  closeShareFallback: () => void;
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
  pickerAction: null as CtaSource | null,
  isPickerOpen: false,
  isGeneratingAsset: false,
  isSuccessCtaOpen: false,
  shareFallbackFile: null as File | null,
  shareFallbackPreviewUrl: null as string | null,
  isShareFallbackOpen: false,
  itemStates: {} as Record<number, ItemLoadState>,
};

export const useFotoBoothCarouselStore = create<FotoBoothCarouselState>(
  (set) => ({
    ...initialState,
    setIndex: (index) =>
      set({
        index,
        activeEffect: "original",
        isPickerOpen: false,
        pickerAction: null,
        isSuccessCtaOpen: false,
        isShareFallbackOpen: false,
        shareFallbackFile: null,
        shareFallbackPreviewUrl: null,
        gifHintVisible: false,
      }),
    setActiveEffect: (activeEffect) => set({ activeEffect }),
    openPicker: (pickerAction) =>
      set({
        pickerAction,
        isPickerOpen: true,
        isSuccessCtaOpen: false,
      }),
    closePicker: () =>
      set({
        isPickerOpen: false,
        pickerAction: null,
        isGeneratingAsset: false,
      }),
    setIsGeneratingAsset: (isGeneratingAsset) => set({ isGeneratingAsset }),
    openSuccessCta: () =>
      set({
        isSuccessCtaOpen: true,
        isPickerOpen: false,
        pickerAction: null,
        isShareFallbackOpen: false,
        shareFallbackFile: null,
        shareFallbackPreviewUrl: null,
        isGeneratingAsset: false,
      }),
    closeSuccessCta: () => set({ isSuccessCtaOpen: false }),
    openShareFallback: (shareFallbackFile, shareFallbackPreviewUrl) =>
      set({
        isShareFallbackOpen: true,
        isSuccessCtaOpen: false,
        shareFallbackFile,
        shareFallbackPreviewUrl,
      }),
    closeShareFallback: () =>
      set({
        isShareFallbackOpen: false,
        shareFallbackFile: null,
        shareFallbackPreviewUrl: null,
      }),
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
