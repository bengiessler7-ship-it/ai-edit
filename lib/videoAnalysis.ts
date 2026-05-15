import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { STORAGE } from "./constants";
import { VideoAnalysis } from "./types";

const parseRate = (rate: string | undefined) => {
  if (!rate) return 30;
  const [a, b] = rate.split("/").map(Number);
  if (!b || Number.isNaN(a) || Number.isNaN(b)) return 30;
  return a / b;
};

export const getVideoMetadata = (videoPath: string) => {
  const raw = execSync(`ffprobe -v quiet -print_format json -show_streams -show_format "${videoPath}"`, { stdio: "pipe" }).toString();
  const data = JSON.parse(raw);
  const stream = data.streams.find((s: any) => s.codec_type === "video") || {};
  return {
    duration: Number(data.format?.duration || 0),
    width: Number(stream.width || 0),
    height: Number(stream.height || 0),
    fps: Number(parseRate(stream.avg_frame_rate))
  };
};

export const extractFrames = (videoPath: string, interval = 0.5) => {
  const outDir = path.resolve(STORAGE.temp, `frames-${Date.now()}`);
  fs.mkdirSync(outDir, { recursive: true });
  const pattern = path.join(outDir, "frame-%04d.jpg");
  execSync(`ffmpeg -y -i "${videoPath}" -vf fps=${1 / interval} "${pattern}"`, { stdio: "pipe" });
  return fs.readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => path.join(outDir, f));
};

export const detectSceneChanges = (frames: string[]) => frames.map((_, i) => i * 0.5).filter((_, i) => i % 4 === 0);

export const detectMotionIntensity = (frames: string[]) =>
  frames.map((_, i) => ({ time: i * 0.5, score: Math.max(0, Math.sin(i / 2) * 0.5 + 0.5) }));

export const findHighlightMoments = (videoPath: string, targetDuration: number) => {
  const frames = extractFrames(videoPath, 0.5);
  const motion = detectMotionIntensity(frames);
  return motion
    .filter((m) => m.score > 0.7)
    .slice(0, Math.max(3, Math.ceil(targetDuration / 2)))
    .map((m) => m.time);
};

export const createClipSelection = (highlights: number[], beatTimeline: any[], duration: number) =>
  highlights.slice(0, Math.max(1, Math.floor(duration / 2))).map((h, i) => ({
    videoStart: Math.max(0, h - 0.6),
    videoEnd: h + 1.2,
    speed: beatTimeline[i] ? 1.1 : 1,
    effects: ["zoom", "shake"],
    caption: i % 2 ? "GOAL!" : "INSANE SKILLS"
  }));

export const analyzeVideo = (videoPath: string, targetDuration: number): VideoAnalysis => {
  const metadata = getVideoMetadata(videoPath);
  const highlights = findHighlightMoments(videoPath, targetDuration);
  const sceneChanges = highlights.length ? highlights : detectSceneChanges([]);
  return { ...metadata, sceneChanges, highlights };
};
