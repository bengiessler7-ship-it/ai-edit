# EditKick AI Studio Local
Lokale MVP-Web-App für automatische Fußball-Edits aus Video, Musik und Prompt.
## Installation
```bash
npm install
npm run dev
```
Optional:
```bash
npm run worker
```
## FFmpeg installieren
- Windows: FFmpeg von ffmpeg.org laden, `bin` zum PATH hinzufügen.
- macOS: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg`
## Funktionen
- Lokaler Upload für Video/Musik
- Prompt Parsing (`/lib/promptParser.ts`)
- Heuristische Audioanalyse (`/lib/audioAnalysis.ts`)
- Heuristische Videoanalyse (`/lib/videoAnalysis.ts`)
- Edit-Plan-Generierung (`/lib/editPlanner.ts`)
- Lokales Rendern per FFmpeg (`/lib/localRenderer.ts`)
## API
- `POST /api/projects`
- `POST /api/upload/video`
- `POST /api/upload/music`
- `POST /api/analyze`
- `POST /api/generate-edit-plan`
- `POST /api/render`
- `GET /api/project/:id`
- `GET /api/download/:id`
- `GET /api/health`
## Ordner
`storage/uploads/videos`, `storage/uploads/music`, `storage/projects`, `storage/renders`, `storage/temp`.
## Rechtlicher Hinweis
Bitte verwende nur Videos, an denen du die Rechte hast oder für die du eine Erlaubnis besitzt.
## Grenzen
MVP nutzt heuristische "KI" statt echter Modelle. Manche FFmpeg-Filter sind optional und werden bei Nichtverfügbarkeit übersprungen.
