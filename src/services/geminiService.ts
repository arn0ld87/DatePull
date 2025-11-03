import type { CalendarEvent } from '../types';

export const analyzeSchedule = async (
  file: File | null,
  text: string,
  pdfPages?: string
): Promise<CalendarEvent[]> => {
  const formData = new FormData();
  
  if (file) {
    formData.append('file', file);
  }
  
  if (text) {
    formData.append('text', text);
  }

  if (pdfPages && pdfPages.trim()) {
    formData.append('pdfPages', pdfPages.trim());
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const data = await response.json();
  return data.events || [];
};