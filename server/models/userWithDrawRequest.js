const mongoose = require("mongoose");

const userwithdrawSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  accountHolder: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "paid"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  }
});

const UserWithDrawReq = mongoose.model("UserWithDrawReq", userwithdrawSchema);

module.exports = UserWithDrawReq;
