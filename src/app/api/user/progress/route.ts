import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUsersCollection, isMongoConfigured } from "@/lib/mongodb";

interface ProgressBody {
  xp?: number;
  gems?: number;
  hearts?: number;
  streak?: number;
  completed?: number[];
  currentLevel?: number;
  geminiApiKey?: string;
}

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB Atlas is not configured." },
      { status: 503 }
    );
  }

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      xp: user.xp || 0,
      gems: user.gems || 0,
      hearts: user.hearts ?? 5,
      streak: user.streak || 1,
      completedLevels: user.completedLevels || [],
      currentLevel: user.currentLevel || 0,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch cloud progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB Atlas is not configured." },
      { status: 503 }
    );
  }

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to sync progress." }, { status: 401 });
    }

    const body = (await request.json()) as ProgressBody;
    const users = await getUsersCollection();

    // Safe merge logic: preserve the highest achievements
    const currentCompleted = user.completedLevels || [];
    const incomingCompleted = body.completed || [];
    const mergedCompleted = Array.from(new Set([...currentCompleted, ...incomingCompleted]));

    const mergedXp = Math.max(user.xp || 0, body.xp || 0);
    const mergedGems = Math.max(user.gems || 0, body.gems || 0);
    const mergedStreak = Math.max(user.streak || 1, body.streak || 1);
    const mergedLevel = Math.max(user.currentLevel || 0, body.currentLevel || 0);
    const hearts = body.hearts !== undefined ? body.hearts : user.hearts;

    const now = new Date();
    await users.updateOne(
      { email: user.email },
      {
        $set: {
          xp: mergedXp,
          gems: mergedGems,
          hearts: hearts ?? 5,
          streak: mergedStreak,
          completedLevels: mergedCompleted,
          currentLevel: mergedLevel,
          ...(body.geminiApiKey !== undefined ? { geminiApiKey: body.geminiApiKey } : {}),
          updatedAt: now,
        },
      }
    );

    return NextResponse.json({
      success: true,
      syncedAt: now,
      data: {
        xp: mergedXp,
        gems: mergedGems,
        hearts: hearts ?? 5,
        streak: mergedStreak,
        completedLevels: mergedCompleted,
        currentLevel: mergedLevel,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sync cloud progress" },
      { status: 500 }
    );
  }
}
