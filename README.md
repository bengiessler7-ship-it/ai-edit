# EditKick AI Studio Local

## Super einfacher Start

### Option A (empfohlen)
```bash
npm run run-local
```
Der Befehl prüft FFmpeg, führt `npm install` aus und startet dann `npm run dev`.

### Option B (manuell)
```bash
npm install
npm run dev
```
Dann im Browser öffnen: `http://localhost:3000/editor`

---

## So benutzt du die App (3 Schritte)
1. Video hochladen.
2. Optional Musik hochladen + Prompt eingeben.
3. Rechte-Checkbox aktivieren und auf **KI-Edit generieren** klicken.

Danach wird automatisch analysiert, geplant, gerendert und du landest auf der Download-Seite.

---

## Wenn etwas nicht klappt
- **FFmpeg fehlt** → installieren: https://ffmpeg.org/download.html
- **npm install 403** → das ist ein Proxy/Registry-Thema in deiner Umgebung.
  - Test: `npm ping`
  - Registry prüfen: `npm config get registry`
  - Firmenproxy korrekt setzen.

---

## Wichtig (Rechtliches)
Bitte verwende nur Videos, für die du die Rechte oder eine Erlaubnis hast.
