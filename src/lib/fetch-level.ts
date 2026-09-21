export interface LevelResponse {
  level: import("@/lib/levels").Level;
  cached: boolean;
  generated: boolean;
}

export type LevelFetchState =
  | { kind: "loading" }
  | { kind: "ready"; level: import("@/lib/levels").Level; generated: boolean; cached: boolean }
  | { kind: "retry"; message: string }
  | { kind: "error"; message: string };

export async function fetchLevel(id: number, signal?: AbortSignal): Promise<LevelResponse> {
  const res = await fetch(`/api/level/${id}`, { signal, cache: "no-store" });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }
  return res.json();
}
