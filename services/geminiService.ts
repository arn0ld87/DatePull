import { GoogleGenAI, Type } from "@google/genai";
import type { CalendarEvent, GeminiResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

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


export const analyzeSchedule = async (
  file: File | null,
  text: string,
): Promise<CalendarEvent[]> => {
  const model = 'gemini-2.5-flash';
  const prompt = getPrompt(text);
  
  const contents = [];
  if (file) {
    const imagePart = await fileToGenerativePart(file);
    contents.push(imagePart);
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

  try {
    const jsonText = response.text.trim();
    const parsedResponse: GeminiResponse = JSON.parse(jsonText);
    return parsedResponse.events || [];
  } catch (e) {
    console.error("Fehler beim Parsen der JSON-Antwort:", e);
    console.error("Empfangener Text:", response.text);
    throw new Error("Die Antwort des Modells konnte nicht als gültiges JSON verarbeitet werden.");
  }
};