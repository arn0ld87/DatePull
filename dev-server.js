import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from 'dotenv';
import { parsePageNumbers, extractPdfPages } from './utils/pdfProcessor.js';

dotenv.config();

const app = express();
const upload = multer();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

const getPrompt = (scheduleText) => `
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
                    date: { type: Type.STRING, description: "Startdatum des ersten Termins im Format YYYY-MM-DD." },
                    start_time: { type: Type.STRING, description: "Startzeit im 24-Stunden-Format HH:MM." },
                    end_time: { type: Type.STRING, description: "Endzeit im 24-Stunden-Format HH:MM." },
                    location: { type: Type.STRING, description: "Ort des Termins (z.B. 'Hörsaal 5C')." },
                    notes: { type: Type.STRING, description: "Zusätzliche Notizen oder Besonderheiten." },
                    recurrence: { type: Type.STRING, description: "Wiederholungsregel im RRULE-Format (z.B. 'FREQ=WEEKLY;BYDAY=TU')." },
                    attendees: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Liste der Teilnehmer." },
                    all_day: { type: Type.BOOLEAN, description: "Ganztägiger Termin." },
                    calendar_id: { type: Type.STRING, description: "Optionale Kalender-ID." },
                },
                required: ["title", "date", "start_time", "end_time", "location", "notes", "recurrence", "attendees", "all_day"]
            }
        }
    },
    required: ["events"]
};

app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    let file = req.file;
    const text = req.body.text || '';
    const pdfPages = req.body.pdfPages || '';

    // Wenn es eine PDF-Datei ist und Seiten ausgewählt wurden
    if (file && file.mimetype === 'application/pdf' && pdfPages.trim()) {
      console.log('Extracting pages from PDF:', pdfPages);
      const pageIndices = parsePageNumbers(pdfPages);
      
      if (pageIndices && pageIndices.length > 0) {
        const processedPdfBuffer = await extractPdfPages(file.buffer, pageIndices);
        // Erstelle ein neues "file"-Objekt mit dem verarbeiteten PDF
        file = {
          ...file,
          buffer: processedPdfBuffer,
          size: processedPdfBuffer.length
        };
        console.log(`Extracted ${pageIndices.length} page(s): ${pageIndices.map(i => i + 1).join(', ')}`);
      }
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = 'gemini-2.5-flash';
    const prompt = getPrompt(text);
    
    const contents = [];
    if (file) {
      const base64Data = file.buffer.toString('base64');
      contents.push({ inlineData: { data: base64Data, mimeType: file.mimetype } });
    }
    contents.push({ text: prompt });

    console.log('Sending request to Gemini API...');
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
    
    console.log('Successfully analyzed:', parsedResponse.events?.length || 0, 'events');
    res.json({ events: parsedResponse.events || [] });
  } catch (error) {
    console.error('Error in analyze API:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Dev API Server running on http://localhost:${PORT}`);
  console.log(`API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
});
