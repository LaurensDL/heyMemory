import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  timestamp, 
  varchar,
  jsonb,
  index 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: timestamp("date_of_birth"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  caregiverPhoneNumber: text("caregiver_phone_number"),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  pendingEmail: text("pending_email"),
  emailChangeToken: text("email_change_token"),
  emailChangeExpires: timestamp("email_change_expires"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  lastEmailSent: timestamp("last_email_sent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const facePhotos = pgTable("face_photos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  relationship: text("relationship"),
  description: text("description"),
  photoUrl: text("photo_url").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rememberItems = pgTable("remember_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  photoUrl: text("photo_url"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  caregiverPhoneNumber: z.string().optional(),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword.length > 0) {
    return data.newPassword.length >= 8 && 
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(data.newPassword);
  }
  return true;
}, {
  message: "New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
  path: ["newPassword"],
}).refine((data) => {
  if (data.newPassword && data.newPassword.length > 0) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

export const adminCreateUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  isAdmin: z.boolean().default(false),
  isEmailVerified: z.boolean().default(false),
});

export const adminUpdateUserSchema = z.object({
  email: z.string().email("Please enter a valid email address").optional(),
  password: z.string().optional().refine((val) => !val || val.length >= 6, {
    message: "Password must be at least 6 characters when provided",
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  caregiverPhoneNumber: z.string().optional(),
  isAdmin: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
});

export const insertFacePhotoSchema = createInsertSchema(facePhotos).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  photoUrl: z.string().min(1, "Photo is required"),
});

export const insertRememberItemSchema = createInsertSchema(rememberItems).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type AdminCreateUserData = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserData = z.infer<typeof adminUpdateUserSchema>;
export type FacePhoto = typeof facePhotos.$inferSelect;
export type InsertFacePhoto = z.infer<typeof insertFacePhotoSchema>;
export type RememberItem = typeof rememberItems.$inferSelect;
export type InsertRememberItem = z.infer<typeof insertRememberItemSchema>;
export type ContactData = z.infer<typeof contactSchema>;
