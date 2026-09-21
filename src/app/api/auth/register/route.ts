import { NextResponse } from "next/server";
import { getUsersCollection, isMongoConfigured } from "@/lib/mongodb";
import { hashPassword, createSessionToken, createSessionCookie } from "@/lib/auth";

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
    const { email, password, name } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name && typeof name === "string" ? name.trim() : "") || cleanEmail.split("@")[0];

    const users = await getUsersCollection();
    const existing = await users.findOne({ email: cleanEmail });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // Hash password with PBKDF2
    const { hash, salt } = await hashPassword(password);
    const now = new Date();

    const insertResult = await users.insertOne({
      email: cleanEmail,
      name: cleanName,
      passwordHash: hash,
      passwordSalt: salt,
      authProvider: "credentials",
      xp: 0,
      gems: 0,
      hearts: 5,
      streak: 1,
      completedLevels: [],
      currentLevel: 0,
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
    });

    const userId = insertResult.insertedId.toString();

    // Create session token
    const token = await createSessionToken({
      userId,
      email: cleanEmail,
      name: cleanName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        name: cleanName,
        xp: 0,
        gems: 0,
        hearts: 5,
        streak: 1,
        completedLevels: [],
        currentLevel: 0,
      },
    });

    response.headers.set("Set-Cookie", createSessionCookie(token));
    return response;
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to register account" },
      { status: 500 }
    );
  }
}
