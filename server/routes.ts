import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  updateProfileSchema,
  adminCreateUserSchema,
  adminUpdateUserSchema,
  insertFacePhotoSchema,
  insertRememberItemSchema,
  type User,
  type FacePhoto,
  type RememberItem
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long")
});

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp-auth.mailprotect.be",
  port: 587,
  secure: false,
  auth: {
    user: "help@heymemory.app",
    pass: "V3rg3t3n#v#"
  }
});

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

// Middleware to check if user is authenticated and email verified
async function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: "Email verification required" });
    }
    
    next();
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Authentication check failed" });
  }
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
      
      // Generate verification token
      const verificationToken = await storage.generateEmailVerificationToken(user.id);
      
      // Send verification email
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/verify-email/${verificationToken}`;
      
      const mailOptions = {
        from: '"heyMemory Support" <help@heymemory.app>',
        to: email,
        subject: 'Verify Your heyMemory Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; font-size: 28px; margin: 0;">heyMemory</h1>
              <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Memory Support Made Simple</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0;">Welcome to heyMemory!</h2>
              <p style="color: #475569; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Thank you for joining our community. To complete your registration and start using heyMemory, 
                please verify your email address by clicking the button below.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; 
                          border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; margin: 25px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="text-align: center; color: #94a3b8; font-size: 14px;">
              <p>This verification link will expire in 24 hours.</p>
              <p>If you didn't create this account, please ignore this email.</p>
              <p style="margin-top: 20px;">
                Need help? Contact us at <a href="mailto:help@heymemory.app" style="color: #2563eb;">help@heymemory.app</a>
              </p>
            </div>
          </div>
        `
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}:`, {
          messageId: info.messageId,
          response: info.response,
          accepted: info.accepted,
          rejected: info.rejected,
          pending: info.pending
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        console.error('Email error details:', {
          code: emailError.code,
          response: emailError.response,
          responseCode: emailError.responseCode,
          command: emailError.command
        });
        // Continue with registration even if email fails
      }
      
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
        pendingEmail: user.pendingEmail,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country
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
        return res.status(400).send(`
          <html>
            <head>
              <title>Email Verification - heyMemory</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
                .container { background: #f8fafc; padding: 40px; border-radius: 10px; }
                .error { color: #dc2626; }
                .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>heyMemory</h1>
                <h2 class="error">Verification Failed</h2>
                <p>This verification link is invalid or has expired.</p>
                <p>Please try registering again or contact support if you continue to have issues.</p>
                <a href="/" class="button">Return to Homepage</a>
              </div>
            </body>
          </html>
        `);
      }
      
      res.send(`
        <html>
          <head>
            <title>Email Verification Success - heyMemory</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
              .container { background: #f0fdf4; padding: 40px; border-radius: 10px; border: 2px solid #16a34a; }
              .success { color: #16a34a; }
              .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>heyMemory</h1>
              <h2 class="success">✓ Email Verified Successfully!</h2>
              <p>Your email has been verified. You can now log in to your heyMemory account.</p>
              <a href="/login" class="button">Go to Login</a>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).send(`
        <html>
          <head>
            <title>Email Verification Error - heyMemory</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
              .container { background: #fef2f2; padding: 40px; border-radius: 10px; border: 2px solid #dc2626; }
              .error { color: #dc2626; }
              .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>heyMemory</h1>
              <h2 class="error">Verification Error</h2>
              <p>There was an error verifying your email. Please try again or contact support.</p>
              <a href="/" class="button">Return to Homepage</a>
            </div>
          </body>
        </html>
      `);
    }
  });

  // Check verification status endpoint
  app.post("/api/check-verification-status", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ exists: false, verified: false });
      }
      
      res.json({ 
        exists: true, 
        verified: user.isEmailVerified,
        userId: user.id
      });
    } catch (error) {
      console.error("Check verification status error:", error);
      res.status(500).json({ message: "Failed to check verification status" });
    }
  });

  // Resend verification email endpoint with cooldown
  app.post("/api/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email is already verified" });
      }
      
      // Check for cooldown (stored in user's lastEmailSent field)
      const now = new Date();
      const cooldownMinutes = 1; // 1 minute cooldown
      
      if (user.lastEmailSent) {
        const lastSent = new Date(user.lastEmailSent);
        const timeDiff = (now.getTime() - lastSent.getTime()) / (1000 * 60);
        
        if (timeDiff < cooldownMinutes) {
          const remainingSeconds = Math.ceil((cooldownMinutes * 60) - (timeDiff * 60));
          return res.status(429).json({ 
            message: "Please wait before requesting another email",
            remainingSeconds
          });
        }
      }
      
      // Update last email sent time
      await storage.updateUser(user.id, { lastEmailSent: now });
      
      // Generate new verification token
      const verificationToken = await storage.generateEmailVerificationToken(user.id);
      
      // Send verification email
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/verify-email/${verificationToken}`;
      
      const mailOptions = {
        from: '"heyMemory Support" <help@heymemory.app>',
        to: email,
        subject: 'Verify Your heyMemory Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; font-size: 28px; margin: 0;">heyMemory</h1>
              <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Memory Support Made Simple</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0;">Email Verification</h2>
              <p style="color: #475569; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Please verify your email address to complete your heyMemory registration by clicking the button below.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; 
                          border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; margin: 25px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="text-align: center; color: #94a3b8; font-size: 14px;">
              <p>This verification link will expire in 24 hours.</p>
              <p>Need help? Contact us at <a href="mailto:help@heymemory.app" style="color: #2563eb;">help@heymemory.app</a></p>
            </div>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email resent to ${email}`);
        res.json({ message: "Verification email sent successfully" });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        res.status(500).json({ message: "Failed to send verification email" });
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ message: "Failed to resend verification email" });
    }
  });

  // Cancel registration endpoint
  app.post("/api/cancel-registration", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Cannot cancel verified account" });
      }
      
      // Delete the unverified user
      await storage.deleteUser(user.id);
      
      console.log(`Cancelled registration for ${email}`);
      res.json({ message: "Registration cancelled successfully" });
    } catch (error) {
      console.error("Cancel registration error:", error);
      res.status(500).json({ message: "Failed to cancel registration" });
    }
  });

  // Email change routes
  app.post("/api/initiate-email-change", requireAuth, async (req: any, res) => {
    const { newEmail } = req.body;
    const userId = (req.session as any).userId;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required" });
    }

    try {
      const token = await storage.initiateEmailChange(userId, newEmail);
      
      // Send email change verification email
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/confirm-email-change/${token}`;
      
      const mailOptions = {
        from: 'heyMemory <help@heymemory.app>',
        to: newEmail,
        subject: 'Verify Your New Email Address - heyMemory',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; font-size: 28px; margin: 0;">heyMemory</h1>
              <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">Memory Support Made Simple</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
              <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Verify Your New Email Address</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                You requested to change your email address. To complete this change, please click the button below to verify your new email address.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #1f2937; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Verify New Email Address
                </a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; margin: 25px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="text-align: center; color: #94a3b8; font-size: 14px;">
              <p>This verification link will expire in 24 hours.</p>
              <p>If you didn't request this change, please ignore this email.</p>
              <p>Need help? Contact us at <a href="mailto:help@heymemory.app" style="color: #2563eb;">help@heymemory.app</a></p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: "Email change verification sent to new address" });
    } catch (error: any) {
      console.error("Email change initiation error:", error);
      res.status(400).json({ message: error.message || "Failed to initiate email change" });
    }
  });

  app.get("/api/confirm-email-change/:token", async (req, res) => {
    const { token } = req.params;

    try {
      const user = await storage.confirmEmailChange(token);
      if (!user) {
        return res.redirect('/?error=invalid-token');
      }

      res.redirect('/?success=email-changed');
    } catch (error) {
      console.error("Email change confirmation error:", error);
      res.redirect('/?error=email-change-failed');
    }
  });

  app.post("/api/cancel-email-change", requireAuth, async (req: any, res) => {
    const userId = (req.session as any).userId;

    try {
      const success = await storage.cancelEmailChange(userId);
      if (!success) {
        return res.status(400).json({ message: "No pending email change found" });
      }

      res.json({ message: "Email change cancelled successfully" });
    } catch (error) {
      console.error("Email change cancellation error:", error);
      res.status(500).json({ message: "Failed to cancel email change" });
    }
  });

  app.post("/api/resend-email-change-verification", requireAuth, async (req: any, res) => {
    const userId = (req.session as any).userId;

    try {
      const user = await storage.getUser(userId);
      if (!user || !user.pendingEmail) {
        return res.status(400).json({ message: "No pending email change found" });
      }

      // Check cooldown
      const now = new Date();
      const cooldownMinutes = 1;
      
      if (user.lastEmailSent) {
        const lastSent = new Date(user.lastEmailSent);
        const timeDiff = (now.getTime() - lastSent.getTime()) / (1000 * 60);
        
        if (timeDiff < cooldownMinutes) {
          const remainingSeconds = Math.ceil((cooldownMinutes * 60) - (timeDiff * 60));
          return res.status(429).json({ 
            message: "Please wait before requesting another email",
            remainingSeconds
          });
        }
      }

      const token = await storage.resendEmailChangeVerification(userId);
      
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/confirm-email-change/${token}`;
      
      const mailOptions = {
        from: 'heyMemory <help@heymemory.app>',
        to: user.pendingEmail,
        subject: 'Verify Your New Email Address - heyMemory',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; font-size: 28px; margin: 0;">heyMemory</h1>
              <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">Memory Support Made Simple</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
              <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Verify Your New Email Address</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                You requested to change your email address. To complete this change, please click the button below to verify your new email address.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #1f2937; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Verify New Email Address
                </a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; margin: 25px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="text-align: center; color: #94a3b8; font-size: 14px;">
              <p>This verification link will expire in 24 hours.</p>
              <p>If you didn't request this change, please ignore this email.</p>
              <p>Need help? Contact us at <a href="mailto:help@heymemory.app" style="color: #2563eb;">help@heymemory.app</a></p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: "Email change verification sent" });
    } catch (error: any) {
      console.error("Email change resend error:", error);
      res.status(400).json({ message: error.message || "Failed to resend verification" });
    }
  });

  // Update profile endpoint
  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      const { 
        email, 
        firstName, 
        lastName, 
        dateOfBirth, 
        address, 
        city, 
        state, 
        zipCode, 
        country, 
        currentPassword, 
        newPassword 
      } = updateProfileSchema.parse(req.body);
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
      
      // Handle email change through verification process
      if (email !== user.email) {
        // Initiate email change verification process instead of direct update
        try {
          const token = await storage.initiateEmailChange(userId, email);
          
          const verificationUrl = `${req.protocol}://${req.get('host')}/api/confirm-email-change/${token}`;
          
          const mailOptions = {
            from: 'heyMemory <help@heymemory.app>',
            to: email,
            subject: 'Verify Your New Email Address - heyMemory',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #1f2937; font-size: 28px; margin: 0;">heyMemory</h1>
                  <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">Memory Support Made Simple</p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
                  <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Verify Your New Email Address</h2>
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                    You requested to change your email address. To complete this change, please click the button below to verify your new email address.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background-color: #1f2937; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                      Verify New Email Address
                    </a>
                  </div>
                  
                  <p style="color: #64748b; font-size: 14px; margin: 25px 0 0 0;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
                  </p>
                </div>
                
                <div style="text-align: center; color: #94a3b8; font-size: 14px;">
                  <p>This verification link will expire in 24 hours.</p>
                  <p>If you didn't request this change, please ignore this email.</p>
                  <p>Need help? Contact us at <a href="mailto:help@heymemory.app" style="color: #2563eb;">help@heymemory.app</a></p>
                </div>
              </div>
            `
          };

          await transporter.sendMail(mailOptions);
        } catch (emailChangeError) {
          console.error("Email change error:", emailChangeError);
          return res.status(400).json({ message: "Failed to initiate email change" });
        }
      }

      // Update profile fields
      updates.firstName = firstName;
      updates.lastName = lastName;
      updates.address = address;
      updates.city = city;
      updates.state = state;
      updates.zipCode = zipCode;
      updates.country = country;
      
      // Handle date of birth conversion
      if (dateOfBirth) {
        updates.dateOfBirth = new Date(dateOfBirth);
      }

      // Update password if provided
      if (newPassword) {
        await storage.updatePassword(userId, newPassword);
      }

      // Update user
      await storage.updateUser(userId, updates);

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
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        caregiverPhoneNumber: user.caregiverPhoneNumber,
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

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = contactSchema.parse(req.body);
      
      // Create email content
      const mailOptions = {
        from: "help@heymemory.app",
        to: "help@heymemory.app",
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>This message was sent through the heyMemory contact form.</small></p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);
      
      res.json({ message: "Message sent successfully" });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Face Photos API routes
  app.get("/api/face-photos", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const photos = await storage.getFacePhotos(userId);
      res.json(photos);
    } catch (error) {
      console.error("Get face photos error:", error);
      res.status(500).json({ message: "Failed to get face photos" });
    }
  });

  app.post("/api/face-photos", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const validatedData = insertFacePhotoSchema.parse(req.body);
      const photo = await storage.createFacePhoto(userId, validatedData);
      res.json(photo);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Create face photo error:", error);
      res.status(500).json({ message: "Failed to create face photo" });
    }
  });

  // Update face photo (PUT)
  app.put("/api/face-photos/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const photoId = parseInt(req.params.id);
      const validatedData = insertFacePhotoSchema.partial().parse(req.body);
      const photo = await storage.updateFacePhoto(photoId, userId, validatedData);
      
      if (!photo) {
        return res.status(404).json({ message: "Face photo not found" });
      }
      
      res.json(photo);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Update face photo error:", error);
      res.status(500).json({ message: "Failed to update face photo" });
    }
  });

  // Update face photo (PATCH) - same as PUT for compatibility
  app.patch("/api/face-photos/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const photoId = parseInt(req.params.id);
      const validatedData = insertFacePhotoSchema.partial().parse(req.body);
      const photo = await storage.updateFacePhoto(photoId, userId, validatedData);
      
      if (!photo) {
        return res.status(404).json({ message: "Face photo not found" });
      }
      
      res.json(photo);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Update face photo error:", error);
      res.status(500).json({ message: "Failed to update face photo" });
    }
  });

  app.delete("/api/face-photos/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const photoId = parseInt(req.params.id);
      const success = await storage.deleteFacePhoto(photoId, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Face photo not found" });
      }
      
      res.json({ message: "Face photo deleted successfully" });
    } catch (error) {
      console.error("Delete face photo error:", error);
      res.status(500).json({ message: "Failed to delete face photo" });
    }
  });

  // Remember Items API routes
  app.get("/api/remember-items", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const items = await storage.getRememberItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Get remember items error:", error);
      res.status(500).json({ message: "Failed to get remember items" });
    }
  });

  app.post("/api/remember-items", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const validatedData = insertRememberItemSchema.parse(req.body);
      const item = await storage.createRememberItem(userId, validatedData);
      res.json(item);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Create remember item error:", error);
      res.status(500).json({ message: "Failed to create remember item" });
    }
  });

  app.put("/api/remember-items/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const itemId = parseInt(req.params.id);
      const validatedData = insertRememberItemSchema.partial().parse(req.body);
      const item = await storage.updateRememberItem(itemId, userId, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: "Remember item not found" });
      }
      
      res.json(item);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Update remember item error:", error);
      res.status(500).json({ message: "Failed to update remember item" });
    }
  });

  app.patch("/api/remember-items/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const itemId = parseInt(req.params.id);
      const validatedData = insertRememberItemSchema.partial().parse(req.body);
      const item = await storage.updateRememberItem(itemId, userId, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: "Remember item not found" });
      }
      
      res.json(item);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      console.error("Update remember item error:", error);
      res.status(500).json({ message: "Failed to update remember item" });
    }
  });

  app.delete("/api/remember-items/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const itemId = parseInt(req.params.id);
      const success = await storage.deleteRememberItem(itemId, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Remember item not found" });
      }
      
      res.json({ message: "Remember item deleted successfully" });
    } catch (error) {
      console.error("Delete remember item error:", error);
      res.status(500).json({ message: "Failed to delete remember item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
