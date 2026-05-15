import fs from "fs";
import path from "path";
import { STORAGE } from "./constants";

export const ensureStorageDirs = () => {
  Object.values(STORAGE).forEach((dir) => {
    fs.mkdirSync(path.resolve(dir), { recursive: true });
  });
};

export const saveBuffer = (dir: string, filename: string, buffer: Buffer) => {
  ensureStorageDirs();
  const safeFile = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const targetPath = path.resolve(dir, safeFile);
  fs.writeFileSync(targetPath, buffer);
  return targetPath;
};

export const fileExists = (targetPath: string | null | undefined) => {
  if (!targetPath) return false;
  return fs.existsSync(path.resolve(targetPath));
};
