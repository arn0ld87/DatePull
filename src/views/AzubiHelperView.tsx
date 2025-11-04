


import React, { useRef, useState } from 'react';
import Loader from '../components/Loader';

const AzubiHelperView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('Keine Datei ausgewählt');
  const [pdfPages, setPdfPages] = useState('');
  const [week, setWeek] = useState('');
  const [fallbackText, setFallbackText] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setFileName(f ? `${f.name} · ${(f.size / 1024).toFixed(1)} KB` : 'Keine Datei ausgewählt');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] || null;
    setFile(f);
    setFileName(f ? `${f.name} · ${(f.size / 1024).toFixed(1)} KB` : 'Keine Datei ausgewählt');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    if (!week) {
      setStatus('Bitte eine Kalenderwoche auswählen.');
      return;
    }
    if (!file && !fallbackText.trim()) {
      setStatus('Bitte Datei hochladen oder Text eingeben.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('weekIso', week);
      formData.append('timezone', 'Europe/Berlin');
      if (file) formData.append('file', file);
      if (pdfPages.trim()) formData.append('pdfPages', pdfPages.trim());
      if (fallbackText.trim()) formData.append('text', fallbackText.trim());
      const response = await fetch('/api/journal/parse', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({ error: 'Unbekannter Fehler' }));
        throw new Error(errorPayload.error || response.statusText);
      }
      setStatus('Analyse abgeschlossen.');
      // Hier könnte man die Ergebnisse anzeigen
    } catch (error: any) {
      setStatus(error.message || 'Analyse fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-brand-surface rounded-2xl p-8 shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-4 text-brand-primary">Azubi-Helper · Ausbildungsnachweis</h1>
      <p className="mb-6 text-brand-text-secondary">Stundenplan hochladen, Woche wählen und PDF generieren.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">1 · Datei auswählen</label>
            <div
              className="border-2 border-dashed border-brand-primary/30 rounded-xl p-6 text-center cursor-pointer mb-2"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <div className="text-brand-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <div className="mb-1">ICS oder PDF hierher ziehen</div>
              <div className="text-xs text-brand-text-secondary mb-2">Alternativ klicken, um eine Datei auszuwählen. Unterstützt werden .ics (Priorität) und textbasierte PDFs.</div>
              <input ref={fileInputRef} type="file" accept=".ics,.pdf" className="hidden" onChange={handleFileChange} />
              <div className="text-xs text-brand-primary mt-2">{fileName}</div>
            </div>
            <input
              type="text"
              placeholder="Optional · Seiten (PDF): z. B. 2-4 oder 1,3,5"
              className="w-full bg-brand-dark border border-brand-surface-light rounded-lg px-3 py-2 text-sm text-brand-text-primary mt-2"
              value={pdfPages}
              onChange={e => setPdfPages(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">2 · Woche wählen & absenden</label>
            <input
              type="week"
              className="w-full bg-brand-dark border border-brand-surface-light rounded-lg px-3 py-2 text-sm text-brand-text-primary mb-2"
              value={week}
              onChange={e => setWeek(e.target.value)}
              required
            />
            <textarea
              rows={4}
              placeholder="Optional · Zusätzlicher Text (Fallback)"
              className="w-full bg-brand-dark border border-brand-surface-light rounded-lg px-3 py-2 text-sm text-brand-text-primary mb-2"
              value={fallbackText}
              onChange={e => setFallbackText(e.target.value)}
            />
            <button
              type="submit"
              className="w-full mt-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-3 px-4 rounded-xl shadow-lg disabled:bg-brand-surface-light disabled:text-brand-text-secondary disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="mr-2"><Loader small /></span>
              ) : null}
              Analyse starten
            </button>
            <div className="text-xs text-red-300 mt-2 min-h-[1.5em]">{status}</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AzubiHelperView;
