import { NextResponse } from "next/server";
import { getUsersCollection, isMongoConfigured } from "@/lib/mongodb";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({
      configured: false,
      leaderboard: [],
    });
  }

  try {
    const users = await getUsersCollection();
    const topUsers = await users
      .find(
        {},
        {
          projection: {
            name: 1,
            image: 1,
            xp: 1,
            gems: 1,
            currentLevel: 1,
            completedLevels: 1,
          },
        }
      )
      .sort({ xp: -1, currentLevel: -1 })
      .limit(20)
      .toArray();

    const formatted = topUsers.map((u, index) => ({
      rank: index + 1,
      id: u._id?.toString(),
      name: u.name || "Adventurer",
      image: u.image || "/logo.png",
      xp: u.xp || 0,
      gems: u.gems || 0,
      currentLevel: u.currentLevel || 0,
      completedCount: (u.completedLevels || []).length,
    }));

    return NextResponse.json({
      configured: true,
      leaderboard: formatted,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
