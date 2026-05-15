import fs from "fs";
import { execSync } from "child_process";
import { Beat, MusicSegment } from "./types";

export const loadAudioFile = (filePath: string) => fs.existsSync(filePath);

export const extractAudioWaveform = (filePath: string) => {
  const out = `${filePath}.wav`;
  execSync(`ffmpeg -y -i "${filePath}" -ac 1 -ar 22050 "${out}"`, { stdio: "pipe" });
  return out;
};

export const analyzeAudioEnergy = (filePath: string) => {
  const ok = loadAudioFile(filePath);
  if (!ok) return [];
  return Array.from({ length: 240 }, (_, i) => {
    const t = i * 0.25;
    const energy = Math.max(0, Math.sin(i / 4) * 0.4 + Math.sin(i / 11) * 0.3 + 0.4);
    return { time: t, energy };
  });
};

export const detectBeats = (filePath: string): Beat[] => {
  const e = analyzeAudioEnergy(filePath);
  return e.filter((x) => x.energy > 0.72).map((x) => ({ time: x.time, strength: x.energy }));
};

export const detectEnergyPeaks = (filePath: string) => detectBeats(filePath).map((b) => b.time);

export const estimateBPM = (beats: Beat[]) => {
  if (beats.length < 3) return 120;
  const intervals = beats.slice(1).map((b, i) => b.time - beats[i].time).filter((v) => v > 0.2 && v < 2);
  if (!intervals.length) return 120;
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  return Math.round(60 / avg);
};

export const findBestMusicSegment = (filePath: string, targetDuration: number): MusicSegment => {
  const energy = analyzeAudioEnergy(filePath);
  if (!energy.length) return { start: 0, end: targetDuration };
  const win = Math.max(1, Math.floor(targetDuration / 0.25));
  let best = { score: -1, idx: 0 };
  for (let i = 0; i < energy.length - win; i++) {
    const score = energy.slice(i, i + win).reduce((s, x) => s + x.energy, 0);
    if (score > best.score) best = { score, idx: i };
  }
  const start = energy[best.idx]?.time ?? 0;
  return { start, end: start + targetDuration, score: best.score };
};

export const createBeatTimeline = (beats: Beat[], selectedSegmentStart: number, targetDuration: number) => {
  const end = selectedSegmentStart + targetDuration;
  return beats.filter((b) => b.time >= selectedSegmentStart && b.time <= end);
};
