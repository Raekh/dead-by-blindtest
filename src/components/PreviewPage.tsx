import { useState, useRef, useMemo, useCallback, ChangeEvent, useEffect } from 'react';
import {
  KILLERS,
  THEMES,
  THEME_RANGES,
  LULLABY_TYPES,
  Killer,
  AudioRange,
} from '../data/killers';
import { useI18n } from '../i18n';
import { useVolume } from '../contexts/VolumeContext';
import LanguageSwitcher from './LanguageSwitcher';
import VolumeControl from './VolumeControl';

type FilterType = 'all' | 'unique-chase' | 'generic' | 'lullaby' | 'no-tr';
type GroupBy = 'none' | 'tagged' | 'terror';

// Track selected theme per killer for untagged killers
type SelectedThemes = Record<string, string>;

function PreviewPage() {
  const { t } = useI18n();
  const { volume, isMuted } = useVolume();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [selectedThemes, setSelectedThemes] = useState<SelectedThemes>({});
  
  // Track currently playing audio: { audioId, rangeIndex } or null
  const [playingState, setPlayingState] = useState<{ audioId: string; rangeIndex: number } | null>(null);
  
  // Store current checkEnd function to clean up when switching ranges
  const checkEndRef = useRef<{ audioId: string; fn: () => void } | null>(null);

  // Refs for audio elements - we'll use IDs to find them in the DOM
  const containerRef = useRef<HTMLDivElement>(null);

  // Update all audio elements when volume changes
  useEffect(() => {
    if (!containerRef.current) return;
    const audioElements = containerRef.current.querySelectorAll('audio');
    audioElements.forEach((audio) => {
      audio.volume = isMuted ? 0 : volume;
    });
  }, [volume, isMuted]);

  // Filter killers based on search and filter
  const filteredKillers = useMemo(() => {
    let filtered = KILLERS;

    // Apply search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter(
        (k) =>
          k.name.toLowerCase().includes(searchTerm) ||
          k.aliases.some((a) => a.toLowerCase().includes(searchTerm))
      );
    }

    // Apply audio filter
    switch (filter) {
      case 'lullaby':
        filtered = filtered.filter((k) => k.audio.lullabies.length > 0);
        break;
      case 'no-tr':
        filtered = filtered.filter((k) => k.audio.terrorRadius === null);
        break;
      case 'unique-chase':
        filtered = filtered.filter(
          (k) => k.audio.terrorRadius?.themes.length === 1
        );
        break;
      case 'generic':
        filtered = filtered.filter(
          (k) => (k.audio.terrorRadius?.themes.length ?? 0) > 1
        );
        break;
    }

    return filtered;
  }, [search, filter]);

  // Group killers
  const groupedKillers = useMemo((): Record<string, Killer[]> => {
    if (groupBy === 'none') {
      return { all: filteredKillers };
    }

    const groups: Record<string, Killer[]> = {};

    filteredKillers.forEach((killer) => {
      let groupValues: string[] = [];

      if (groupBy === 'terror') {
        groupValues = killer.audio.terrorRadius?.themes || ['None'];
      } else if (groupBy === 'tagged') {
        const isTagged = killer.audio.terrorRadius?.themes.length === 1;
        groupValues = [isTagged ? 'Tagged' : 'Untagged'];
      }

      groupValues.forEach((groupValue) => {
        if (!groups[groupValue]) {
          groups[groupValue] = [];
        }
        if (!groups[groupValue].includes(killer)) {
          groups[groupValue].push(killer);
        }
      });
    });

    return groups;
  }, [filteredKillers, groupBy]);

  // Sort groups by size
  const sortedGroupNames = useMemo(() => {
    return Object.keys(groupedKillers).sort(
      (a, b) => groupedKillers[b].length - groupedKillers[a].length
    );
  }, [groupedKillers]);

  // Statistics
  const stats = useMemo(() => {
    const taggedKillers = KILLERS.filter(
      (k) => k.audio.terrorRadius?.themes.length === 1
    );
    const lullabyKillers = KILLERS.filter((k) => k.audio.lullabies.length > 0);
    const noTerrorKillers = KILLERS.filter(
      (k) => k.audio.terrorRadius === null
    );

    const uniqueThemes = new Set<string>();
    KILLERS.forEach((k) => {
      k.audio.terrorRadius?.themes.forEach((t) => uniqueThemes.add(t));
    });

    return {
      total: KILLERS.length,
      uniqueThemes: taggedKillers.length,
      withLullaby: lullabyKillers.length,
      noTerror: noTerrorKillers.length,
      totalThemes: uniqueThemes.size,
    };
  }, []);

  // Handle range click to toggle audio segment playback (like game behavior)
  const handleRangeClick = useCallback(
    (audioId: string, range: AudioRange, rangeIndex: number) => {
      const audio = document.getElementById(audioId) as HTMLAudioElement | null;
      if (!audio) return;

      // Clean up previous checkEnd listener if exists
      if (checkEndRef.current) {
        const prevAudio = document.getElementById(checkEndRef.current.audioId) as HTMLAudioElement | null;
        if (prevAudio) {
          prevAudio.removeEventListener('timeupdate', checkEndRef.current.fn);
        }
        checkEndRef.current = null;
      }

      // Stop any other playing audio first
      if (playingState && playingState.audioId !== audioId) {
        const otherAudio = document.getElementById(playingState.audioId) as HTMLAudioElement | null;
        if (otherAudio) {
          otherAudio.pause();
        }
      }

      // If same audio and same range is playing, stop it (toggle off)
      if (playingState?.audioId === audioId && playingState?.rangeIndex === rangeIndex && !audio.paused) {
        audio.pause();
        setPlayingState(null);
        return;
      }

      // Apply volume settings
      audio.volume = isMuted ? 0 : volume;

      // Stop at the end of the range
      const checkEnd = () => {
        if (range.end && audio.currentTime >= range.end) {
          audio.pause();
          setPlayingState(null);
          audio.removeEventListener('timeupdate', checkEnd);
          checkEndRef.current = null;
        }
      };

      // Store reference for cleanup
      checkEndRef.current = { audioId, fn: checkEnd };

      const playFromRange = () => {
        audio.currentTime = range.start;
        audio.volume = isMuted ? 0 : volume;
        audio.play();
        setPlayingState({ audioId, rangeIndex });
      };
      
      if (audio.readyState < 1) {
        audio.addEventListener(
          'loadedmetadata',
          () => {
            playFromRange();
            audio.addEventListener('timeupdate', checkEnd);
          },
          { once: true }
        );
        audio.load();
      } else {
        playFromRange();
        audio.addEventListener('timeupdate', checkEnd);
      }
    },
    [volume, isMuted, playingState]
  );

  // Handle lullaby play toggle (plays from start, no end time constraint)
  const handleLullabyPlay = useCallback(
    (audioId: string) => {
      const audio = document.getElementById(audioId) as HTMLAudioElement | null;
      if (!audio) return;

      // Stop any other playing audio first
      if (playingState && playingState.audioId !== audioId) {
        const otherAudio = document.getElementById(playingState.audioId) as HTMLAudioElement | null;
        if (otherAudio) {
          otherAudio.pause();
        }
      }

      // If currently playing this lullaby, stop it (toggle off)
      if (playingState?.audioId === audioId && !audio.paused) {
        audio.pause();
        setPlayingState(null);
        return;
      }

      audio.volume = isMuted ? 0 : volume;
      audio.currentTime = 0;
      audio.play();
      setPlayingState({ audioId, rangeIndex: -1 }); // -1 for lullaby

      // Clear state when audio ends
      const handleEnded = () => {
        setPlayingState(null);
        audio.removeEventListener('ended', handleEnded);
      };
      audio.addEventListener('ended', handleEnded);
    },
    [volume, isMuted, playingState]
  );

  // Handle theme selector change for untagged killers
  const handleThemeChange = useCallback(
    (killerId: string, theme: string, audioId: string) => {
      setSelectedThemes((prev) => ({ ...prev, [killerId]: theme }));

      // Update audio source
      const audio = document.getElementById(audioId) as HTMLAudioElement | null;
      if (audio && theme.startsWith('TerrorRadius_')) {
        const wasPlaying = !audio.paused;
        audio.src = `/audio/${theme}.ogg`;
        audio.load();
        if (wasPlaying) {
          audio.play();
        }
      }
    },
    []
  );

  // Get the current theme for a killer
  const getCurrentTheme = useCallback(
    (killer: Killer): string | null => {
      const themes = killer.audio.terrorRadius?.themes;
      if (!themes || themes.length === 0) return null;

      if (selectedThemes[killer.id]) {
        return selectedThemes[killer.id];
      }

      return themes.find((t) => t.startsWith('TerrorRadius_')) || themes[0];
    },
    [selectedThemes]
  );

  // Render ranges with clickable items (square buttons like game hints)
  const renderRanges = (ranges: AudioRange[], audioId: string) => {
    if (!ranges || ranges.length === 0) return null;

    const HINT_LABELS: Record<string, string> = {
      far: t('far'),
      mid: t('mid'),
      close: t('close'),
      chase: t('chase'),
    };

    return (
      <div className="flex gap-2 mt-3 flex-wrap">
        {ranges.map((range, idx) => {
          const isPlaying = playingState?.audioId === audioId && playingState?.rangeIndex === idx;
          
          return (
            <button
              key={idx}
              onClick={() => handleRangeClick(audioId, range, idx)}
              className={`flex items-center justify-center w-14 h-14 p-1.5 rounded-lg border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'bg-bg-input border-border hover:border-accent hover:bg-bg-card-hover'
              }`}
            >
              <span className={`text-[10px] font-medium uppercase tracking-wider ${
                isPlaying ? 'text-accent' : 'text-text-secondary'
              }`}>
                {HINT_LABELS[range.label] || range.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // Render terror radius section
  const renderTerrorRadiusSection = (killer: Killer) => {
    const { terrorRadius } = killer.audio;
    const audioId = `tr-${killer.id}`;

    if (!terrorRadius) {
      return (
        <div className="mb-4 p-4 bg-bg-input rounded-lg last:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="py-1 px-3 rounded text-xs font-bold uppercase bg-error/30 text-error-text">
              {t('terrorRadius')}
            </span>
            <span className="text-text-muted italic">{t('none')}</span>
          </div>
        </div>
      );
    }

    const isGeneric = terrorRadius.themes.length > 1;
    const currentTheme = getCurrentTheme(killer);
    const themeNames = terrorRadius.themes
      .map((theme) => THEMES[theme]?.name || theme)
      .join(', ');

    const audioTypeClass = isGeneric
      ? 'bg-warning/30 text-warning-text'
      : 'bg-accent/30 text-accent';
    const audioTypeLabel = isGeneric ? t('generic') : t('unique');

    // For untagged killers, use THEME_RANGES based on the selected theme
    // For tagged killers, use the first theme's ranges from THEME_RANGES
    const displayRanges = currentTheme
      ? THEME_RANGES[currentTheme]
      : THEME_RANGES[terrorRadius.themes[0]];

    return (
      <div className="mb-4 p-4 bg-bg-input rounded-lg last:mb-0">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`py-1 px-3 rounded text-xs font-bold uppercase ${audioTypeClass}`}
          >
            {audioTypeLabel}
          </span>
          {isGeneric ? (
            <div className="relative">
              <select
                value={currentTheme || ''}
                onChange={(e) =>
                  handleThemeChange(killer.id, e.target.value, audioId)
                }
                className="appearance-none bg-bg-card border border-border text-text-secondary py-1 pl-3 pr-7 rounded text-sm cursor-pointer hover:border-border-hover focus:outline-none focus:border-accent transition-colors"
              >
                {terrorRadius.themes
                  .filter((theme) => theme.startsWith('TerrorRadius_'))
                  .map((theme) => (
                    <option key={theme} value={theme}>
                      {THEMES[theme]?.name || theme.replace('TerrorRadius_', 'Theme ')}
                    </option>
                  ))}
              </select>
              <svg 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <span className="text-text-secondary font-mono text-sm">
              {themeNames}
            </span>
          )}
        </div>

        {/* Clickable time ranges */}
        {renderRanges(displayRanges, audioId)}

        {/* Hidden audio element */}
        {currentTheme?.startsWith('TerrorRadius_') ? (
          <audio
            id={audioId}
            src={`/audio/${currentTheme}.ogg`}
            preload="none"
          />
        ) : (
          <div className="text-text-muted text-sm p-3 border border-dashed border-border rounded text-center mt-3">
            Audio source pending
          </div>
        )}
      </div>
    );
  };

  // Render lullaby sections
  const renderLullabySections = (killer: Killer) => {
    const { lullabies } = killer.audio;
    if (!lullabies || lullabies.length === 0) return null;

    return lullabies.map((lullaby, index) => {
      const typeName = LULLABY_TYPES[lullaby.id]?.name || lullaby.name;
      const audioId = `lullaby-${killer.id}-${index}`;
      const hasAudioFile = lullaby.id.includes('_Lullaby_');
      const isPlaying = playingState?.audioId === audioId;

      return (
        <div key={lullaby.id} className="mb-4 p-4 bg-bg-input rounded-lg last:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="py-1 px-3 rounded text-xs font-bold uppercase bg-success/30 text-success-text">
              {t('lullaby')}
            </span>
            <span className="text-text-secondary font-mono text-sm">{typeName}</span>
          </div>

          {/* Play button for lullabies */}
          {hasAudioFile && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleLullabyPlay(audioId)}
                className={`flex flex-col items-center justify-center w-14 h-14 p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-bg-input border-border hover:border-accent hover:bg-bg-card-hover'
                }`}
              >
                <span className={`text-[10px] font-medium uppercase tracking-wider ${
                  isPlaying ? 'text-accent' : 'text-text-secondary'
                }`}>
                  {t('play')}
                </span>
              </button>
            </div>
          )}

          {/* Hidden audio element */}
          {hasAudioFile ? (
            <audio
              id={audioId}
              src={`/audio/${lullaby.id}.ogg`}
              preload="none"
            />
          ) : (
            <div className="text-text-muted text-sm p-3 border border-dashed border-border rounded text-center mt-3">
              Audio source pending
            </div>
          )}
        </div>
      );
    });
  };

  // Render killer card
  const renderKillerCard = (killer: Killer) => {
    const isTagged = killer.audio.terrorRadius?.themes.length === 1;

    return (
      <div
        key={killer.id}
        className="bg-bg-card rounded-lg p-5 border border-border transition-colors hover:border-accent flex flex-col"
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-xl font-bold text-text-primary">{killer.name}</span>
          <span
            className={`text-xs py-1 px-2.5 rounded font-bold uppercase shrink-0 ${
              isTagged
                ? 'bg-success/30 text-success-text'
                : 'bg-warning/30 text-warning-text'
            }`}
          >
            {isTagged ? t('tagged') : t('untagged')}
          </span>
        </div>
        <div className="text-sm text-text-muted mb-4 min-h-[40px]">
          {t('aliases')}: {killer.aliases.join(', ')}
        </div>

        <div className="flex-1 flex flex-col">
          {renderTerrorRadiusSection(killer)}
          {renderLullabySections(killer)}
        </div>
      </div>
    );
  };

  // Get group display name
  const getGroupDisplayName = (group: string): string => {
    if (groupBy === 'terror' && THEMES[group]) {
      return THEMES[group].name;
    }
    return group;
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6" ref={containerRef}>
      {/* Header */}
      <header className="mb-10 pb-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-3xl mb-2 uppercase tracking-[0.2em] font-semibold">
            {t('title')}
          </h1>
          <h2 className="text-text-muted text-sm font-normal uppercase tracking-widest">
            {t('audioPreviewMode')}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <VolumeControl />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Back link */}
      <a
        href="/"
        className="inline-block mb-6 text-accent no-underline hover:text-accent-hover transition-colors"
      >
        &larr; {t('backToGame')}
      </a>

      {/* Legend */}
      <div className="mb-6 p-5 bg-bg-card rounded-lg border border-border">
        <h4 className="mb-3 text-text-muted uppercase tracking-wider text-xs font-semibold">{t('audioTypes')}</h4>
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <span className="py-1 px-3 rounded text-xs font-bold uppercase bg-accent/30 text-accent">
              {t('unique')}
            </span>
            <span className="text-text-secondary">{t('uniqueDesc')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="py-1 px-3 rounded text-xs font-bold uppercase bg-warning/30 text-warning-text">
              {t('generic')}
            </span>
            <span className="text-text-secondary">{t('genericDesc')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="py-1 px-3 rounded text-xs font-bold uppercase bg-success/30 text-success-text">
              {t('lullaby')}
            </span>
            <span className="text-text-secondary">{t('lullabyDesc')}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap items-center bg-bg-card p-5 rounded-lg border border-border">
        <label htmlFor="search" className="text-text-muted text-sm">
          {t('search')}:
        </label>
        <input
          type="text"
          id="search"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-bg-input border border-border text-text-primary py-2.5 px-4 rounded focus:outline-none focus:border-accent transition-colors"
        />

        <label htmlFor="filter-audio" className="text-text-muted text-sm">
          {t('filter')}:
        </label>
        <select
          id="filter-audio"
          value={filter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFilter(e.target.value as FilterType)
          }
          className="bg-bg-input border border-border text-text-primary py-2.5 px-4 rounded cursor-pointer focus:outline-none focus:border-accent transition-colors"
        >
          <option value="all">{t('allKillers')}</option>
          <option value="unique-chase">{t('taggedUnique')}</option>
          <option value="generic">{t('untaggedGeneric')}</option>
          <option value="lullaby">{t('hasLullaby')}</option>
          <option value="no-tr">{t('noTerrorRadius')}</option>
        </select>

        <label htmlFor="group-by" className="text-text-muted text-sm">
          {t('groupBy')}:
        </label>
        <select
          id="group-by"
          value={groupBy}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setGroupBy(e.target.value as GroupBy)
          }
          className="bg-bg-input border border-border text-text-primary py-2.5 px-4 rounded cursor-pointer focus:outline-none focus:border-accent transition-colors"
        >
          <option value="none">{t('noGrouping')}</option>
          <option value="tagged">{t('taggedUntagged')}</option>
          <option value="terror">{t('terrorRadiusTheme')}</option>
        </select>
      </div>

      {/* Killers container */}
      <div>
        {groupBy === 'none' ? (
          <div className="grid grid-cols-4 gap-5 items-stretch">
            {filteredKillers.map(renderKillerCard)}
          </div>
        ) : (
          sortedGroupNames.map((group) => (
            <div key={group} className="mt-10 first:mt-0">
              <h3 className="text-accent mb-5 pb-3 border-b border-border text-lg">
                {groupBy === 'terror' ? t('terrorRadius') : t('type')}:{' '}
                {getGroupDisplayName(group)} ({groupedKillers[group].length}{' '}
                {groupedKillers[group].length > 1 ? t('killers') : t('killer')})
              </h3>
              <div className="grid grid-cols-4 gap-5 items-stretch">
                {groupedKillers[group].map(renderKillerCard)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="mt-10 p-6 bg-bg-card rounded-lg border border-border">
        <h3 className="mb-5 text-accent uppercase tracking-wider text-sm font-semibold">{t('statistics')}</h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5">
          <div className="text-center p-4 bg-bg-input rounded-lg">
            <div className="text-4xl font-bold text-text-primary">{stats.total}</div>
            <div className="text-sm text-text-muted mt-1">{t('totalKillers')}</div>
          </div>
          <div className="text-center p-4 bg-bg-input rounded-lg">
            <div className="text-4xl font-bold text-text-primary">{stats.uniqueThemes}</div>
            <div className="text-sm text-text-muted mt-1">{t('uniqueThemes')}</div>
          </div>
          <div className="text-center p-4 bg-bg-input rounded-lg">
            <div className="text-4xl font-bold text-text-primary">{stats.withLullaby}</div>
            <div className="text-sm text-text-muted mt-1">{t('withLullaby')}</div>
          </div>
          <div className="text-center p-4 bg-bg-input rounded-lg">
            <div className="text-4xl font-bold text-text-primary">{stats.noTerror}</div>
            <div className="text-sm text-text-muted mt-1">{t('noTerror')}</div>
          </div>
          <div className="text-center p-4 bg-bg-input rounded-lg">
            <div className="text-4xl font-bold text-text-primary">{stats.totalThemes}</div>
            <div className="text-sm text-text-muted mt-1">{t('totalThemes')}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center">
        <a href="/" className="text-text-muted hover:text-accent transition-colors text-sm">
          {t('backToGame')}
        </a>
      </footer>
    </div>
  );
}

export default PreviewPage;
