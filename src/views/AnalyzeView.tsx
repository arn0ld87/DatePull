import React, { useState, useCallback } from 'react';
import type { CalendarEvent } from '../types';
import { analyzeSchedule } from '../services/geminiService';
import { generateIcsContent } from '../utils/calendarUtils';
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';
import EventList from '../components/EventList';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';

type InputMode = 'image' | 'text';

const IconDownload: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const IconRestart: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 11-14.14 0" />
    </svg>
);


const AnalyzeView: React.FC = () => {
    const [inputMode, setInputMode] = useState<InputMode>('image');
    const [scheduleFile, setScheduleFile] = useState<File | null>(null);
    const [scheduleText, setScheduleText] = useState<string>('');
    const [pdfPages, setPdfPages] = useState<string>('');
    const [extractedEvents, setExtractedEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisStarted, setAnalysisStarted] = useState<boolean>(false);

    const handleAnalysis = useCallback(async () => {
        const mode = scheduleFile ? 'image' : 'text';
        if (mode === 'image' && !scheduleFile) {
            setError('Bitte wählen Sie eine Bild- oder PDF-Datei aus.');
            return;
        }
        if (mode === 'text' && !scheduleText.trim()) {
            setError('Bitte geben Sie den Text des Dokuments ein.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setExtractedEvents([]);
        setAnalysisStarted(true);

        try {
            const results = await analyzeSchedule(
                mode === 'image' ? scheduleFile : null,
                mode === 'text' ? scheduleText : '',
                pdfPages
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
    }, [scheduleFile, scheduleText, pdfPages]);

    const handleReset = () => {
        setScheduleFile(null);
        setScheduleText('');
        setPdfPages('');
        setExtractedEvents([]);
        setError(null);
        setIsLoading(false);
        setAnalysisStarted(false);
    };

    const handleExportIcs = () => {
        const icsContent = generateIcsContent(extractedEvents);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'termine.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
             <Card>
                <div className="text-center p-8">
                    <Loader />
                    <p className="mt-4 text-lg">
                        Gemini analysiert dein Dokument...
                    </p>
                    <p className="text-sm text-brand-text-secondary">Dies kann einen Moment dauern.</p>
                </div>
            </Card>
        )
    }

    if (analysisStarted && !isLoading) {
         return (
             <div className="space-y-8">
                {error && <ErrorMessage message={error} />}
                {extractedEvents.length > 0 && (
                     <Card>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text-primary">
                                Extrahierte Termine
                                </h2>
                                <p className="text-sm text-brand-text-secondary">Hier sind die gefundenen Termine aus deinem Dokument.</p>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                    onClick={handleReset}
                                    className="bg-transparent hover:bg-brand-surface-light border border-brand-surface-light text-brand-text-primary font-semibold py-2 px-4 rounded-xl inline-flex items-center transition-all duration-200"
                                >
                                    <IconRestart className="h-5 w-5 mr-2" />
                                    <span>Neu Starten</span>
                                </button>
                                <button
                                    onClick={handleExportIcs}
                                    className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center transition-all duration-200"
                                >
                                    <IconDownload className="h-5 w-5 mr-2" />
                                    <span>Alles als iCal exportieren</span>
                                </button>
                            </div>
                        </div>
                        <EventList events={extractedEvents} />
                    </Card>
                )}
                
                {extractedEvents.length === 0 && !error && (
                    <Card>
                        <div className="text-center p-8">
                            <h3 className="text-lg font-semibold">Keine Termine gefunden</h3>
                            <p className="mt-2 text-brand-text-secondary">Das Modell konnte keine Termine aus der Eingabe extrahieren.</p>
                             <button
                                onClick={handleReset}
                                className="mt-6 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center transition-all duration-200"
                            >
                                <span>Nochmal versuchen</span>
                            </button>
                        </div>
                    </Card>
                )}
             </div>
         );
    }


  return (
    <Card>
        <div className="flex justify-center mb-8">
            <div className="bg-brand-surface p-1 rounded-xl flex space-x-1">
                <button
                    onClick={() => { setInputMode('image'); setScheduleText(''); }}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${inputMode === 'image' ? 'bg-brand-primary text-white' : 'text-brand-text-secondary hover:bg-brand-surface-light'}`}
                >
                    Datei
                </button>
                <button
                    onClick={() => { setInputMode('text'); setScheduleFile(null); }}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${inputMode === 'text' ? 'bg-brand-primary text-white' : 'text-brand-text-secondary hover:bg-brand-surface-light'}`}
                >
                    Text
                </button>
            </div>
        </div>

        {inputMode === 'image' ? (
        <FileUpload file={scheduleFile} setFile={setScheduleFile} pdfPages={pdfPages} setPdfPages={setPdfPages} />
        ) : (
        <TextInput text={scheduleText} setText={setScheduleText} />
        )}
        
        <div className="mt-8">
             <button
              onClick={handleAnalysis}
              disabled={isLoading || (!scheduleFile && !scheduleText.trim())}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-3 px-4 rounded-xl shadow-lg disabled:bg-brand-surface-light disabled:text-brand-text-secondary disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center"
            >
              Dokument analysieren
            </button>
        </div>
    </Card>
  );
};

export default AnalyzeView;