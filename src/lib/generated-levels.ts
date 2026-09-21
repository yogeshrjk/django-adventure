import fs from "node:fs";
import path from "node:path";
import type { Level } from "@/lib/levels";

/**
 * Tiny disk cache for Gemini-generated chapters. Each chapter is forged once
 * and written to .generated-levels/<id>.json so subsequent visits are instant
 * and cost zero tokens. The folder is gitignored: regenerating is one click.
 */
const CACHE_DIR = path.join(process.cwd(), ".generated-levels");

function safeId(id: number): boolean {
  return Number.isInteger(id) && id >= 0 && id <= 100;
}

function filePath(id: number): string {
  return path.join(CACHE_DIR, `${id}.json`);
}

export function readGeneratedLevel(id: number): Level | null {
  if (!safeId(id)) return null;
  try {
    const raw = fs.readFileSync(filePath(id), "utf8");
    const parsed = JSON.parse(raw) as Level;
    if (typeof parsed?.id !== "number" || parsed.id !== id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveGeneratedLevel(level: Level): boolean {
  if (!safeId(level.id)) return false;
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(filePath(level.id), JSON.stringify(level, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

/** Dev helper wired to a DELETE route: force-regenerate one chapter. */
export function deleteGeneratedLevel(id: number): boolean {
  if (!safeId(id)) return false;
  try {
    fs.rmSync(filePath(id), { force: true });
    return true;
  } catch {
    return false;
  }
}
