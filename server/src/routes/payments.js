import { Router } from "express";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import CustomerOrder from "../models/CustomerOrder.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { notifyPayment } from "../events/notifications.js";

const router = Router();

// Create Razorpay order (customer checkout)
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).send("Error creating order");
  }
});

// Verify payment and persist customer order
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const newOrder = await CustomerOrder.create({
        user: orderData.user,
        items: orderData.items,
        payment: {
          transactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount: orderData.amount,
          status: "Success",
          method: "Razorpay",
        },
        status: "Pending",
      });

      // Notify admins
      try {
        await notifyPayment({
          payment: {
            transactionId: razorpay_payment_id,
            status: "Success",
            amount: orderData.amount
          },
          order: {
            id: newOrder._id
          }
        });
      } catch (err) {
        console.error("Notification error:", err);
      }

      res.json({ status: "success", orderId: newOrder._id });
    } else {
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).send("Error verifying payment");
  }
});

// Manual order (Scan & Pay) for customer checkout
router.post("/manual-order", async (req, res) => {
  try {
    const { orderData, transactionId } = req.body;
    const newOrder = await CustomerOrder.create({
      user: orderData.user,
      items: orderData.items,
      payment: {
        amount: orderData.amount,
        status: "Pending",
        method: "UPI_Manual",
        reference: transactionId,
        transactionId: transactionId, // Also save as transactionId for consistency
      },
      status: "Pending",
    });

    // Notify admins
    try {
      await notifyPayment({
        payment: {
          transactionId: transactionId,
          status: "Pending",
          amount: orderData.amount
        },
        order: {
          id: newOrder._id
        }
      });
    } catch (err) {
      console.error("Notification error:", err);
    }

    res.json({ status: "success", orderId: newOrder._id });
  } catch (error) {
    console.error("Manual order error:", error);
    res.status(500).send("Error creating manual order");
  }
});

// Payment webhook for UPI/Google Pay integration
router.post("/webhook/upi", async (req, res) => {
  try {
    const {
      orderId,
      transactionId,
      status,
      amount,
      paymentMethod = "UPI",
      paymentGateway,
      gatewayResponse
    } = req.body;

    if (!orderId || !transactionId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID, transaction ID, and status are required"
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if payment already processed
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already processed"
      });
    }

    // Create payment record
    const payment = await Payment.create({
      order: orderId,
      transactionId: transactionId.trim(),
      amount: amount || order.totalAmount,
      status: status.toLowerCase() === "success" ? "Success" : "Failed",
      paymentMethod,
      paymentGateway,
      gatewayResponse
    });

    // Update order status based on payment result
    if (payment.status === "Success") {
      order.paymentStatus = "Success";
      order.transactionId = transactionId;
    } else {
      order.paymentStatus = "Failed";

      // Restore product stock if payment failed
      const product = await Product.findById(order.product);
      if (product) {
        product.stock += order.quantity;
        await product.save();
      }
    }

    await order.save();

    const responsePayload = {
      success: true,
      message: "Payment processed successfully",
      payment: {
        id: payment._id,
        status: payment.status,
        transactionId: payment.transactionId
      },
      order: {
        id: order._id,
        paymentStatus: order.paymentStatus
      }
    };

    try {
      await notifyPayment({
        payment: responsePayload.payment,
        order: responsePayload.order,
      });
    } catch (emitErr) {
      console.error("Notify payment error:", emitErr);
    }

    res.json(responsePayload);

  } catch (error) {
    console.error("Payment webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get payment details
router.get("/:transactionId", async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId
    }).populate('order');

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get payments by order
router.get("/order/:orderId", async (req, res) => {
  try {
    const payments = await Payment.find({
      order: req.params.orderId
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error("Get payments by order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Refund payment
router.post("/:transactionId/refund", async (req, res) => {
  try {
    const { refundAmount, refundReason } = req.body;

    const payment = await Payment.findOne({
      transactionId: req.params.transactionId
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "Success") {
      return res.status(400).json({
        message: "Only successful payments can be refunded"
      });
    }

    payment.status = "Refunded";
    payment.refundAmount = refundAmount || payment.amount;
    payment.refundReason = refundReason;

    await payment.save();

    // Update order status
    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = "Refunded";
      await order.save();
    }

    res.json({
      message: "Refund processed successfully",
      payment
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
