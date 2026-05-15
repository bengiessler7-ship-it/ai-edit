import fs from "fs"; import path from "path"; import { STORAGE } from "./constants";
export const ensureStorageDirs = () => Object.values(STORAGE).forEach((d)=>fs.mkdirSync(path.resolve(d),{recursive:true}));
export const saveBuffer = (dir:string, filename:string, buffer:Buffer) => { ensureStorageDirs(); const p=path.resolve(dir,filename); fs.writeFileSync(p, buffer); return p; };
