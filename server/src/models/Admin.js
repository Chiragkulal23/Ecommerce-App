import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  tokenVersion: {
    type: Number,
    default: 0
  },
  resetToken: String,
  resetTokenExpires: Date
}, {
  timestamps: true
});

export default mongoose.model("Admin", AdminSchema);