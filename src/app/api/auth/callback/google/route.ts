import { NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  getGoogleUserProfile,
  createSessionToken,
  SESSION_COOKIE_NAME,
  getAppUrl,
} from "@/lib/auth";
import { getUsersCollection, isMongoConfigured } from "@/lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/";
  const error = searchParams.get("error");

  const appUrl = getAppUrl();

  if (error || !code) {
    return NextResponse.redirect(
      new URL(
        `/settings?auth_error=${encodeURIComponent(error || "No authorization code provided")}`,
        appUrl
      )
    );
  }

  try {
    // 1. Exchange code for Google OAuth tokens
    console.log("[Google Auth] Exchanging code for tokens...");
    const tokens = await exchangeGoogleCode(code);

    // 2. Fetch user profile from Google
    console.log("[Google Auth] Fetching profile from Google userinfo API...");
    const profile = await getGoogleUserProfile(tokens.access_token);
    console.log(`[Google Auth] Profile received: email=${profile.email}, name=${profile.name}`);

    if (!profile.email) {
      return NextResponse.redirect(new URL("/settings?auth_error=NoEmailProvided", appUrl));
    }

    const cleanEmail = profile.email.trim().toLowerCase();
    const displayName = profile.name || cleanEmail.split("@")[0] || "Adventurer";
    const googleId = profile.sub || profile.id || cleanEmail;
    let userId = googleId;

    // 3. Upsert user in MongoDB Atlas
    if (isMongoConfigured()) {
      console.log("[Google Auth] Connecting to MongoDB Atlas...");
      const users = await getUsersCollection();
      const existingUser = await users.findOne({ email: cleanEmail });
      const now = new Date();

      if (!existingUser) {
        // Create new user in database
        console.log(`[Google Auth] Creating new user for: ${cleanEmail}`);
        const result = await users.insertOne({
          email: cleanEmail,
          name: displayName,
          image: profile.picture,
          googleId: googleId,
          authProvider: "google",
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
        userId = result.insertedId.toString();
        console.log(`[Google Auth] User successfully created in MongoDB with ID: ${userId}`);
      } else {
        // Existing user: simply login & update profile/timestamp
        console.log(`[Google Auth] User already exists in MongoDB with ID: ${existingUser._id}`);
        await users.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              name: displayName,
              image: profile.picture || existingUser.image,
              googleId: googleId,
              lastLogin: now,
              updatedAt: now,
            },
          }
        );
        userId = existingUser._id.toString();
      }
    } else {
      console.warn("[Google Auth] MONGODB_URI is not set; user will not be persisted in database.");
    }

    // 4. Create signed session JWT
    const token = await createSessionToken({
      userId,
      email: cleanEmail,
      name: displayName,
      image: profile.picture,
    });

    // 5. Redirect and set session cookie
    const targetUrl = state.startsWith("/") ? `${appUrl}${state}` : appUrl;
    console.log(`[Google Auth] Successfully logged in! Redirecting to: ${targetUrl}`);
    const response = NextResponse.redirect(new URL(targetUrl));

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err) {
    console.error("[Google Auth Error]:", err);
    return NextResponse.redirect(
      new URL(
        `/settings?auth_error=${encodeURIComponent(
          err instanceof Error ? err.message : "Authentication failed"
        )}`,
        appUrl
      )
    );
  }
}
