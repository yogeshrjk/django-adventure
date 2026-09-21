import { cookies } from "next/headers";
import { getUsersCollection, UserDocument } from "@/lib/mongodb";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  image?: string;
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = "da_session";

function getSecretKey(): string {
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "django-adventure-default-secret-key-please-change-in-env";
}

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getGoogleRedirectUri(): string {
  return `${getAppUrl()}/api/auth/callback/google`;
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_ID.trim() !== "" &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_SECRET.trim() !== ""
  );
}

export function getGoogleOAuthUrl(state = "/"): string {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured in .env");
  }

  const redirectUri = getGoogleRedirectUri();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<{ access_token: string; id_token?: string }> {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = getGoogleRedirectUri();

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials are not configured.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Google token exchange error response:", errText);
    throw new Error(`Failed to exchange Google OAuth code: ${errText}`);
  }

  return response.json();
}

export interface GoogleUserProfile {
  sub?: string;
  id?: string;
  email: string;
  name: string;
  picture?: string;
}

export async function getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Failed to fetch Google userinfo:", errText);
    throw new Error(`Failed to fetch Google user profile: ${errText}`);
  }

  const data = await response.json();
  return {
    id: data.sub || data.id,
    sub: data.sub || data.id,
    email: data.email,
    name: data.name || data.given_name || "Adventurer",
    picture: data.picture,
  };
}

// Web Crypto HMAC-SHA256 JWT implementation
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSecretKey()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(data: Uint8Array | string): string {
  const buf = typeof data === "string" ? Buffer.from(data, "utf8") : Buffer.from(data);
  return buf.toString("base64url");
}

function base64UrlDecode(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, "base64url"));
}

export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const saltBytes = salt ? base64UrlDecode(salt) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign"]
  );
  const exported = await crypto.subtle.exportKey("raw", derivedKey);
  return {
    hash: base64UrlEncode(new Uint8Array(exported)),
    salt: base64UrlEncode(saltBytes),
  };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  try {
    const result = await hashPassword(password, salt);
    return result.hash === hash;
  } catch {
    return false;
  }
}

export async function createSessionToken(payload: Omit<SessionPayload, "iat" | "exp">): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 30 * 24 * 60 * 60; // 30 days
  const fullPayload: SessionPayload = { ...payload, iat, exp };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));
  const encodedSignature = base64UrlEncode(new Uint8Array(signature));

  return `${dataToSign}.${encodedSignature}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const signatureBytes = base64UrlDecode(encodedSignature);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      enc.encode(dataToSign)
    );

    if (!isValid) return null;

    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as SessionPayload;

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("verifySessionToken error:", err);
    return null;
  }
}

export async function getSessionUser(): Promise<UserDocument | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload || !payload.email) return null;

    const cleanEmail = payload.email.trim().toLowerCase();

    try {
      const users = await getUsersCollection();
      let user = await users.findOne({ email: cleanEmail });

      // If user document is missing in DB for some reason, re-create it from valid token payload
      if (!user) {
        const now = new Date();
        const insertRes = await users.insertOne({
          email: cleanEmail,
          name: payload.name || cleanEmail.split("@")[0] || "Adventurer",
          image: payload.image,
          googleId: payload.userId,
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
        user = await users.findOne({ _id: insertRes.insertedId });
      }

      return user;
    } catch (dbErr) {
      console.error("Database lookup error in getSessionUser:", dbErr);
      // Return fallback user based on verified session token
      return {
        email: cleanEmail,
        name: payload.name || "Adventurer",
        image: payload.image,
        googleId: payload.userId,
        xp: 0,
        gems: 0,
        hearts: 5,
        streak: 1,
        completedLevels: [],
        currentLevel: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      };
    }
  } catch (err) {
    console.error("getSessionUser error:", err);
    return null;
  }
}

export function createSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}${
    isProd ? "; Secure" : ""
  }`;
}

export function clearSessionCookie(): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${
    isProd ? "; Secure" : ""
  }`;
}
