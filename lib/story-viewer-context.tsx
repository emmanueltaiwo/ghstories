'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const StoryViewerOpenContext = createContext<{
  isStoryViewerOpen: boolean;
  setStoryViewerOpen: (open: boolean) => void;
}>({ isStoryViewerOpen: false, setStoryViewerOpen: () => {} });

export function StoryViewerOpenProvider({ children }: { children: ReactNode }) {
  const [isStoryViewerOpen, setStoryViewerOpen] = useState(false);
  return (
    <StoryViewerOpenContext.Provider
      value={{ isStoryViewerOpen, setStoryViewerOpen: useCallback(setStoryViewerOpen, []) }}
    >
      {children}
    </StoryViewerOpenContext.Provider>
  );
}

export function useStoryViewerOpen() {
  return useContext(StoryViewerOpenContext);
}
