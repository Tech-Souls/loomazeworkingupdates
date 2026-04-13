const mongoose = require("mongoose");

const withdrawRequestSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sellers",
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

const withDrawReq = mongoose.model("WithDrawReq", withdrawRequestSchema);

module.exports = withDrawReq;
