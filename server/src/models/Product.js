import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  category: {
    type: String, // Changed to String to match frontend for now
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number
  },
  images: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  colors: [{
    name: String,
    value: String
  }],
  features: [{
    type: String
  }],
  reviews: [{
    author: String,
    rating: Number,
    date: Date,
    comment: String,
    verified: Boolean
  }],
  rating: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug before saving
ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
  next();
});

export default mongoose.model("Product", ProductSchema);