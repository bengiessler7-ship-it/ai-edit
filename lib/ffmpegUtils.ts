import { execSync } from "child_process";
export const runCommand=(cmd:string)=>execSync(cmd,{stdio:"pipe"}).toString();
export const hasFilter=(name:string)=>{ try{const o=runCommand("ffmpeg -hide_banner -filters"); return o.includes(name);}catch{return false;} };
