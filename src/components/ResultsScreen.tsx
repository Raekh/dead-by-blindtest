import { useI18n } from '../i18n';
import type { GameResult } from '../hooks/useGame';

interface ResultsScreenProps {
  score: number;
  totalRounds: number;
  results: GameResult[];
  onRestart: () => void;
}

function ResultsScreen({ score, totalRounds, results, onRestart }: ResultsScreenProps) {
  const { t } = useI18n();

  // Calculate max possible score (4 points per round)
  const maxScore = totalRounds * 4;
  const percentage = Math.round((score / maxScore) * 100);

  const HINT_LABELS: Record<string, string> = {
    far: t('far'),
    mid: t('mid'),
    close: t('close'),
    chase: t('chase'),
  };

  // Get performance message
  const getPerformanceMessage = () => {
    if (percentage >= 90) return t('entityPleased');
    if (percentage >= 70) return t('mercilessKiller');
    if (percentage >= 50) return t('brutalKiller');
    if (percentage >= 30) return t('ruthlessKiller');
    return t('entityDispleased');
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Score Summary */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 border-r border-border">
        {/* Title */}
        <h2 className="text-xs uppercase tracking-[0.3em] text-text-muted mb-3">
          {t('trialComplete')}
        </h2>

        {/* Performance Badge */}
        <div className="mb-8">
          <span className="text-3xl font-semibold text-accent uppercase tracking-wider">
            {getPerformanceMessage()}
          </span>
        </div>

        {/* Score Display */}
        <div className="w-full max-w-sm">
          <div className="bg-bg-card border border-border rounded-lg p-8">
            <div className="flex justify-center items-baseline gap-2 mb-3">
              <span className="text-6xl font-semibold text-text-primary">{score}</span>
              <span className="text-text-muted text-xl">/ {maxScore}</span>
            </div>
            <div className="text-text-secondary text-center mb-6">
              {results.filter(r => r.correct).length} {t('of')} {totalRounds} {t('killersIdentified')}
            </div>

            {/* Score Bar */}
            <div className="h-3 bg-bg-input rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Play Again Button */}
          <button
            className="w-full mt-6 bg-accent hover:bg-accent-hover text-bg-dark px-8 py-5 text-base font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            onClick={onRestart}
          >
            {t('playAgain')}
          </button>
        </div>
      </div>

      {/* Right Panel - Results Breakdown */}
      <div className="flex-1 flex flex-col p-8 bg-bg-card">
        <h3 className="text-accent uppercase tracking-widest text-sm font-semibold mb-6 text-center">
          {t('roundBreakdown')}
        </h3>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  result.correct 
                    ? 'bg-success/10 border-success/20' 
                    : 'bg-error/10 border-error/20'
                }`}
              >
                {/* Round number */}
                <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${
                  result.correct ? 'bg-success/30 text-success-text' : 'bg-error/30 text-error-text'
                }`}>
                  {index + 1}
                </div>

                {/* Killer name */}
                <div className="flex-1">
                  <span className="font-medium text-text-primary">{result.killer.name}</span>
                </div>

                {/* Points/Status */}
                <div className="text-right">
                  {result.correct ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted uppercase">
                        {result.hintLevel && HINT_LABELS[result.hintLevel]}
                      </span>
                      <span className="text-success-text font-semibold text-lg">+{result.points}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-error-text">
                      {result.guesses.includes('Skipped') ? t('skipped') : t('failed')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsScreen;
