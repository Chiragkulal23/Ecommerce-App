import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.sub);
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (admin.tokenVersion !== payload.tv) {
      return res.status(401).json({ message: "Token revoked" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export function optionalAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  
  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return next();
    }
    
    try {
      const admin = await Admin.findById(payload.sub);
      if (admin && admin.tokenVersion === payload.tv) {
        req.admin = admin;
      }
    } catch (error) {
      console.error("Optional auth error:", error);
    }
    
    next();
  });
}