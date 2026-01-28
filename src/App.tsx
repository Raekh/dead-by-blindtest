import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { VolumeProvider } from './contexts/VolumeContext';
import { AudioPreloadProvider, useAudioPreload } from './contexts/AudioPreloadContext';
import GamePage from './components/GamePage';
import PreviewPage from './components/PreviewPage';
import './index.css';

function LoadingScreen() {
  const { loadingProgress } = useAudioPreload();
  
  return (
    <div className="h-screen flex items-center justify-center bg-bg-dark">
      <div className="max-w-md w-full px-8 text-center">
        <div className="bg-bg-card border border-border rounded-lg p-8">
          <h1 className="text-lg text-text-primary uppercase tracking-widest font-semibold mb-6">
            Loading Audio
          </h1>
          <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-text-muted text-sm mt-4">{loadingProgress}%</p>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isLoading } = useAudioPreload();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <I18nProvider>
      <VolumeProvider>
        <AudioPreloadProvider>
          <AppContent />
        </AudioPreloadProvider>
      </VolumeProvider>
    </I18nProvider>
  );
}

export default App;
