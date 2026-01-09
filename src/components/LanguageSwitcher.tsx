import { useI18n, Language } from '../i18n';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((lang, index) => (
        <span key={lang.code} className="flex items-center">
          <button
            onClick={() => setLanguage(lang.code)}
            className={`px-2 py-1 text-xs uppercase tracking-wider rounded transition-colors cursor-pointer ${
              language === lang.code
                ? 'bg-accent text-bg-dark font-semibold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {lang.label}
          </button>
          {index < LANGUAGES.length - 1 && (
            <span className="text-text-muted text-xs mx-1">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
