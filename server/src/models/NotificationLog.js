import mongoose from "mongoose";

const NotificationLogSchema = new mongoose.Schema({
  type: { type: String, required: true },
  status: { type: String, enum: ["queued", "delivered", "failed"], default: "queued" },
  targetRole: { type: String, default: "admin" },
  payload: { type: Object, required: true },
  attemptCount: { type: Number, default: 0 },
  lastAttemptAt: { type: Date },
  deliveredAt: { type: Date },
  error: { type: String },
}, { timestamps: true });

export default mongoose.model("NotificationLog", NotificationLogSchema);

