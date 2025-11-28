import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import { requireAdmin } from "../middleware/auth.js";
import { sendResetEmail } from "../utils/email.js";

const router = Router();

// Admin registration (one-time setup)
router.post("/register", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ 
        message: "Admin already exists. Registration is only allowed once." 
      });
    }

    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: "Email, password, and name are required" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const admin = await Admin.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim()
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    const admin = await Admin.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        sub: admin._id, 
        tv: admin.tokenVersion 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (!admin) {
      // Return success even if email doesn't exist for security
      return res.json({ 
        message: "If the email exists, a reset link has been sent" 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    admin.resetToken = resetToken;
    admin.resetTokenExpires = resetTokenExpires;
    await admin.save();

    // Send reset email
    await sendResetEmail({
      to: admin.email,
      token: resetToken,
      origin: process.env.CLIENT_ORIGIN
    });

    res.json({ 
      message: "If the email exists, a reset link has been sent" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        message: "Token and password are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!admin) {
      return res.status(400).json({ 
        message: "Invalid or expired reset token" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    admin.password = hashedPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpires = undefined;
    admin.tokenVersion += 1; // Invalidate all existing tokens
    await admin.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Change password (authenticated)
router.post("/change-password", requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters long" 
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword, 
      req.admin.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        message: "Current password is incorrect" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    req.admin.password = hashedPassword;
    req.admin.tokenVersion += 1; // Invalidate all existing tokens
    await req.admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current admin profile
router.get("/profile", requireAdmin, async (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
      createdAt: req.admin.createdAt
    }
  });
});

// Update admin profile
router.put("/profile", requireAdmin, async (req, res) => {
  try {
    const { email, name } = req.body;

    if (email && email !== req.admin.email) {
      const existingAdmin = await Admin.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: req.admin._id }
      });

      if (existingAdmin) {
        return res.status(400).json({ 
          message: "Email already in use" 
        });
      }

      req.admin.email = email.toLowerCase().trim();
    }

    if (name) {
      req.admin.name = name.trim();
    }

    await req.admin.save();

    res.json({
      message: "Profile updated successfully",
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout
router.post("/logout", requireAdmin, async (req, res) => {
  try {
    req.admin.tokenVersion += 1;
    await req.admin.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;