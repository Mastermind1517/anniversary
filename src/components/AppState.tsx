import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface AppContextType {
  scrollOffset: number;
  currentScene: number;
  hasEntered: boolean;
  activePhotoId: number | null;
  isLetterOpen: boolean;
  setScrollOffset: (offset: number) => void;
  setCurrentScene: (scene: number) => void;
  setHasEntered: (v: boolean) => void;
  setActivePhotoId: (id: number | null) => void;
  setIsLetterOpen: (open: boolean) => void;
  registerScrollEl: (el: HTMLDivElement | null) => void;
  scrollTo: (targetOffset: number, smooth?: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  scrollOffset: 0,
  currentScene: 0,
  hasEntered: false,
  activePhotoId: null,
  isLetterOpen: false,
  setScrollOffset: () => {},
  setCurrentScene: () => {},
  setHasEntered: () => {},
  setActivePhotoId: () => {},
  setIsLetterOpen: () => {},
  registerScrollEl: () => {},
  scrollTo: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [activePhotoId, setActivePhotoId] = useState<number | null>(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const scrollElRef = useRef<HTMLDivElement | null>(null);

  const registerScrollEl = useCallback((el: HTMLDivElement | null) => {
    scrollElRef.current = el;
  }, []);

  const scrollTo = useCallback((targetOffset: number, smooth: boolean = true) => {
    const el = scrollElRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const targetTop = targetOffset * maxScroll;
    if (smooth) {
      el.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else {
      el.scrollTop = targetTop;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        scrollOffset,
        currentScene,
        hasEntered,
        activePhotoId,
        isLetterOpen,
        setScrollOffset,
        setCurrentScene,
        setHasEntered,
        setActivePhotoId,
        setIsLetterOpen,
        registerScrollEl,
        scrollTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}
