import { MongoClient, Db, ObjectId } from "mongodb";

export interface UserDocument {
  _id?: ObjectId;
  email: string;
  name: string;
  image?: string;
  passwordHash?: string;
  passwordSalt?: string;
  authProvider?: "google" | "credentials";
  googleId?: string;
  xp: number;
  gems: number;
  hearts: number;
  streak: number;
  completedLevels: number[];
  currentLevel: number;
  geminiApiKey?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

export interface LeaderboardEntry {
  _id?: string;
  name: string;
  image?: string;
  xp: number;
  gems: number;
  completedCount: number;
  currentLevel: number;
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "django_adventure";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return Boolean(uri && uri.trim() !== "");
}

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === "") {
    throw new Error("MONGODB_URI is not set in environment variables. Please check your .env file.");
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || "django_adventure";
  return client.db(dbName);
}

export async function getUsersCollection() {
  const db = await getMongoDb();
  return db.collection<UserDocument>("users");
}
