import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { saveProject } from "@/lib/projectStore";
import { Project } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const p: Project = {
    id: uuid(),
    videoSourceType: body.videoSourceType || "upload",
    videoUrl: body.videoUrl || null,
    uploadedVideoPath: null,
    uploadedMusicPath: null,
    editDescription: body.editDescription || "",
    targetDuration: body.targetDuration || 15,
    outputFormat: body.outputFormat || "9:16",
    resolution: body.resolution || "1080p",
    enhanceQuality: Boolean(body.enhanceQuality),
    enhancementOptions: {
      upscale: false,
      sharpen: false,
      stabilize: false,
      denoise: false,
      colorBoost: false,
      fpsBoost: false,
      contrast: false
    },
    status: "created",
    progress: 0,
    currentStep: "Projekt erstellt",
    logs: ["Projekt erstellt"],
    editPlan: null,
    outputVideoPath: null,
    error: null,
    createdAt: new Date().toISOString()
  };
  saveProject(p);
  return NextResponse.json(p);
}
