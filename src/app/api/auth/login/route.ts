import { NextResponse } from "next/server";
import { getUsersCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyPassword, createSessionToken, createSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        error: "MongoDB Atlas is not configured.",
        message: "Please add MONGODB_URI to your .env.local file to enable user accounts.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = await getUsersCollection();
    const user = await users.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.passwordHash || !user.passwordSalt) {
      if (user.googleId) {
        return NextResponse.json(
          {
            error:
              "This account was created using Google Sign In. Please use the 'Sign In with Google' button.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Invalid account authentication method." },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const now = new Date();
    await users.updateOne({ _id: user._id }, { $set: { lastLogin: now } });

    const userId = user._id?.toString() || user.email;

    const token = await createSessionToken({
      userId,
      email: user.email,
      name: user.name,
      image: user.image,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
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
      },
    });

    response.headers.set("Set-Cookie", createSessionCookie(token));
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to log in" },
      { status: 500 }
    );
  }
}
