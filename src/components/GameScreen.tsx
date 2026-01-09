import { useEffect, useRef, KeyboardEvent } from 'react';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { useI18n } from '../i18n';
import type { Killer, AudioRange } from '../data/killers';
import type { Feedback, RoundState } from '../hooks/useGame';

interface GameScreenProps {
  currentRound: number;
  totalRounds: number;
  score: number;
  currentKiller: Killer | null;
  isGenericRound: boolean;
  roundState: RoundState;
  feedback: Feedback | null;
  inputDisabled: boolean;
  audioError: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  hintLevels: readonly ('far' | 'mid' | 'close' | 'chase')[];
  currentRanges: AudioRange[] | null;
  onPlayHint: (hintIndex: number) => void;
  onStopAudio: () => void;
  onSubmitGuess: (guess: string) => void;
  onSkip: () => void;
}

function GameScreen({
  currentRound,
  totalRounds,
  score,
  isGenericRound,
  roundState,
  feedback,
  inputDisabled,
  audioError,
  audioRef,
  hintLevels,
  currentRanges,
  onPlayHint,
  onStopAudio,
  onSubmitGuess,
  onSkip,
}: GameScreenProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocomplete = useAutocomplete(isGenericRound);

  const HINT_LABELS: Record<string, string> = {
    far: t('far'),
    mid: t('mid'),
    close: t('close'),
    chase: t('chase'),
  };

  const HINT_DESCRIPTIONS: Record<string, string> = {
    far: t('farDesc'),
    mid: t('midDesc'),
    close: t('closeDesc'),
    chase: t('chaseDesc'),
  };

  // Reset autocomplete when round changes
  useEffect(() => {
    autocomplete.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound]);

  // Handle input key down
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const result = autocomplete.handleKeyDown(e);
    if (result !== null && e.key === 'Enter') {
      // If there are suggestions, select the first one
      if (autocomplete.suggestions.length >= 1) {
        const suggestion = autocomplete.suggestions[0];
        onSubmitGuess(suggestion.display);
        autocomplete.reset();
      }
      // If no suggestions, do nothing
    }
  };

  // Handle submit button click
  const handleSubmit = () => {
    // If there's a selected item, use it
    if (autocomplete.selectedItem) {
      onSubmitGuess(autocomplete.selectedItem.display);
      autocomplete.reset();
    }
    // Otherwise, if there are suggestions, select the first one
    else if (autocomplete.suggestions.length >= 1) {
      const suggestion = autocomplete.suggestions[0];
      onSubmitGuess(suggestion.display);
      autocomplete.reset();
    }
    // If no selection and no suggestions, do nothing
  };

  // Get points for a hint level
  const getPointsForHint = (index: number): number => {
    return [4, 3, 2, 1][index] || 0;
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Terror Radius / Audio */}
      <div className="flex-1 flex flex-col p-8 border-r border-border">
        {/* Round & Score Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-accent font-semibold text-2xl">{currentRound}</span>
            <span className="text-text-muted text-lg">/ {totalRounds}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-sm uppercase tracking-wider">{t('score')}</span>
            <span className="text-accent font-bold text-2xl">{score}</span>
          </div>
        </div>

        {/* Terror Radius Section */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-accent uppercase tracking-widest text-sm font-semibold mb-2">
              {t('terrorRadius')}
            </h3>
            <p className="text-text-muted text-sm">
              {roundState.hasPlayedCurrentHint 
                ? t('listenAndGuess')
                : t('clickToHear')}
            </p>
          </div>

          {/* Hint Buttons - Row */}
          <div className="flex gap-3 justify-center mb-8">
            {hintLevels.map((level, index) => {
              const isUnlocked = index <= roundState.currentHintIndex;
              const isCurrent = index === roundState.currentHintIndex;
              const isPlaying = roundState.isPlaying && isCurrent;
              const points = getPointsForHint(index);
              const range = currentRanges?.[index];

              return (
                <button
                  key={level}
                  onClick={() => isUnlocked && onPlayHint(index)}
                  disabled={!isUnlocked}
                  className={`
                    relative flex flex-col items-center justify-center w-24 p-5 rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${isUnlocked 
                      ? isCurrent
                        ? 'bg-bg-card border-2 border-accent'
                        : 'bg-bg-input border border-border hover:border-border-hover'
                      : 'bg-bg-input border border-border cursor-not-allowed opacity-40'
                    }
                    ${isPlaying ? 'animate-pulse-glow' : ''}
                  `}
                >
                  {/* Lock icon for locked hints */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {isUnlocked && (
                    <>
                      <span className={`text-sm font-medium uppercase tracking-wider mb-1 ${isCurrent ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {HINT_LABELS[level]}
                      </span>
                      <span className={`text-2xl font-semibold ${isCurrent ? 'text-accent' : 'text-text-muted'}`}>
                        +{points}
                      </span>
                      {range && (
                        <span className="text-xs text-text-muted mt-1">
                          {Math.floor(range.end ? range.end - range.start : 0)}s
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current hint description */}
          <p className="text-text-muted text-sm text-center mb-6">
            {HINT_DESCRIPTIONS[hintLevels[roundState.currentHintIndex]]}
          </p>

          {/* Play/Stop button */}
          <div className="flex justify-center">
            <button
              onClick={() => roundState.isPlaying ? onStopAudio() : onPlayHint(roundState.currentHintIndex)}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center
                transition-all duration-200 cursor-pointer
                ${roundState.isPlaying
                  ? 'bg-bg-card-hover border-2 border-border-hover'
                  : 'bg-accent hover:bg-accent-hover'
                }
              `}
            >
              {roundState.isPlaying ? (
                <svg className="w-8 h-8 text-text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-bg-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {audioError && (
            <p className="text-error-text text-sm text-center mt-4">
              {t('audioNotFound')}
            </p>
          )}
        </div>
      </div>

      {/* Right Panel - Guessing */}
      <div className="flex-1 flex flex-col p-8 bg-bg-card">
        <h3 className="text-accent uppercase tracking-widest text-sm font-semibold mb-6 text-center">
          {t('yourGuess')}
        </h3>

        <div className="flex-1 flex flex-col justify-center">
          {/* Previous guesses */}
          {roundState.guesses.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {roundState.guesses.map((guess, index) => {
                const isLastGuess = index === roundState.guesses.length - 1;
                const isCorrectGuess = isLastGuess && feedback?.type === 'correct';
                
                return (
                  <span
                    key={index}
                    className={`px-3 py-1.5 rounded text-sm ${
                      isCorrectGuess
                        ? 'bg-success/20 border border-success/30 text-success-text'
                        : 'bg-error/20 border border-error/30 text-error-text'
                    }`}
                  >
                    {guess}
                  </span>
                );
              })}
            </div>
          )}

          {/* Autocomplete Input */}
          <div className="relative w-full mb-6">
            <input
              ref={inputRef}
              type="text"
              placeholder={t('typeKillerName')}
              autoComplete="off"
              disabled={inputDisabled}
              value={autocomplete.inputValue}
              onChange={(e) => autocomplete.setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() =>
                autocomplete.suggestions.length > 0 && autocomplete.setIsOpen(true)
              }
              className="w-full p-4 text-lg bg-bg-input border border-border rounded-lg text-text-primary transition-all focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-muted"
            />
            {autocomplete.isOpen && (
              <ul
                ref={autocomplete.listRef}
                className="absolute top-full left-0 right-0 bg-bg-dark border border-border rounded-lg mt-1 max-h-[280px] overflow-y-auto list-none z-50"
              >
                {autocomplete.suggestions.map((item, index) => (
                  <li
                    key={item.id}
                    className={`px-4 py-3 cursor-pointer transition-colors hover:bg-bg-card-hover ${
                      index === autocomplete.selectedIndex ? 'bg-bg-card-hover border-l-2 border-l-accent' : ''
                    }`}
                    onClick={() => autocomplete.handleSelect(item)}
                  >
                    <span className="text-text-primary">{item.display}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              className="flex-1 bg-accent hover:bg-accent-hover text-bg-dark px-6 py-4 text-base font-semibold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={inputDisabled || (autocomplete.suggestions.length === 0 && !autocomplete.selectedItem)}
              onClick={handleSubmit}
            >
              {t('submit')}
            </button>
            <button
              className="px-6 py-4 bg-transparent text-text-secondary border border-border rounded-lg transition-all hover:bg-bg-card-hover hover:text-text-primary hover:border-border-hover cursor-pointer text-base"
              onClick={onSkip}
              disabled={inputDisabled}
            >
              {t('skip')}
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-6 p-4 rounded-lg text-center border ${
                feedback.type === 'correct'
                  ? 'bg-success/20 border-success/30 text-success-text'
                  : feedback.type === 'skip'
                  ? 'bg-warning/20 border-warning/30 text-warning-text'
                  : 'bg-error/20 border-error/30 text-error-text'
              }`}
            >
              <p className="font-medium">{feedback.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}

export default GameScreen;
