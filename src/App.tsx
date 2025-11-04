import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoIntro from './components/VideoIntro';
import AnalyzeView from './views/AnalyzeView';
import HistoryView from './views/HistoryView';
import InfoView from './views/InfoView';
import AzubiHelperView from './views/AzubiHelperView';

type ViewMode = 'analyze' | 'history' | 'info' | 'azubi-helper';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('analyze');
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <VideoIntro onComplete={handleIntroComplete} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'analyze':
        return <AnalyzeView />;
      case 'history':
        return <HistoryView />;
      case 'info':
        return <InfoView />;
      case 'azubi-helper':
        return <AzubiHelperView />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-brand-dark text-brand-text-primary font-sans flex overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col h-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-brand-dark">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;