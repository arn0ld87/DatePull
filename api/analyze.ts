import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { PDFDocument } from 'pdf-lib';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY environment variable not set.");
}

function parsePageNumbers(pagesInput: string): number[] | null {
  const pages = new Set<number>();
  
  if (!pagesInput || !pagesInput.trim()) {
    return null;
  }
  
  const parts = pagesInput.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      if (isNaN(start) || isNaN(end)) continue;
      for (let i = start; i <= end; i++) {
        pages.add(i - 1);
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page)) {
        pages.add(page - 1);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

async function extractPdfPages(base64Data: string, pageIndices: number[]): Promise<string> {
  const pdfBytes = Buffer.from(base64Data, 'base64');
  const srcDoc = await PDFDocument.load(pdfBytes);
  const newDoc = await PDFDocument.create();
  
  const totalPages = srcDoc.getPageCount();
  
  for (const index of pageIndices) {
    if (index >= 0 && index < totalPages) {
      const [copiedPage] = await newDoc.copyPages(srcDoc, [index]);
      newDoc.addPage(copiedPage);
    }
  }
  
  const newPdfBytes = await newDoc.save();
  return Buffer.from(newPdfBytes).toString('base64');
}

const getPrompt = (scheduleText: string): string => `
Du bist DatePullAI, ein Stundenplan-zu-Kalender-Agent. Deine Eingabe ist ein wöchentlicher Stundenplan auf Deutsch (Text, Bild oder PDF). Extrahiere alle regulären Termine und liefere ausschließlich gültiges JSON gemäß dem vorgegebenen Schema.

Regeln:
- Zeitzone ist Europe/Berlin.
- Datum im Format YYYY-MM-DD. Für wöchentliche Termine, wähle das Datum des nächsten Vorkommens basierend auf dem heutigen Tag.
- Zeiten im 24-h-Format HH:MM.
- Fülle 'recurrence' als RRULE für alle wöchentlichen Termine (z.B. 'FREQ=WEEKLY;BYDAY=MO'). Die Wiederholung sollte kein Enddatum (UNTIL) haben.
- Lasse Felder leer (null oder leere Zeichenfolge), wenn die Information unbekannt ist; nicht raten.
- Kommentiere Besonderheiten kurz im Feld 'notes'.
- Wenn ein explizites Datum angegeben ist (z.B. 'am 15.10.'), erstelle einen Einzeltermin ohne Wiederholung. Wenn nur ein Wochentag angegeben ist (z.B. 'Montags'), erstelle einen wöchentlichen Termin.

Hier ist der Stundenplan-Text (falls vorhanden):
${scheduleText}
`;

const schema = {
    type: Type.OBJECT,
    properties: {
        events: {
            type: Type.ARRAY,
            description: "Eine Liste aller extrahierten Kalenderereignisse.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Titel des Termins (z.B. 'Analysis I Vorlesung')." },
                    date: { type: Type.STRING, description: "Startdatum des ersten Termins im Format YYYY-MM-DD. Wenn es ein wiederkehrender Termin ist, das Datum des ersten Vorkommens." },
                    start_time: { type: Type.STRING, description: "Startzeit im 24-Stunden-Format HH:MM." },
                    end_time: { type: Type.STRING, description: "Endzeit im 24-Stunden-Format HH:MM." },
                    location: { type: Type.STRING, description: "Ort des Termins (z.B. 'Hörsaal 5C')." },
                    notes: { type: Type.STRING, description: "Zusätzliche Notizen oder Besonderheiten." },
                    recurrence: { type: Type.STRING, description: "Wiederholungsregel im RRULE-Format (z.B. 'FREQ=WEEKLY;BYDAY=TU'). Leer lassen, wenn es ein Einzeltermin ist." },
                    attendees: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Liste der Teilnehmer (z.B. Dozentenname)." },
                    all_day: { type: Type.BOOLEAN, description: "Gibt an, ob es sich um einen ganztägigen Termin handelt." },
                    calendar_id: { type: Type.STRING, description: "Optionale Kalender-ID." },
                },
                 required: ["title", "date", "start_time", "end_time", "location", "notes", "recurrence", "attendees", "all_day"]
            }
        }
    },
    required: ["events"]
};

const parseMultipartFormData = async (req: VercelRequest): Promise<{ file?: { data: string; mimeType: string }, text?: string, pdfPages?: string }> => {
  const contentType = req.headers['content-type'] || '';
  
  if (!contentType.includes('multipart/form-data')) {
    throw new Error('Invalid content type');
  }

  const boundary = contentType.split('boundary=')[1];
  if (!boundary) {
    throw new Error('No boundary found in content-type');
  }

  const body = req.body as Buffer | string;
  const bodyBuffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const parts = bodyBuffer.toString('binary').split(`--${boundary}`);

  let fileData: { data: string; mimeType: string } | undefined;
  let textData: string | undefined;
  let pdfPagesData: string | undefined;

  for (const part of parts) {
    if (part.includes('Content-Disposition')) {
      const nameMatch = part.match(/name="([^"]+)"/);
      const name = nameMatch ? nameMatch[1] : null;

      if (name === 'file') {
        const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/);
        const mimeType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
        
        const dataStart = part.indexOf('\r\n\r\n') + 4;
        const dataEnd = part.lastIndexOf('\r\n');
        const fileBuffer = Buffer.from(part.substring(dataStart, dataEnd), 'binary');
        const base64Data = fileBuffer.toString('base64');
        
        fileData = { data: base64Data, mimeType };
      } else if (name === 'text') {
        const dataStart = part.indexOf('\r\n\r\n') + 4;
        const dataEnd = part.lastIndexOf('\r\n');
        textData = part.substring(dataStart, dataEnd);
      } else if (name === 'pdfPages') {
        const dataStart = part.indexOf('\r\n\r\n') + 4;
        const dataEnd = part.lastIndexOf('\r\n');
        pdfPagesData = part.substring(dataStart, dataEnd);
      }
    }
  }

  return { file: fileData, text: textData, pdfPages: pdfPagesData };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: API key not set' });
  }

  try {
    const { file, text, pdfPages } = await parseMultipartFormData(req);
    const scheduleText = text || '';

    let fileData = file;

    // Wenn es eine PDF-Datei ist und Seiten ausgewählt wurden
    if (file && file.mimeType === 'application/pdf' && pdfPages && pdfPages.trim()) {
      const pageIndices = parsePageNumbers(pdfPages);
      
      if (pageIndices && pageIndices.length > 0) {
        const processedPdfBase64 = await extractPdfPages(file.data, pageIndices);
        fileData = {
          data: processedPdfBase64,
          mimeType: file.mimeType
        };
      }
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = 'gemini-2.5-flash';
    const prompt = getPrompt(scheduleText);
    
    const contents = [];
    if (fileData) {
      contents.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    }
    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    return res.status(200).json({ events: parsedResponse.events || [] });
  } catch (error) {
    console.error('Error in analyze API:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
}
