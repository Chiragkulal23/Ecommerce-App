import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  transactionId: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending"
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"],
    default: "Pending"
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

export default mongoose.model("Order", OrderSchema);