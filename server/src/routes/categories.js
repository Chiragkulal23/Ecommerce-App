import { Router } from "express";
import Category from "../models/Category.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Get all categories
router.get("/", requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single category
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new category
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({ 
        message: "Name and image URL are required" 
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: "Category with this name already exists" 
      });
    }

    const category = await Category.create({
      name: name.trim(),
      imageUrl
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    console.error("Create category error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update category
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({ 
        message: "Name and image URL are required" 
      });
    }

    // Check if another category with the same name exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id }
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: "Another category with this name already exists" 
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), imageUrl },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    console.error("Update category error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete category
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ 
      message: "Category deleted successfully",
      category: { id: category._id, name: category.name }
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get categories with product count
router.get("/stats/count", requireAdmin, async (req, res) => {
  try {
    const categoryCount = await Category.countDocuments();
    res.json({ count: categoryCount });
  } catch (error) {
    console.error("Category count error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;