import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

import { projects, codeSnippets, analysisResults, chatHistory, InsertProject, InsertCodeSnippet, InsertAnalysisResult, InsertChatMessage } from "../drizzle/schema";

// Projects
export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.userId, userId));
}

export async function createProject(userId: number, data: Omit<InsertProject, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projects).values({
    ...data,
    userId,
  });
  return result;
}

// Code Snippets
export async function getUserCodeSnippets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(codeSnippets).where(eq(codeSnippets.userId, userId));
}

export async function createCodeSnippet(userId: number, data: Omit<InsertCodeSnippet, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(codeSnippets).values({
    ...data,
    userId,
  });
}

export async function getCodeSnippetById(snippetId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(codeSnippets)
    .where(eq(codeSnippets.id, snippetId) && eq(codeSnippets.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// Analysis Results
export async function getSnippetAnalysis(snippetId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(analysisResults).where(eq(analysisResults.snippetId, snippetId));
}

export async function saveAnalysisResult(data: InsertAnalysisResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(analysisResults).values(data);
}

// Chat History
export async function getChatHistory(userId: number, snippetId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (snippetId) {
    return db.select().from(chatHistory)
      .where(eq(chatHistory.userId, userId) && eq(chatHistory.snippetId, snippetId));
  }
  
  return db.select().from(chatHistory).where(eq(chatHistory.userId, userId));
}

export async function saveChatMessage(data: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(chatHistory).values(data);
}
