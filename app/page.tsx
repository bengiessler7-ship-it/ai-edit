import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold">EditKick AI Studio Local</h1>
      <p className="text-zinc-300">So einfach wie möglich: Öffne den Editor, lade ein Video hoch, optional Musik dazu und starte den Render.</p>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
        <p><b>Schritt 1:</b> <code>npm install</code></p>
        <p><b>Schritt 2:</b> <code>npm run dev</code></p>
        <p><b>Schritt 3:</b> Browser: <code>http://localhost:3000/editor</code></p>
      </div>
      <div className="flex gap-3">
        <Link href="/editor" className="bg-neon text-black px-4 py-2 rounded font-semibold">Zum Editor</Link>
        <Link href="/result" className="border border-zinc-700 px-4 py-2 rounded">Zum Ergebnis</Link>
      </div>
    </main>
  );
}
