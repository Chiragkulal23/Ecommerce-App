const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Order = require('../models/Order');

router.get('/', auth, (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.status(200).json({ message: 'Welcome to the admin page' });
});

router.get('/profile', auth, (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ admin: { id: req.userId, role: req.userRole, email: 'admin@styleaura.com' } });
});

// Get all orders
router.get('/orders', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { status, paymentStatus, transactionId } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData['payment.status'] = paymentStatus;
    if (transactionId) updateData['payment.transactionId'] = transactionId;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent orders
router.get('/orders/recent/:limit', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const limit = parseInt(req.params.limit) || 5;
    const orders = await Order.find().sort({ createdAt: -1 }).limit(limit);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order stats
router.get('/orders/stats/summary', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    // Calculate total revenue
    const orders = await Order.find({ 'payment.status': 'Success' });
    const totalRevenue = orders.reduce((acc, order) => acc + (order.payment.amount || 0), 0);

    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
