import { useI18n } from '../i18n';

interface StartScreenProps {
  onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  const { t } = useI18n();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-lg w-full px-8">
        {/* Game description */}
        <div className="bg-bg-card border border-border rounded-lg p-8 mb-6">
          <p className="text-xl text-text-primary mb-6 text-center">
            {t('startQuestion')}
          </p>
          
          <div className="space-y-4 text-text-secondary">
            <div className="flex items-start gap-4">
              <span className="text-accent font-semibold text-lg">1.</span>
              <span className="text-base">{t('step1')} <span className="text-text-primary font-medium">{t('step1Hint')}</span> {t('step1End')}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-accent font-semibold text-lg">2.</span>
              <span className="text-base">{t('step2')}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-accent font-semibold text-lg">3.</span>
              <span className="text-base">{t('step3')}</span>
            </div>
          </div>

          {/* Points breakdown */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-4 text-center">{t('pointsPerGuess')}</p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <span className="block text-2xl font-semibold text-accent">+4</span>
                <span className="text-xs text-text-muted">{t('far')}</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-semibold text-accent">+3</span>
                <span className="text-xs text-text-muted">{t('mid')}</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-semibold text-accent">+2</span>
                <span className="text-xs text-text-muted">{t('close')}</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-semibold text-accent-dim">+1</span>
                <span className="text-xs text-text-muted">{t('chase')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          className="w-full bg-accent hover:bg-accent-hover text-bg-dark px-8 py-5 text-base font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          onClick={onStart}
        >
          {t('enterTheFog')}
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
