import { NextResponse } from "next/server";
import { getGoogleOAuthUrl, isGoogleAuthConfigured } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get("redirect") || "/";

  if (!isGoogleAuthConfigured()) {
    return NextResponse.json(
      {
        error: "Google OAuth is not configured.",
        message:
          "Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file.",
      },
      { status: 500 }
    );
  }

  try {
    const url = getGoogleOAuthUrl(redirectPath);
    return NextResponse.redirect(new URL(url));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate OAuth URL" },
      { status: 500 }
    );
  }
}
