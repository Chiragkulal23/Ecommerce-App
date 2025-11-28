import { Router } from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Get all products with category population (PUBLIC - no auth required)
router.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 100 } = req.query;
    
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    // Transform products to match frontend format
    const transformedProducts = products.map(p => ({
      id: p._id.toString(),
      _id: p._id.toString(),
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      category: p.category,
      images: p.images || (p.imageUrl ? [p.imageUrl] : []),
      sizes: p.sizes || [],
      colors: p.colors || [],
      rating: p.rating || 0,
      reviews: p.reviews || [],
      features: p.features || [],
      stock: p.stock || 0,
      slug: p.slug,
      isActive: p.isActive,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));
    
    res.json({
      products: transformedProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single product (PUBLIC - no auth required)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Transform product to match frontend format
    const transformedProduct = {
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      category: product.category,
      images: product.images || (product.imageUrl ? [product.imageUrl] : []),
      sizes: product.sizes || [],
      colors: product.colors || [],
      rating: product.rating || 0,
      reviews: product.reviews || [],
      features: product.features || [],
      stock: product.stock || 0,
      slug: product.slug,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new product (ADMIN ONLY)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { category, name, description, price, imageUrl, images, stock, sizes, colors, originalPrice, features } = req.body;

    if (!category || !name || !description || !price) {
      return res.status(400).json({ 
        message: "Category, name, description, and price are required" 
      });
    }

    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      category,
      isActive: true
    });

    if (existingProduct) {
      return res.status(400).json({ 
        message: "Product with this name already exists in this category" 
      });
    }

    const productData = {
      category: category.trim(),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: stock !== undefined ? parseInt(stock) : 0,
      isActive: true
    };

    // Handle images - support both imageUrl (single) and images (array)
    if (images && Array.isArray(images) && images.length > 0) {
      productData.images = images;
    } else if (imageUrl) {
      productData.images = [imageUrl];
    } else {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (sizes && Array.isArray(sizes)) {
      productData.sizes = sizes;
    }
    if (colors && Array.isArray(colors)) {
      productData.colors = colors;
    }
    if (originalPrice) {
      productData.originalPrice = parseFloat(originalPrice);
    }
    if (features && Array.isArray(features)) {
      productData.features = features;
    }

    const product = await Product.create(productData);

    // Transform for response
    const transformedProduct = {
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      category: product.category,
      images: product.images || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      rating: product.rating || 0,
      reviews: product.reviews || [],
      features: product.features || [],
      stock: product.stock || 0,
      slug: product.slug,
      isActive: product.isActive
    };

    res.status(201).json({
      message: "Product created successfully",
      product: transformedProduct
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product already exists" });
    }
    console.error("Create product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update product (ADMIN ONLY)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { category, name, description, price, imageUrl, images, stock, sizes, colors, originalPrice, features, isActive } = req.body;

    if (!category || !name || !description || !price) {
      return res.status(400).json({ 
        message: "Category, name, description, and price are required" 
      });
    }

    // Check if another product with same name exists in same category
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      category,
      _id: { $ne: req.params.id },
      isActive: true
    });

    if (existingProduct) {
      return res.status(400).json({ 
        message: "Another product with this name already exists in this category" 
      });
    }

    const updateData = {
      category: category.trim(),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
    };

    if (stock !== undefined) {
      updateData.stock = parseInt(stock);
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Handle images
    if (images && Array.isArray(images) && images.length > 0) {
      updateData.images = images;
    } else if (imageUrl) {
      updateData.images = [imageUrl];
    }

    if (sizes && Array.isArray(sizes)) {
      updateData.sizes = sizes;
    }
    if (colors && Array.isArray(colors)) {
      updateData.colors = colors;
    }
    if (originalPrice !== undefined) {
      updateData.originalPrice = parseFloat(originalPrice);
    }
    if (features && Array.isArray(features)) {
      updateData.features = features;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Transform for response
    const transformedProduct = {
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      category: product.category,
      images: product.images || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      rating: product.rating || 0,
      reviews: product.reviews || [],
      features: product.features || [],
      stock: product.stock || 0,
      slug: product.slug,
      isActive: product.isActive
    };

    res.json({
      message: "Product updated successfully",
      product: transformedProduct
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product already exists" });
    }
    console.error("Update product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete product (soft delete)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ 
      message: "Product deleted successfully",
      product: { id: product._id, name: product.name }
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get products by category (PUBLIC - no auth required)
router.get("/category/:categoryName", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryName,
      isActive: true
    }).sort({ createdAt: -1 });
    
    // Transform products
    const transformedProducts = products.map(p => ({
      id: p._id.toString(),
      _id: p._id.toString(),
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      category: p.category,
      images: p.images || (p.imageUrl ? [p.imageUrl] : []),
      sizes: p.sizes || [],
      colors: p.colors || [],
      rating: p.rating || 0,
      reviews: p.reviews || [],
      features: p.features || [],
      stock: p.stock || 0,
      slug: p.slug,
      isActive: p.isActive
    }));
    
    res.json(transformedProducts);
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get product statistics (ADMIN ONLY)
router.get("/stats/count", requireAdmin, async (req, res) => {
  try {
    const productCount = await Product.countDocuments({ isActive: true });
    const lowStockCount = await Product.countDocuments({ 
      isActive: true, 
      stock: { $lt: 10 } 
    });
    const outOfStockCount = await Product.countDocuments({ 
      isActive: true, 
      stock: 0 
    });
    
    res.json({
      total: productCount,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount
    });
  } catch (error) {
    console.error("Product stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;