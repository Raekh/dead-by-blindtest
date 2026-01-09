import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { VolumeProvider } from './contexts/VolumeContext';
import GamePage from './components/GamePage';
import PreviewPage from './components/PreviewPage';
import './index.css';

function App() {
  return (
    <I18nProvider>
      <VolumeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/preview" element={<PreviewPage />} />
          </Routes>
        </BrowserRouter>
      </VolumeProvider>
    </I18nProvider>
  );
}

export default App;
