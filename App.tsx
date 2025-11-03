import React, { useState, useCallback } from 'react';
import type { CalendarEvent } from './types';
import { analyzeSchedule } from './services/geminiService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AnalyzeView from './views/AnalyzeView';
import HistoryView from './views/HistoryView';
import InfoView from './views/InfoView';

type ViewMode = 'analyze' | 'history' | 'info';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('analyze');
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [scheduleText, setScheduleText] = useState<string>('');
  const [extractedEvents, setExtractedEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStarted, setAnalysisStarted] = useState<boolean>(false);


  const handleAnalysis = useCallback(async () => {
    const inputMode = scheduleFile ? 'image' : 'text';
    if (inputMode === 'image' && !scheduleFile) {
      setError('Bitte wählen Sie eine Bild- oder PDF-Datei aus.');
      return;
    }
    if (inputMode === 'text' && !scheduleText.trim()) {
      setError('Bitte geben Sie den Text des Stundenplans ein.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedEvents([]);
    setAnalysisStarted(true);

    try {
      const results = await analyzeSchedule(
        inputMode === 'image' ? scheduleFile : null,
        inputMode === 'text' ? scheduleText : ''
      );
      setExtractedEvents(results);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? `Ein Fehler ist aufgetreten: ${err.message}`
          : 'Ein unbekannter Fehler ist aufgetreten.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [scheduleFile, scheduleText]);
  
  const handleReset = () => {
    setScheduleFile(null);
    setScheduleText('');
    setExtractedEvents([]);
    setError(null);
    setIsLoading(false);
    setAnalysisStarted(false);
  };


  const renderContent = () => {
    switch (activeView) {
      case 'analyze':
        return (
          <AnalyzeView
            scheduleFile={scheduleFile}
            setScheduleFile={setScheduleFile}
            scheduleText={scheduleText}
            setScheduleText={setScheduleText}
            handleAnalysis={handleAnalysis}
            extractedEvents={extractedEvents}
            isLoading={isLoading}
            error={error}
            analysisStarted={analysisStarted}
            onReset={handleReset}
          />
        );
      case 'history':
        return <HistoryView />;
      case 'info':
        return <InfoView />;
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