import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import adminAuth from "./routes/adminAuth.js";
import categories from "./routes/categories.js";
import products from "./routes/products.js";
import orders from "./routes/orders.js";
import payments from "./routes/payments.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initNotifications } from "./events/notifications.js";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:8080", "http://127.0.0.1:3000"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "StyleAura Admin Server is running",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/admin/auth", adminAuth);
app.use("/api/categories", categories);
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/payments", payments);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(error.errors).map(err => err.message)
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate key error"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);

    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
        credentials: true
      }
    });
    initNotifications(io);
    app.set("io", io);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 Client origin: ${process.env.CLIENT_ORIGIN}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
