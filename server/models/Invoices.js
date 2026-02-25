const mongoose = require("mongoose");

const invoicesSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "sellers", required: true },
    plan: { type: String, required: true},
    amount: { type: Number, required: true },
    receipt: { type: String, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "rejected"], default: "pending" },
    subscriptionStart: Date,
    subscriptionEnd: Date,
    type: { type: String, default: "manual", enum: ["manual", "extend", "upgrade"] }
}, { timestamps: true });

module.exports = mongoose.model("Invoices", invoicesSchema);