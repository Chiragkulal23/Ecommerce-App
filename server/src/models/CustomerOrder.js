import mongoose from "mongoose";

const CustomerOrderSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      houseNo: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    email: { type: String },
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    }
  ],
  payment: {
    transactionId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" },
    method: { type: String, enum: ["Razorpay", "UPI_Manual"], default: "Razorpay" },
    reference: { type: String },
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("CustomerOrder", CustomerOrderSchema);

