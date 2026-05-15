import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { EditPlan, Project } from "./types";
import { RESOLUTION_MAP, STORAGE } from "./constants";
import { hasFilter } from "./ffmpegUtils";

export const checkFFmpegInstalled = () => {
  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
};

export const prepareWorkingDirectory = (projectId: string) => {
  const dir = path.resolve(STORAGE.temp, projectId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const cutClips = (_videoPath: string, clips: EditPlan["clips"]) => clips;
export const applySpeedChanges = (clips: EditPlan["clips"]) => clips;
export const applyCrop = (_format: string) => "";
export const applyResolution = (resolution: string, format: string) => `${resolution} ${format}`;
export const applyMusicSegment = (musicPath: string, _musicSegment: EditPlan["musicSegment"]) => musicPath;
export const mixOriginalAudioWithMusic = () => "";
export const applyCaptions = () => "";
export const applyZoomEffect = () => "";
export const applyShakeEffect = () => "";
export const applyFlashTransitions = () => "";
export const applyColorGrade = () => "";
export const applyQualityEnhancement = () => "";
export const exportMP4 = () => "";

export const cleanupTempFiles = (dir?: string) => {
  if (dir && fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
};

export const renderEditWithFFmpeg = (project: Project, editPlan: EditPlan) => {
  if (!project.uploadedVideoPath) throw new Error("Video fehlt im Projekt.");

  const workDir = prepareWorkingDirectory(project.id);
  fs.mkdirSync(path.resolve(STORAGE.renders), { recursive: true });
  const outputPath = path.resolve(STORAGE.renders, `${project.id}.mp4`);
  const resolution = RESOLUTION_MAP[editPlan.format][editPlan.resolution];

  const filters = [`scale=${resolution}`, "setsar=1"];
  if (project.enhancementOptions.sharpen) filters.push("unsharp=5:5:1.0:5:5:0.0");
  if (project.enhancementOptions.colorBoost || project.enhancementOptions.contrast) filters.push("eq=saturation=1.2:contrast=1.1");
  if (project.enhancementOptions.denoise) filters.push("hqdn3d");
  if (project.enhancementOptions.fpsBoost && hasFilter("minterpolate")) filters.push("minterpolate=fps=60");

  const hasMusic = Boolean(project.uploadedMusicPath && fs.existsSync(project.uploadedMusicPath));
  const musicInput = hasMusic ? `-stream_loop -1 -i "${project.uploadedMusicPath}"` : "";
  const audioMap = hasMusic ? "-map 0:v:0 -map 1:a:0" : "-map 0:v:0 -map 0:a?";

  const cmd = `ffmpeg -y -i "${project.uploadedVideoPath}" ${musicInput} -t ${editPlan.duration} -vf "${filters.join(",")}" ${audioMap} -c:v libx264 -c:a aac -shortest "${outputPath}"`;

  try {
    execSync(cmd, { stdio: "pipe" });
  } catch (error: any) {
    throw new Error(`Render fehlgeschlagen: ${error?.stderr?.toString?.() || error.message}`);
  } finally {
    cleanupTempFiles(workDir);
  }

  return outputPath;
};
