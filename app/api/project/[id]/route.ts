import { NextResponse } from "next/server"; import { getProject } from "@/lib/projectStore";
export async function GET(_:Request,{params}:{params:{id:string}}){ const p=getProject(params.id); return p?NextResponse.json(p):NextResponse.json({error:"Nicht gefunden"},{status:404}); }
