import { Router } from "express";
import Order from "../models/Order.js";
import CustomerOrder from "../models/CustomerOrder.js";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Get all customer orders (ADMIN ONLY)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 50, search } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { "user.name": { $regex: search, $options: 'i' } },
        { "user.phone": { $regex: search, $options: 'i' } },
        { "payment.transactionId": { $regex: search, $options: 'i' } },
        { "payment.reference": { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await CustomerOrder.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await CustomerOrder.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single order (ADMIN ONLY)
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new order (for payment integration)
router.post("/", async (req, res) => {
  try {
    const { 
      userName, 
      phoneNumber, 
      address, 
      productId, 
      price, 
      quantity = 1 
    } = req.body;

    if (!userName || !phoneNumber || !address || !productId || !price) {
      return res.status(400).json({ 
        message: "All required fields must be provided" 
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Invalid product" });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: "Insufficient stock available" 
      });
    }

    const totalAmount = price * quantity;

    const order = await Order.create({
      userName: userName.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      product: productId,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      totalAmount,
      paymentStatus: "Pending",
      orderStatus: "Pending"
    });

    // Update product stock
    product.stock -= quantity;
    await product.save();

    const populatedOrder = await Order.findById(order._id).populate('product');

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update order status (ADMIN ONLY)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ 
        message: "Valid order status is required" 
      });
    }

    const order = await CustomerOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update payment status (ADMIN ONLY)
router.put("/:id/payment-status", requireAdmin, async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;

    if (!paymentStatus || !["Pending", "Success", "Failed"].includes(paymentStatus)) {
      return res.status(400).json({ 
        message: "Valid payment status is required" 
      });
    }

    const order = await CustomerOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.payment.status = paymentStatus;
    if (transactionId) {
      order.payment.transactionId = transactionId.trim();
    }

    await order.save();

    res.json({
      message: "Payment status updated successfully",
      order
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get order statistics (ADMIN ONLY)
router.get("/stats/summary", requireAdmin, async (req, res) => {
  try {
    const totalOrders = await CustomerOrder.countDocuments();
    const pendingOrders = await CustomerOrder.countDocuments({ status: "Pending" });
    const shippedOrders = await CustomerOrder.countDocuments({ status: "Shipped" });
    const deliveredOrders = await CustomerOrder.countDocuments({ status: "Delivered" });
    
    const totalRevenue = await CustomerOrder.aggregate([
      { $match: { "payment.status": "Success" } },
      { $group: { _id: null, total: { $sum: "$payment.amount" } } }
    ]);
    
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue: revenue
    });
  } catch (error) {
    console.error("Order stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get recent orders (ADMIN ONLY)
router.get("/recent/:limit", requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const orders = await CustomerOrder.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(orders);
  } catch (error) {
    console.error("Get recent orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;