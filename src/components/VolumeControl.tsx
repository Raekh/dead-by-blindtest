import { useVolume } from '../contexts/VolumeContext';
import { useI18n } from '../i18n';

function VolumeControl() {
  const { volume, setVolume, isMuted, toggleMute } = useVolume();
  const { t } = useI18n();

  const effectiveVolume = isMuted ? 0 : volume;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // If user adjusts volume while muted, unmute
    if (isMuted && newVolume > 0) {
      toggleMute();
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || effectiveVolume === 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      );
    }
    if (effectiveVolume < 0.5) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-text-muted hover:text-accent transition-colors p-1"
        title={isMuted ? t('unmute') : t('mute')}
        aria-label={isMuted ? t('unmute') : t('mute')}
      >
        {getVolumeIcon()}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        className="volume-slider w-20 h-3 cursor-pointer"
        title={t('volume')}
        aria-label={t('volume')}
      />
    </div>
  );
}

export default VolumeControl;
