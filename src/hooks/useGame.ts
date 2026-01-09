import { useState, useCallback, useRef, useEffect } from 'react';
import { KILLERS, THEME_RANGES, findKiller, Killer, AudioRange, isGenericTheme } from '../data/killers';
import { useVolume } from '../contexts/VolumeContext';

const TOTAL_ROUNDS = 10;
const HINT_LEVELS = ['far', 'mid', 'close', 'chase'] as const;
type HintLevel = typeof HINT_LEVELS[number];

// Points awarded based on which hint level the player guessed correctly on
const POINTS_BY_HINT_LEVEL: Record<HintLevel, number> = {
  far: 4,
  mid: 3,
  close: 2,
  chase: 1,
};

export type Screen = 'start' | 'game' | 'results';

export interface GameResult {
  killer: Killer;
  guesses: string[];
  correct: boolean;
  hintLevel: HintLevel | null; // The hint level where they got it right, or null if skipped
  points: number;
}

export interface Feedback {
  type: 'correct' | 'incorrect' | 'skip';
  message: string;
}

export interface RoundState {
  currentHintIndex: number; // 0 = far, 1 = mid, 2 = close, 3 = chase
  guesses: string[]; // All guesses made this round
  isPlaying: boolean;
  hasPlayedCurrentHint: boolean;
}

export interface UseGameReturn {
  screen: Screen;
  currentRound: number;
  totalRounds: number;
  score: number;
  results: GameResult[];
  currentKiller: Killer | null;
  currentTheme: string | null;
  isGenericRound: boolean;
  roundState: RoundState;
  feedback: Feedback | null;
  inputDisabled: boolean;
  audioError: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  hintLevels: readonly typeof HINT_LEVELS[number][];
  currentRanges: AudioRange[] | null;
  startGame: () => void;
  playHint: (hintIndex: number) => void;
  stopAudio: () => void;
  submitGuess: (guess: string) => void;
  skipRound: () => void;
  restartGame: () => void;
}

export function useGame(): UseGameReturn {
  const { volume, isMuted } = useVolume();
  const [screen, setScreen] = useState<Screen>('start');
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [selectedKillers, setSelectedKillers] = useState<Killer[]>([]);
  const [currentKiller, setCurrentKiller] = useState<Killer | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [audioError, setAudioError] = useState(false);
  const [genericThemeUsedThisGame, setGenericThemeUsedThisGame] = useState(false);
  const [isGenericRound, setIsGenericRound] = useState(false);
  
  const [roundState, setRoundState] = useState<RoundState>({
    currentHintIndex: 0,
    guesses: [],
    isPlaying: false,
    hasPlayedCurrentHint: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get the current audio ranges based on the selected theme
  const currentRanges = currentTheme ? (THEME_RANGES[currentTheme] || null) : null;

  // Select random killers for the game
  // At most 1 killer that ONLY has generic themes can be selected
  const selectRandomKillers = useCallback((): Killer[] => {
    // Only select killers with terror radius
    const killersWithTR = KILLERS.filter(k => k.audio.terrorRadius !== null);
    
    // Separate killers into those with unique themes and those with only generic themes
    const killersWithUniqueThemes = killersWithTR.filter(k => 
      k.audio.terrorRadius?.themes.some(t => !isGenericTheme(t))
    );
    const killersWithOnlyGeneric = killersWithTR.filter(k => 
      k.audio.terrorRadius?.themes.every(t => isGenericTheme(t))
    );
    
    // Shuffle both arrays
    const shuffledUnique = [...killersWithUniqueThemes].sort(() => Math.random() - 0.5);
    const shuffledGeneric = [...killersWithOnlyGeneric].sort(() => Math.random() - 0.5);
    
    // Pick at most 1 generic-only killer for the game
    const selectedGeneric = shuffledGeneric.slice(0, 1);
    const remainingSlots = TOTAL_ROUNDS - selectedGeneric.length;
    const selectedUnique = shuffledUnique.slice(0, remainingSlots);
    
    // Combine and shuffle the final selection
    const selected = [...selectedGeneric, ...selectedUnique].sort(() => Math.random() - 0.5);
    return selected.slice(0, TOTAL_ROUNDS);
  }, []);

  // Get a random theme for a killer (respects genericThemeUsed flag)
  const getRandomTheme = useCallback((killer: Killer, genericAlreadyUsed: boolean): { theme: string | null; isGeneric: boolean } => {
    const themes = killer.audio.terrorRadius?.themes || [];
    if (themes.length === 0) return { theme: null, isGeneric: false };
    
    // Separate generic and unique themes
    const genericThemes = themes.filter(t => isGenericTheme(t));
    const uniqueThemes = themes.filter(t => !isGenericTheme(t));
    
    // If generic already used this game, only pick from unique themes if available
    if (genericAlreadyUsed && uniqueThemes.length > 0) {
      return { 
        theme: uniqueThemes[Math.floor(Math.random() * uniqueThemes.length)], 
        isGeneric: false 
      };
    }
    
    // If generic already used but only generic themes available, still use one
    // (this killer can only use generic themes)
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    return { 
      theme: selectedTheme, 
      isGeneric: isGenericTheme(selectedTheme) 
    };
  }, []);

  // Stop audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setRoundState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  // Play a specific hint level
  const playHint = useCallback((hintIndex: number) => {
    if (!audioRef.current || !currentTheme || !currentRanges) return;
    if (hintIndex > roundState.currentHintIndex) return; // Can't play locked hints

    const range = currentRanges[hintIndex];
    if (!range) return;

    const audio = audioRef.current;
    
    // Apply volume settings
    audio.volume = isMuted ? 0 : volume;
    
    // Set the audio source if not already set
    if (!audio.src || !audio.src.includes(currentTheme)) {
      audio.src = `/audio/${currentTheme}.ogg`;
    }

    // Seek to the start of the range and play
    const playFromRange = () => {
      audio.currentTime = range.start;
      audio.volume = isMuted ? 0 : volume;
      audio.play()
        .then(() => {
          setRoundState(prev => ({ 
            ...prev, 
            isPlaying: true, 
            hasPlayedCurrentHint: true 
          }));
          setInputDisabled(false);
        })
        .catch((err) => {
          console.error('Audio playback failed:', err);
          setAudioError(true);
          setInputDisabled(false);
        });
    };

    if (audio.readyState >= 1) {
      playFromRange();
    } else {
      audio.addEventListener('loadedmetadata', playFromRange, { once: true });
      audio.load();
    }

    // Stop at the end of the range
    const checkEnd = () => {
      if (audio.currentTime >= (range.end || audio.duration)) {
        audio.pause();
        setRoundState(prev => ({ ...prev, isPlaying: false }));
      }
    };

    audio.addEventListener('timeupdate', checkEnd);
    
    // Cleanup listener when audio stops or is paused
    const cleanup = () => {
      audio.removeEventListener('timeupdate', checkEnd);
    };
    audio.addEventListener('pause', cleanup, { once: true });
    audio.addEventListener('ended', cleanup, { once: true });
  }, [currentTheme, currentRanges, roundState.currentHintIndex, volume, isMuted]);

  // Initialize a new round
  const initializeRound = useCallback((killer: Killer, genericAlreadyUsed: boolean): boolean => {
    const { theme, isGeneric } = getRandomTheme(killer, genericAlreadyUsed);
    setCurrentKiller(killer);
    setCurrentTheme(theme);
    setIsGenericRound(isGeneric);
    setFeedback(null);
    setInputDisabled(true);
    setAudioError(false);
    setRoundState({
      currentHintIndex: 0,
      guesses: [],
      isPlaying: false,
      hasPlayedCurrentHint: false,
    });

    // Load audio
    if (audioRef.current && theme) {
      audioRef.current.src = `/audio/${theme}.ogg`;
      audioRef.current.load();
    }
    
    // Return whether this round uses a generic theme
    return isGeneric;
  }, [getRandomTheme]);

  // Next round
  const nextRound = useCallback(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      setScreen('results');
      return;
    }

    const nextKiller = selectedKillers[currentRound];
    setCurrentRound((prev) => prev + 1);
    
    // Pass current generic theme status, update if this round uses generic
    const usedGeneric = initializeRound(nextKiller, genericThemeUsedThisGame);
    if (usedGeneric && !genericThemeUsedThisGame) {
      setGenericThemeUsedThisGame(true);
    }
  }, [currentRound, selectedKillers, initializeRound, genericThemeUsedThisGame]);

  // Start game
  const startGame = useCallback(() => {
    const killers = selectRandomKillers();
    setSelectedKillers(killers);
    setCurrentRound(0);
    setScore(0);
    setResults([]);
    setGenericThemeUsedThisGame(false);
    setScreen('game');
    
    // Start first round (no generic theme used yet)
    const firstKiller = killers[0];
    setCurrentRound(1);
    const usedGeneric = initializeRound(firstKiller, false);
    if (usedGeneric) {
      setGenericThemeUsedThisGame(true);
    }
  }, [selectRandomKillers, initializeRound]);

  // Submit guess
  const submitGuess = useCallback((guess: string) => {
    if (!guess.trim() || !currentKiller || !currentTheme) return;

    stopAudio();

    // Check if this is a "Generic (Killer Name)" format guess
    const genericMatch = guess.match(/^Generic \((.+)\)$/);
    const isGenericGuess = genericMatch !== null;
    const killerNameFromGuess = genericMatch ? genericMatch[1] : guess;
    
    const guessedKiller = findKiller(killerNameFromGuess);
    const isExactMatch = guessedKiller !== undefined && guessedKiller.id === currentKiller.id;
    const currentHintLevel = HINT_LEVELS[roundState.currentHintIndex];
    
    // Check for generic theme match - if the current theme is generic,
    // a "Generic" guess for any killer that uses generic themes is valid
    const isCurrentThemeGeneric = isGenericTheme(currentTheme);
    const guessedKillerUsesGeneric = guessedKiller !== undefined && 
      guessedKiller.audio.terrorRadius?.themes.some(t => isGenericTheme(t));
    const isGenericMatch = isCurrentThemeGeneric && isGenericGuess && guessedKillerUsesGeneric;
    
    // Determine if this is a valid correct answer
    const isCorrect = isExactMatch || isGenericMatch;

    // Add guess to the list
    const newGuesses = [...roundState.guesses, guess];
    setRoundState(prev => ({ ...prev, guesses: newGuesses }));

    if (isCorrect) {
      // Correct guess!
      const points = POINTS_BY_HINT_LEVEL[currentHintLevel];
      setScore((prev) => prev + points);

      setResults((prev) => [
        ...prev,
        {
          killer: currentKiller,
          guesses: newGuesses,
          correct: true,
          hintLevel: currentHintLevel,
          points,
        },
      ]);

      // Build feedback message
      let feedbackMessage = `Correct! It was ${currentKiller.name} (+${points} point${points > 1 ? 's' : ''})`;
      if (isGenericMatch && !isExactMatch) {
        feedbackMessage = `Correct! Generic theme - ${currentKiller.name} (+${points} point${points > 1 ? 's' : ''})`;
      }

      setFeedback({
        type: 'correct',
        message: feedbackMessage,
      });

      setInputDisabled(true);

      // Auto-advance after delay
      setTimeout(() => {
        nextRound();
      }, 2000);
    } else {
      if (roundState.currentHintIndex < HINT_LEVELS.length - 1) {
        // Unlock next hint
        setRoundState(prev => ({
          ...prev,
          currentHintIndex: prev.currentHintIndex + 1,
          hasPlayedCurrentHint: false,
          guesses: newGuesses,
        }));

        setFeedback({
          type: 'incorrect',
          message: `Wrong! Next hint unlocked: ${HINT_LEVELS[roundState.currentHintIndex + 1].toUpperCase()}`,
        });
      } else {
        // No more hints - round over
        setResults((prev) => [
          ...prev,
          {
            killer: currentKiller,
            guesses: newGuesses,
            correct: false,
            hintLevel: null,
            points: 0,
          },
        ]);

        setFeedback({
          type: 'incorrect',
          message: `Out of hints! It was ${currentKiller.name}`,
        });

        setInputDisabled(true);

        setTimeout(() => {
          nextRound();
        }, 2000);
      }
    }
  }, [currentKiller, currentTheme, stopAudio, roundState, nextRound]);

  // Skip to next hint (not entire round)
  const skipRound = useCallback(() => {
    if (!currentKiller) return;
    
    stopAudio();

    if (roundState.currentHintIndex < HINT_LEVELS.length - 1) {
      // Skip to next hint level
      setRoundState(prev => ({
        ...prev,
        currentHintIndex: prev.currentHintIndex + 1,
        hasPlayedCurrentHint: false,
      }));

      setFeedback({
        type: 'skip',
        message: `Skipped! Next hint unlocked: ${HINT_LEVELS[roundState.currentHintIndex + 1].toUpperCase()}`,
      });
    } else {
      // No more hints - round over
      setResults((prev) => [
        ...prev,
        {
          killer: currentKiller,
          guesses: [...roundState.guesses, 'Skipped'],
          correct: false,
          hintLevel: null,
          points: 0,
        },
      ]);

      setFeedback({
        type: 'skip',
        message: `Skipped! It was ${currentKiller.name}`,
      });

      setInputDisabled(true);

      setTimeout(() => {
        nextRound();
      }, 2000);
    }
  }, [currentKiller, stopAudio, roundState.guesses, roundState.currentHintIndex, nextRound]);

  // Restart game
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Update audio volume when volume or mute state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Auto-play when hint index changes (after wrong guess or skip)
  const prevHintIndexRef = useRef(roundState.currentHintIndex);
  useEffect(() => {
    // Only auto-play if hint index increased (not on initial render or round change)
    if (roundState.currentHintIndex > prevHintIndexRef.current && !roundState.hasPlayedCurrentHint) {
      // Small delay to let the state settle
      const timer = setTimeout(() => {
        playHint(roundState.currentHintIndex);
      }, 500);
      return () => clearTimeout(timer);
    }
    prevHintIndexRef.current = roundState.currentHintIndex;
  }, [roundState.currentHintIndex, roundState.hasPlayedCurrentHint, playHint]);

  // Auto-play when entering a new round
  const prevRoundRef = useRef(currentRound);
  useEffect(() => {
    // Only auto-play when round changes and we're in the game screen
    if (currentRound !== prevRoundRef.current && currentRound > 0 && screen === 'game') {
      // Small delay to let the audio load
      const timer = setTimeout(() => {
        playHint(0);
      }, 300);
      prevRoundRef.current = currentRound;
      return () => clearTimeout(timer);
    }
    prevRoundRef.current = currentRound;
  }, [currentRound, screen, playHint]);

  return {
    screen,
    currentRound,
    totalRounds: TOTAL_ROUNDS,
    score,
    results,
    currentKiller,
    currentTheme,
    isGenericRound,
    roundState,
    feedback,
    inputDisabled,
    audioError,
    audioRef,
    hintLevels: HINT_LEVELS,
    currentRanges,
    startGame,
    playHint,
    stopAudio,
    submitGuess,
    skipRound,
    restartGame,
  };
}
