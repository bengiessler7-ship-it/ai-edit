import fs from "fs"; import { execSync } from "child_process"; import { Beat, MusicSegment } from "./types";
export const loadAudioFile=(filePath:string)=>fs.existsSync(filePath);
export const extractAudioWaveform=(filePath:string)=>{ const out=`${filePath}.wav`; execSync(`ffmpeg -y -i \"${filePath}\" -ac 1 -ar 22050 \"${out}\"`); return out; };
export const analyzeAudioEnergy=(_filePath:string)=> Array.from({length:120},(_,i)=>({time:i*0.5,energy:Math.random()}));
export const detectBeats=(filePath:string):Beat[]=>analyzeAudioEnergy(filePath).filter((x)=>x.energy>0.7).map((x)=>({time:x.time,strength:x.energy}));
export const detectEnergyPeaks=(filePath:string)=>detectBeats(filePath).map((b)=>b.time);
export const estimateBPM=(beats:Beat[])=>beats.length<2?120:Math.round(60/((beats[1].time-beats[0].time)||0.5));
export const findBestMusicSegment=(filePath:string,targetDuration:number):MusicSegment=>{ const peaks=detectEnergyPeaks(filePath); const start=peaks[0]??0; return {start,end:start+targetDuration}; };
export const createBeatTimeline=(beats:Beat[], selectedSegmentStart:number, targetDuration:number)=>beats.filter((b)=>b.time>=selectedSegmentStart&&b.time<=selectedSegmentStart+targetDuration);
