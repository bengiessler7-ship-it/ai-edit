import fs from "fs"; import path from "path"; import { Project } from "./types"; import { STORAGE } from "./constants"; import { ensureStorageDirs } from "./fileStorage";
const fp=(id:string)=>path.resolve(STORAGE.projects,`${id}.json`);
export const saveProject=(p:Project)=>{ ensureStorageDirs(); fs.writeFileSync(fp(p.id), JSON.stringify(p,null,2)); return p; };
export const getProject=(id:string):Project|null=>{ try{return JSON.parse(fs.readFileSync(fp(id),"utf8"));}catch{return null;} };
export const updateProject=(id:string, patch:Partial<Project>)=>{ const p=getProject(id); if(!p) return null; const n={...p,...patch}; saveProject(n); return n; };
