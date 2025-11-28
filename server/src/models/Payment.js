import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["Created", "Success", "Failed", "Refunded"],
    default: "Created"
  },
  paymentMethod: {
    type: String,
    enum: ["UPI", "Google Pay", "Credit Card", "Debit Card", "Net Banking"],
    required: true
  },
  paymentGateway: {
    type: String,
    trim: true
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Payment", PaymentSchema);