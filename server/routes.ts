import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  updateProfileSchema,
  adminCreateUserSchema,
  adminUpdateUserSchema,
  type User 
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Session middleware setup
function setupSession(app: Express) {
  const PgSession = connectPg(session);
  const sessionStore = new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    tableName: "sessions",
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }));
}

// Middleware to check if user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Middleware to check if user is admin
async function requireAdmin(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Authorization check failed" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupSession(app);

  // Register endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, confirmPassword } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Create user
      const user = await storage.createUser(email, password);
      
      // Send verification email (simulated for now)
      console.log(`Email verification token for ${email}: ${user.emailVerificationToken}`);
      
      res.status(201).json({ 
        message: "Registration successful. Please check your email for verification link.",
        userId: user.id 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Simple password check (in production, use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.isEmailVerified) {
        return res.status(401).json({ message: "Please verify your email before logging in" });
      }

      // Set session
      (req.session as any).userId = user.id;
      
      res.json({ 
        message: "Login successful",
        user: { id: user.id, email: user.email, isEmailVerified: user.isEmailVerified }
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user endpoint
  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser((req.session as any).userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Email verification endpoint
  app.get("/api/verify-email/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const user = await storage.verifyEmailToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
      
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Email verification failed" });
    }
  });

  // Update profile endpoint
  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = updateProfileSchema.parse(req.body);
      const userId = (req.session as any).userId;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      if (user.password !== currentPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const updates: Partial<User> = {};
      
      // Update email if changed
      if (email !== user.email) {
        // Check if new email is already taken
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
        
        updates.email = email;
        updates.isEmailVerified = false;
        
        // Generate new verification token
        const token = await storage.generateEmailVerificationToken(userId);
        console.log(`New email verification token for ${email}: ${token}`);
      }

      // Update password if provided
      if (newPassword) {
        await storage.updatePassword(userId, newPassword);
      }

      // Update user
      if (Object.keys(updates).length > 0) {
        await storage.updateUser(userId, updates);
      }

      res.json({ message: "Profile updated successfully" });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Profile update failed" });
    }
  });

  // Admin routes
  // Get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(user => ({
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })));
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // Create user (admin only)
  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const userData = adminCreateUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await storage.adminCreateUser(userData);
      res.status(201).json({
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Admin create user error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update user (admin only)
  app.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = adminUpdateUserSchema.parse(req.body);
      
      if (updates.email) {
        // Check if new email is already taken by another user
        const existingUser = await storage.getUserByEmail(updates.email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }

      const user = await storage.adminUpdateUser(userId, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Admin update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Delete user (admin only)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUserId = (req.session as any).userId;
      
      // Prevent admin from deleting themselves
      if (userId === currentUserId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      const success = await storage.adminDeleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Admin delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
