# DatePullAI - Intelligenter Stundenplan-zu-Kalender-Konverter

Eine moderne React/Vite-Anwendung, die mit KI-Unterstützung Termine aus Stundenplänen extrahiert und als iCal-Dateien exportiert.

## Features

- 📸 **Flexible Eingabe**: Unterstützt Bilder, PDFs und Text-Eingaben
- 🤖 **KI-gestützte Analyse**: Nutzt Gemini AI zur intelligenten Termin-Extraktion
- 📅 **iCal-Export**: Exportiert alle Termine im standardisierten iCal-Format
- 🔒 **Sicher**: API-Keys werden serverseitig geschützt
- ⚡ **Modern**: React 19, Vite 6, Tailwind CSS 3
- 🎨 **Responsive Design**: Optimiert für Desktop und Mobile

## Technologie-Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **API**: Vercel Serverless Functions

## Voraussetzungen

- Node.js 18+ oder höher
- npm oder yarn
- Gemini API Key (von [Google AI Studio](https://aistudio.google.com/))

## Installation und Lokale Entwicklung

### 1. Repository klonen oder herunterladen

```bash
git clone <repository-url>
cd DatePull
```

### 2. Dependencies installieren

```bash
npm install --include=dev
```

### 3. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env`-Datei im Projekt-Root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```



### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:3000` verfügbar.

### 5. Build für Produktion erstellen

```bash
npm run build
```

Die Build-Artefakte werden im `dist`-Ordner erstellt.

### 6. Produktions-Build testen

```bash
npm run preview
```

## Deployment auf Vercel

### Automatisches Deployment

1. Repository zu GitHub pushen
2. In Vercel importieren
3. Umgebungsvariable `GEMINI_API_KEY` in den Vercel-Projekteinstellungen setzen
4. Deploy!

### Manuelles Deployment

```bash
npm install -g vercel
vercel
```

Stellen Sie sicher, dass Sie die Umgebungsvariable `GEMINI_API_KEY` in Ihrem Vercel-Dashboard konfigurieren.

## Projekt-Struktur

```
DatePull/
├── api/
│   └── analyze.ts              # Serverless API-Funktion für Gemini-Integration
├── src/
│   ├── components/             # Wiederverwendbare React-Komponenten
│   │   ├── Card.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventList.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── services/
│   │   └── geminiService.ts    # API-Client für Backend-Kommunikation
│   ├── utils/
│   │   └── calendarUtils.ts    # iCal-Generierung
│   ├── views/
│   │   ├── AnalyzeView.tsx     # Hauptansicht für Analyse
│   │   ├── HistoryView.tsx     # Verlaufsansicht
│   │   └── InfoView.tsx        # Informationsansicht
│   ├── App.tsx                 # Haupt-App-Komponente
│   ├── index.tsx               # Einstiegspunkt
│   ├── index.css               # Globale Styles mit Tailwind
│   └── types.ts                # TypeScript-Typdefinitionen
├── index.html                  # HTML-Einstiegspunkt
├── tailwind.config.js          # Tailwind-Konfiguration
├── postcss.config.js           # PostCSS-Konfiguration
├── vite.config.ts              # Vite-Konfiguration
├── vercel.json                 # Vercel-Deployment-Konfiguration
├── package.json                # Projekt-Dependencies
└── .env.example                # Beispiel für Umgebungsvariablen
```

## Verwendung

1. **Datei hochladen oder Text eingeben**: Wählen Sie zwischen Datei-Upload (Bild/PDF) oder Text-Eingabe
2. **Analysieren**: Klicken Sie auf "Stundenplan analysieren"
3. **Termine überprüfen**: Die KI extrahiert automatisch alle Termine
4. **Exportieren**: Exportieren Sie die Termine als iCal-Datei für Ihren Kalender

## Sicherheitshinweise

- ⚠️ **Niemals** die `.env`-Datei in Git committen
- Der API-Key ist nur serverseitig zugänglich
- Client-Code sendet Daten nur an die eigene API, nie direkt an externe Dienste

## Unterstützte Formate

- **Bilder**: JPG, PNG, WebP
- **Dokumente**: PDF
- **Text**: Direkteingabe von Stundenplan-Text

## Entwicklung

### Code-Formatierung

Das Projekt verwendet TypeScript mit strikten Type-Checks.

### Build-Optimierungen

- Tree-shaking für optimale Bundle-Größe
- CSS-Purging entfernt ungenutzte Styles
- Automatisches Code-Splitting
- Optimierte Asset-Kompression

## Troubleshooting

### Dependencies werden nicht installiert

```bash
npm install --include=dev
```

### API-Fehler

Stellen Sie sicher, dass:
- Die `.env`-Datei existiert und `GEMINI_API_KEY` enthält
- Der API-Key gültig ist
- Sie eine Internetverbindung haben

### Build-Fehler

```bash
rm -rf node_modules package-lock.json
npm install --include=dev
npm run build
```

## Lizenz

[Ihre Lizenz hier]

## Support

Bei Fragen oder Problemen öffnen Sie bitte ein Issue im Repository.

---

Entwickelt mit ❤️ und KI-Power
