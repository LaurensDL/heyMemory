import {
  users,
  type User,
  type InsertUser,
  type AdminCreateUserData,
  type AdminUpdateUserData,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(email: string, password: string): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  verifyEmailToken(token: string): Promise<User | undefined>;
  generateEmailVerificationToken(userId: number): Promise<string>;
  updatePassword(userId: number, newPassword: string): Promise<void>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  adminCreateUser(userData: AdminCreateUserData): Promise<User>;
  adminUpdateUser(id: number, updates: AdminUpdateUserData): Promise<User | undefined>;
  adminDeleteUser(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(email: string, password: string): Promise<User> {
    const emailVerificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const [user] = await db
      .insert(users)
      .values({
        email,
        password, // Note: In production, this should be hashed
        emailVerificationToken,
        emailVerificationExpires,
        isEmailVerified: false,
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async generateEmailVerificationToken(userId: number): Promise<string> {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await db
      .update(users)
      .set({ 
        emailVerificationToken: token, 
        emailVerificationExpires: expires,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
    
    return token;
  }

  async verifyEmailToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token));
    
    if (!user || !user.emailVerificationExpires) {
      return undefined;
    }
    
    if (user.emailVerificationExpires < new Date()) {
      return undefined;
    }
    
    // Mark email as verified and clear token
    await db
      .update(users)
      .set({
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));
    
    return { ...user, isEmailVerified: true };
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: newPassword, // Note: In production, this should be hashed
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async adminCreateUser(userData: AdminCreateUserData): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: userData.password, // Note: In production, this should be hashed
        isAdmin: userData.isAdmin,
        isEmailVerified: userData.isEmailVerified,
      })
      .returning();
    return user;
  }

  async adminUpdateUser(id: number, updates: AdminUpdateUserData): Promise<User | undefined> {
    const processedUpdates = { ...updates };
    
    // Handle date conversion for dateOfBirth
    if (processedUpdates.dateOfBirth) {
      processedUpdates.dateOfBirth = new Date(processedUpdates.dateOfBirth) as any;
    }
    
    const [user] = await db
      .update(users)
      .set({ ...processedUpdates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async adminDeleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
