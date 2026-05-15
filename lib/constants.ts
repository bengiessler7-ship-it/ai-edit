import { OutputFormat, Resolution } from "./types";
export const STORAGE = { root:"storage", uploadsVideos:"storage/uploads/videos", uploadsMusic:"storage/uploads/music", projects:"storage/projects", renders:"storage/renders", temp:"storage/temp" };
export const RESOLUTION_MAP: Record<OutputFormat, Record<Resolution, string>> = {"9:16":{"4k":"2160x3840","1080p":"1080x1920","720p":"720x1280","480p":"480x854"},"16:9":{"4k":"3840x2160","1080p":"1920x1080","720p":"1280x720","480p":"854x480"},"1:1":{"4k":"2160x2160","1080p":"1080x1080","720p":"720x720","480p":"480x480"}};
