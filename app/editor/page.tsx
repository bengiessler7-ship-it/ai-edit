"use client";

import { useState } from "react";
import { DEFAULT_PROMPT } from "@/lib/constants";

export default function EditorPage() {
  const [video, setVideo] = useState<File | null>(null);
  const [music, setMusic] = useState<File | null>(null);
  const [description, setDescription] = useState(DEFAULT_PROMPT);
  const [format, setFormat] = useState("9:16");
  const [resolution, setResolution] = useState("1080p");
  const [duration, setDuration] = useState(15);
  const [rights, setRights] = useState(false);
  const [projectId, setProjectId] = useState<string>("");
  const [status, setStatus] = useState<string>("Bereit");
  const [error, setError] = useState<string>("");

  const run = async () => {
    setError("");
    if (!rights) return setError("Bitte bestätige, dass du die Rechte an diesem Video hast.");
    if (!video) return setError("Bitte lade ein Video hoch.");

    setStatus("Projekt wird erstellt...");
    const p = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetDuration: duration, outputFormat: format, resolution, editDescription: description }) }).then((r) => r.json());
    setProjectId(p.id);

    const uploadVideo = new FormData();
    uploadVideo.append("projectId", p.id);
    uploadVideo.append("video", video);
    setStatus("Video wird hochgeladen...");
    await fetch("/api/upload/video", { method: "POST", body: uploadVideo });

    if (music) {
      const uploadMusic = new FormData();
      uploadMusic.append("projectId", p.id);
      uploadMusic.append("music", music);
      setStatus("Musik wird hochgeladen...");
      await fetch("/api/upload/music", { method: "POST", body: uploadMusic });
    }


    setStatus("Analyse läuft...");
    const analysis = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: p.id, targetDuration: duration, format, resolution, description })
    }).then((r) => r.json());

    setStatus("Schnittplan wird erstellt...");
    await fetch("/api/generate-edit-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: p.id, description, videoAnalysis: analysis.videoAnalysis, audioAnalysis: analysis.audioAnalysis })
    });

    setStatus("Rendering läuft...");
    const rendered = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: p.id })
    }).then((r) => r.json());

    if (rendered.error) return setError(rendered.error);
    setStatus("Fertig! Download verfügbar.");
    window.location.href = `/result?id=${p.id}`;
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-bold">EditKick AI Studio Local</h1>
      <p className="text-zinc-300">Bitte verwende nur Videos, an denen du die Rechte hast oder für die du eine Erlaubnis besitzt.</p>
      <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} className="w-full" />
      <input type="file" accept="audio/*" onChange={(e) => setMusic(e.target.files?.[0] || null)} className="w-full" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-900 p-3 rounded" rows={5} />
      <div className="grid grid-cols-3 gap-3">
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="bg-zinc-900 p-2 rounded"><option>9:16</option><option>16:9</option><option>1:1</option></select>
        <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="bg-zinc-900 p-2 rounded"><option>4k</option><option>1080p</option><option>720p</option><option>480p</option></select>
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="bg-zinc-900 p-2 rounded"><option value={10}>10s</option><option value={15}>15s</option><option value={30}>30s</option><option value={60}>60s</option></select>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={rights} onChange={(e) => setRights(e.target.checked)} /> Ich besitze die Rechte an diesem Video oder habe die Erlaubnis, es zu bearbeiten.</label>
      <button onClick={run} className="bg-neon text-black px-4 py-2 rounded font-bold">KI-Edit generieren</button>
      <div className="text-zinc-300">Status: {status}</div>
      {projectId && <div className="text-xs text-zinc-400">Projekt-ID: {projectId}</div>}
      {error && <div className="text-red-400">{error}</div>}
    </main>
  );
}
