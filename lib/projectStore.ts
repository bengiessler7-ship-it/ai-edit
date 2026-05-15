import fs from "fs";
import path from "path";
import { STORAGE } from "./constants";
import { ensureStorageDirs } from "./fileStorage";
import { Project } from "./types";

const projectFile = (id: string) => path.resolve(STORAGE.projects, `${id}.json`);

export const saveProject = (project: Project) => {
  ensureStorageDirs();
  fs.writeFileSync(projectFile(project.id), JSON.stringify(project, null, 2), "utf8");
  return project;
};

export const getProject = (id: string): Project | null => {
  try {
    return JSON.parse(fs.readFileSync(projectFile(id), "utf8")) as Project;
  } catch {
    return null;
  }
};

export const updateProject = (id: string, patch: Partial<Project>) => {
  const current = getProject(id);
  if (!current) return null;
  const next = {
    ...current,
    ...patch,
    logs: [...(current.logs || []), ...(patch.logs || [])]
  } as Project;
  return saveProject(next);
};
