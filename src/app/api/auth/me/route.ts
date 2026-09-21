import { NextResponse } from "next/server";
import { getSessionUser, isGoogleAuthConfigured } from "@/lib/auth";
import { isMongoConfigured } from "@/lib/mongodb";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({
      authenticated: Boolean(user),
      user: user
        ? {
            id: user._id?.toString() || user.googleId,
            email: user.email,
            name: user.name,
            image: user.image,
            xp: user.xp || 0,
            gems: user.gems || 0,
            hearts: user.hearts ?? 5,
            streak: user.streak || 1,
            completedLevels: user.completedLevels || [],
            currentLevel: user.currentLevel || 0,
            geminiApiKey: user.geminiApiKey,
            updatedAt: user.updatedAt,
          }
        : null,
      isMongoConfigured: isMongoConfigured(),
      isGoogleConfigured: isGoogleAuthConfigured(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: err instanceof Error ? err.message : "Failed to get user session",
        isMongoConfigured: isMongoConfigured(),
        isGoogleConfigured: isGoogleAuthConfigured(),
      },
      { status: 500 }
    );
  }
}
