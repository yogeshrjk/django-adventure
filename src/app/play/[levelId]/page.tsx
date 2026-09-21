import { notFound } from "next/navigation";
import { getLevel } from "@/content/levels";
import { readGeneratedLevel } from "@/lib/generated-levels";
import { PlayClient } from "@/components/learn/PlayClient";
import { LevelNavHeader } from "@/components/learn/LevelNavHeader";

export function generateStaticParams() {
  return Array.from({ length: 101 }, (_, i) => ({ levelId: String(i) }));
}

export default async function PlayPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  const id = Number.parseInt(levelId, 10);
  const base = getLevel(Number.isNaN(id) ? 0 : id);
  if (!base) notFound();

  // If a cached generated lesson exists on disk for an outline chapter, embed it
  // so the page shows the full lesson immediately without a client fetch.
  const level = base.preview ? readGeneratedLevel(base.id) ?? base : base;

  return (
    <main className="mx-auto max-w-7xl px-3 pb-6 sm:px-4">
      <LevelNavHeader levelId={level.id} />
      <PlayClient level={level} />
    </main>
  );
}
