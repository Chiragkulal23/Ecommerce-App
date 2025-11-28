const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;
        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData // User and Items data passed from frontend
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is successful, save order to DB
            const newOrder = new Order({
                user: orderData.user,
                items: orderData.items,
                payment: {
                    transactionId: razorpay_payment_id, // Using payment ID as transaction ID
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                    amount: orderData.amount,
                    status: 'Success',
                },
                status: 'Pending',
            });

            await newOrder.save();

            res.json({ status: 'success', orderId: newOrder._id });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying payment');
    }
});

// Manual Order (Scan & Pay)
router.post('/manual-order', async (req, res) => {
    try {
        const { orderData, transactionId } = req.body;

        const newOrder = new Order({
            user: orderData.user,
            items: orderData.items,
            payment: {
                amount: orderData.amount,
                status: 'Pending', // Manual payments need admin verification
                method: 'UPI_Manual',
                reference: transactionId,
            },
            status: 'Pending',
        });

        await newOrder.save();

        res.json({ status: 'success', orderId: newOrder._id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating manual order');
    }
});

module.exports = router;
