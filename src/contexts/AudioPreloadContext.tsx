import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { KILLERS } from '../data/killers';

// Collect all unique audio file names from killers data
function getAllAudioFiles(): string[] {
  const files = new Set<string>();
  
  KILLERS.forEach(killer => {
    // Add terror radius themes
    killer.audio.terrorRadius?.themes.forEach(theme => {
      files.add(theme);
    });
    
    // Add lullabies
    killer.audio.lullabies.forEach(lullaby => {
      files.add(lullaby.id);
    });
  });
  
  return Array.from(files);
}

interface AudioPreloadContextType {
  isLoading: boolean;
  loadingProgress: number;
  audioCache: Map<string, HTMLAudioElement>;
  getAudio: (theme: string) => HTMLAudioElement | null;
}

const AudioPreloadContext = createContext<AudioPreloadContextType | null>(null);

interface AudioPreloadProviderProps {
  children: ReactNode;
}

export function AudioPreloadProvider({ children }: AudioPreloadProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [audioCache] = useState<Map<string, HTMLAudioElement>>(() => new Map());

  useEffect(() => {
    const audioFiles = getAllAudioFiles();
    const totalFiles = audioFiles.length;
    let loadedCount = 0;

    const loadAudio = (fileName: string): Promise<void> => {
      return new Promise((resolve) => {
        const audio = new Audio();
        audio.preload = 'auto';
        
        const handleLoad = () => {
          audioCache.set(fileName, audio);
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalFiles) * 100));
          resolve();
        };

        const handleError = () => {
          console.warn(`Failed to preload audio: ${fileName}`);
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalFiles) * 100));
          resolve(); // Resolve anyway to not block other files
        };

        audio.addEventListener('canplaythrough', handleLoad, { once: true });
        audio.addEventListener('error', handleError, { once: true });
        
        audio.src = `/audio/${fileName}.ogg`;
        audio.load();
      });
    };

    // Load all audio files in parallel
    Promise.all(audioFiles.map(loadAudio)).then(() => {
      setIsLoading(false);
    });
  }, [audioCache]);

  const getAudio = useCallback((theme: string): HTMLAudioElement | null => {
    return audioCache.get(theme) || null;
  }, [audioCache]);

  return (
    <AudioPreloadContext.Provider value={{ isLoading, loadingProgress, audioCache, getAudio }}>
      {children}
    </AudioPreloadContext.Provider>
  );
}

export function useAudioPreload(): AudioPreloadContextType {
  const context = useContext(AudioPreloadContext);
  if (!context) {
    throw new Error('useAudioPreload must be used within an AudioPreloadProvider');
  }
  return context;
}
