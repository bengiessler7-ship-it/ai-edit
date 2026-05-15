export type OutputFormat = "9:16" | "16:9" | "1:1";
export type Resolution = "4k" | "1080p" | "720p" | "480p";
export type RenderStatus = "created" | "uploaded" | "analyzing" | "planning" | "rendering" | "done" | "error";
export type VideoSourceType = "upload" | "youtube" | "direct_link";

export type EnhancementOptions = {
  upscale: boolean;
  sharpen: boolean;
  stabilize: boolean;
  denoise: boolean;
  colorBoost: boolean;
  fpsBoost: boolean;
  contrast: boolean;
};

export type Beat = { time: number; strength: number };
export type MusicSegment = { start: number; end: number; score?: number };
export type Clip = { videoStart: number; videoEnd: number; speed: number; effects: string[]; caption?: string };

export type VideoAnalysis = {
  duration: number;
  width: number;
  height: number;
  fps: number;
  sceneChanges: number[];
  highlights: number[];
};

export type AudioAnalysis = {
  duration: number;
  beats: Beat[];
  energyPeaks: number[];
  bpm: number;
  bestSegment: MusicSegment;
  beatTimeline: Beat[];
};

export type EditPlan = {
  duration: number;
  format: OutputFormat;
  resolution: Resolution;
  musicSegment: MusicSegment;
  clips: Clip[];
  beatSync: boolean;
  transitions: string[];
  colorGrade: string;
  enhanceQuality: boolean;
};

export type Project = {
  id: string;
  videoSourceType: VideoSourceType;
  videoUrl: string | null;
  uploadedVideoPath: string | null;
  uploadedMusicPath: string | null;
  editDescription: string;
  targetDuration: number;
  outputFormat: OutputFormat;
  resolution: Resolution;
  enhanceQuality: boolean;
  enhancementOptions: EnhancementOptions;
  status: RenderStatus;
  progress: number;
  currentStep: string;
  logs: string[];
  editPlan: EditPlan | null;
  outputVideoPath: string | null;
  error: string | null;
  createdAt: string;
};
