const mongoose = require("mongoose");
const { Schema } = mongoose;

const referralEarningSchema = new Schema({
    referrer: { id: { type: mongoose.Types.ObjectId, required: true, refPath: "referrer.type" }, type: { type: String, enu: ["users", "sellers"], required: true } },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "sellers", required: true },
    referral: { type: mongoose.Schema.Types.ObjectId, ref: "Referral", required: false },
    amount: { type: Number, required: true, default: 0 },
    type: { type: String, enum: ["signup", "monthly"], required: true, default: "signup" },
    month: { type: String, default: null },
    status: { type: String, enum: ["pending", "paid", "cancelled", "available"], default: "pending" },
    paidAt: { type: Date, default: null },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", default: null },
    meta: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const ReferralEarning = mongoose.models.referralEarning || mongoose.model("referralEarning", referralEarningSchema);
module.exports = ReferralEarning;