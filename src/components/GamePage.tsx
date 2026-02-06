import { useGame } from '../hooks/useGame';
import { useI18n } from '../i18n';
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import ResultsScreen from './ResultsScreen';
import LanguageSwitcher from './LanguageSwitcher';
import VolumeControl from './VolumeControl';

function GamePage() {
  const game = useGame();
  const { t } = useI18n();

  return (
    <div className="h-screen flex flex-col overflow-hidden fixed inset-0">
      {/* Top Bar */}
      <header className="shrink-0 h-14 bg-bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg text-text-primary uppercase tracking-widest font-semibold">
            {t('title')}
          </h1>
          <span className="text-text-muted text-xs">•</span>
          <span className="text-text-muted text-xs uppercase tracking-wider">
            {t('subtitle')}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-text-muted text-sm">Made with 💛 by Raekh</span>
          <VolumeControl />
          <LanguageSwitcher />
          <a href="/preview" className="text-text-muted hover:text-accent transition-colors text-xs">
            {t('audioPreview')}
          </a>
        </div>
      </header>

      {/* Main Content - fills remaining space */}
      <main className="flex-1 overflow-hidden">
        {game.screen === 'start' && <StartScreen onStart={game.startGame} />}

        {game.screen === 'game' && (
          <GameScreen
            currentRound={game.currentRound}
            totalRounds={game.totalRounds}
            score={game.score}
            currentKiller={game.currentKiller}
            isGenericRound={game.isGenericRound}
            roundState={game.roundState}
            feedback={game.feedback}
            inputDisabled={game.inputDisabled}
            audioError={game.audioError}
            hintLevels={game.hintLevels}
            currentRanges={game.currentRanges}
            onPlayHint={game.playHint}
            onStopAudio={game.stopAudio}
            onSubmitGuess={game.submitGuess}
            onSkip={game.skipRound}
          />
        )}

        {game.screen === 'results' && (
          <ResultsScreen
            score={game.score}
            totalRounds={game.totalRounds}
            results={game.results}
            onRestart={game.restartGame}
          />
        )}
      </main>
    </div>
  );
}

export default GamePage;
