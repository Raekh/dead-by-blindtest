import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface VolumeContextType {
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const VolumeContext = createContext<VolumeContextType | null>(null);

const STORAGE_KEY = 'dbd-blindtest-volume';
const MUTED_STORAGE_KEY = 'dbd-blindtest-muted';
const DEFAULT_VOLUME = 0.5;

export function VolumeProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        return parsed;
      }
    }
    return DEFAULT_VOLUME;
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const stored = localStorage.getItem(MUTED_STORAGE_KEY);
    return stored === 'true';
  });

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    localStorage.setItem(STORAGE_KEY, clampedVolume.toString());
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      localStorage.setItem(MUTED_STORAGE_KEY, newMuted.toString());
      return newMuted;
    });
  }, []);

  // Persist volume on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, volume.toString());
  }, [volume]);

  return (
    <VolumeContext.Provider value={{ volume, setVolume, isMuted, toggleMute }}>
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume() {
  const context = useContext(VolumeContext);
  if (!context) {
    throw new Error('useVolume must be used within a VolumeProvider');
  }
  return context;
}
