import { NextResponse } from "next/server";
import { getLevel } from "@/content/levels";
import { forgeLevel } from "@/lib/level-generator";
import {
  saveGeneratedLevel,
  readGeneratedLevel,
  deleteGeneratedLevel,
} from "@/lib/generated-levels";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await ctx.params;
  const id = Number.parseInt(levelId, 10);
  if (!Number.isInteger(id) || id < 0 || id > 100) {
    return NextResponse.json({ error: "Invalid level id" }, { status: 400 });
  }

  const base = getLevel(id);
  if (!base) return NextResponse.json({ error: "Unknown level" }, { status: 404 });

  // Chapter 0-9 are hand-written: nothing to forge. Serve them for completeness.
  if (!base.preview) {
    return NextResponse.json({ level: base, cached: false, generated: false });
  }

  const cached = readGeneratedLevel(id);
  if (cached && !cached.preview) {
    return NextResponse.json({ level: cached, cached: true, generated: true });
  }

  const forged = await forgeLevel(base);
  if (forged.ok) {
    saveGeneratedLevel(forged.level);
    return NextResponse.json({ level: forged.level, cached: false, generated: true });
  }

  // No key or Gemini hiccup: report it so the UI shows a clear retry button.
  return NextResponse.json(
    { error: forged.error ?? "Generation failed", needsRetry: true },
    { status: 502 }
  );
}

/** Force-regenerate one chapter: clears the disk cache then reforges. */
export async function DELETE(_req: Request, ctx: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await ctx.params;
  const id = Number.parseInt(levelId, 10);
  if (!Number.isInteger(id) || id < 0 || id > 100) {
    return NextResponse.json({ error: "Invalid level id" }, { status: 400 });
  }
  deleteGeneratedLevel(id);
  return NextResponse.json({ cleared: true });
}
