import {
  users,
  facePhotos,
  type User,
  type InsertUser,
  type AdminCreateUserData,
  type AdminUpdateUserData,
  type FacePhoto,
  type InsertFacePhoto,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(email: string, password: string): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  verifyEmailToken(token: string): Promise<User | undefined>;
  generateEmailVerificationToken(userId: number): Promise<string>;
  updatePassword(userId: number, newPassword: string): Promise<void>;
  
  // Email change operations
  initiateEmailChange(userId: number, newEmail: string): Promise<string>;
  confirmEmailChange(token: string): Promise<User | undefined>;
  cancelEmailChange(userId: number): Promise<boolean>;
  resendEmailChangeVerification(userId: number): Promise<string>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  adminCreateUser(userData: AdminCreateUserData): Promise<User>;
  adminUpdateUser(id: number, updates: AdminUpdateUserData): Promise<User | undefined>;
  adminDeleteUser(id: number): Promise<boolean>;

  // Face photos operations
  getFacePhotos(userId: number): Promise<FacePhoto[]>;
  createFacePhoto(userId: number, data: InsertFacePhoto): Promise<FacePhoto>;
  updateFacePhoto(id: number, userId: number, data: Partial<InsertFacePhoto>): Promise<FacePhoto | undefined>;
  deleteFacePhoto(id: number, userId: number): Promise<boolean>;
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
    const updateData: Partial<typeof users.$inferInsert> = {
      email: updates.email,
      password: updates.password,
      isEmailVerified: updates.isEmailVerified,
      isAdmin: updates.isAdmin,
      firstName: updates.firstName,
      lastName: updates.lastName,
      address: updates.address,
      city: updates.city,
      state: updates.state,
      zipCode: updates.zipCode,
      country: updates.country,
      updatedAt: new Date(),
    };

    // Handle date conversion for dateOfBirth
    if (updates.dateOfBirth) {
      updateData.dateOfBirth = new Date(updates.dateOfBirth);
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async adminDeleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Email change operations
  async initiateEmailChange(userId: number, newEmail: string): Promise<string> {
    // Check if new email is already in use
    const existingUser = await this.getUserByEmail(newEmail);
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Email address is already in use");
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db
      .update(users)
      .set({
        pendingEmail: newEmail,
        emailChangeToken: token,
        emailChangeExpires: expires,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return token;
  }

  async confirmEmailChange(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailChangeToken, token));

    if (!user || !user.emailChangeExpires || new Date() > user.emailChangeExpires) {
      return undefined;
    }

    if (!user.pendingEmail) {
      return undefined;
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        email: user.pendingEmail,
        pendingEmail: null,
        emailChangeToken: null,
        emailChangeExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    return updatedUser;
  }

  async cancelEmailChange(userId: number): Promise<boolean> {
    const result = await db
      .update(users)
      .set({
        pendingEmail: null,
        emailChangeToken: null,
        emailChangeExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return (result.rowCount || 0) > 0;
  }

  async resendEmailChangeVerification(userId: number): Promise<string> {
    const user = await this.getUser(userId);
    if (!user || !user.pendingEmail) {
      throw new Error("No pending email change found");
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db
      .update(users)
      .set({
        emailChangeToken: token,
        emailChangeExpires: expires,
        lastEmailSent: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return token;
  }

  // Face photos operations
  async getFacePhotos(userId: number): Promise<FacePhoto[]> {
    const photos = await db.select().from(facePhotos).where(eq(facePhotos.userId, userId));
    return photos;
  }

  async createFacePhoto(userId: number, data: InsertFacePhoto): Promise<FacePhoto> {
    const [photo] = await db
      .insert(facePhotos)
      .values({
        ...data,
        userId,
      })
      .returning();
    return photo;
  }

  async updateFacePhoto(id: number, userId: number, data: Partial<InsertFacePhoto>): Promise<FacePhoto | undefined> {
    const [photo] = await db
      .update(facePhotos)
      .set(data)
      .where(and(eq(facePhotos.id, id), eq(facePhotos.userId, userId)))
      .returning();
    return photo || undefined;
  }

  async deleteFacePhoto(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(facePhotos)
      .where(and(eq(facePhotos.id, id), eq(facePhotos.userId, userId)));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
