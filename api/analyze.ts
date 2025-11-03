import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY environment variable not set.");
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

const parseMultipartFormData = async (req: VercelRequest): Promise<{ file?: { data: string; mimeType: string }, text?: string }> => {
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
      }
    }
  }

  return { file: fileData, text: textData };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: API key not set' });
  }

  try {
    const { file, text } = await parseMultipartFormData(req);
    const scheduleText = text || '';

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = 'gemini-2.5-flash';
    const prompt = getPrompt(scheduleText);
    
    const contents = [];
    if (file) {
      contents.push({ inlineData: { data: file.data, mimeType: file.mimeType } });
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
