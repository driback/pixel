"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { useShallow } from "zustand/shallow";

type PixelateState = {
  originalImage: string | null;
  pixelateImage: string | null;
  pixel: number;
  pixelSizes: number[];
};

type PixelateAction = {
  setPixel: (pixel: number) => void;
  setPixelateImage: (image: string) => void;
  setOriginalImage: (image: string) => void;
};

type PixelateStore = PixelateState & PixelateAction;

const defaultInitState: PixelateState = {
  originalImage: null,
  pixelateImage: null,
  pixel: 8,
  pixelSizes: [0, 4, 8, 16, 24, 32, 64],
};

const createPixelateStore = (initialState: PixelateState = defaultInitState) =>
  createStore<PixelateStore>()((set) => ({
    ...initialState,
    setPixel: (pixel) => set({ pixel }),
    setOriginalImage: (originalImage) => set({ originalImage }),
    setPixelateImage: (pixelateImage) => set({ pixelateImage }),
  }));

export type PixelateStoreApi = ReturnType<typeof createPixelateStore>;

const PixelateStoreContext = createContext<PixelateStoreApi | undefined>(undefined);

export const PixelateStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<PixelateStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createPixelateStore();
  }

  return (
    <PixelateStoreContext.Provider value={storeRef.current}>
      {children}
    </PixelateStoreContext.Provider>
  );
};

export const usePixelateStore = <T,>(selector: (store: PixelateStore) => T): T => {
  const pixelateStoreContext = useContext(PixelateStoreContext);

  if (!pixelateStoreContext) {
    throw new Error("useQueueStore must be used within QueueStoreProvider");
  }

  return useStore(pixelateStoreContext, useShallow(selector));
};
