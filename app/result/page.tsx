"use client";
import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const params = useSearchParams();
  const id = params.get("id");
  if (!id) return <main className="p-6">Keine Projekt-ID gefunden.</main>;

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Dein fertiger Edit</h1>
      <video controls className="w-full rounded border border-zinc-800" src={`/api/download/${id}`} />
      <a className="inline-block bg-neon text-black px-4 py-2 rounded font-bold" href={`/api/download/${id}`}>
        MP4 herunterladen
      </a>
    </main>
  );
}
