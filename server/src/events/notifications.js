import jwt from "jsonwebtoken";
import NotificationLog from "../models/NotificationLog.js";

let ioRef = null;

export function initNotifications(io) {
  ioRef = io;

  const origins = process.env.CLIENT_ORIGIN?.split(",") || ["*"];

  io.engine.on("connection_error", (err) => {
    console.error("Socket engine connection error:", err.message);
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Auth token required"));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload || !payload.sub) return next(new Error("Invalid token"));
      socket.data.adminId = payload.sub;
      socket.join("admins");
      next();
    } catch (e) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("notification:ack", async ({ logId }) => {
      if (!logId) return;
      try {
        await NotificationLog.findByIdAndUpdate(logId, {
          status: "delivered",
          deliveredAt: new Date(),
        });
      } catch (err) {
        console.error("Ack update error:", err);
      }
    });
  });
}

export async function notifyPayment({ payment, order }) {
  if (!ioRef) return;

  const log = await NotificationLog.create({
    type: "payment",
    payload: { payment, order },
    status: "queued",
    attemptCount: 0,
    lastAttemptAt: new Date(),
  });

  const emit = () => {
    try {
      ioRef.to("admins").emit("payment:notification", {
        logId: log._id.toString(),
        payment,
        order,
      });
    } catch (err) {
      console.error("Emit error:", err);
    }
  };

  // Immediate try
  emit();

  // Retry logic (exponential backoff)
  const retries = [2_000, 5_000, 10_000];
  for (const delay of retries) {
    setTimeout(async () => {
      try {
        const fresh = await NotificationLog.findById(log._id);
        if (!fresh || fresh.status === "delivered") return;
        await NotificationLog.findByIdAndUpdate(log._id, {
          $inc: { attemptCount: 1 },
          lastAttemptAt: new Date(),
        });
        emit();
      } catch (err) {
        console.error("Retry error:", err);
      }
    }, delay);
  }
}

