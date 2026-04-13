const mongoose = require('mongoose');
const { Schema } = mongoose;

const referralSchema = new Schema({
    referrer: { id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "referrer.type" }, type: { type: String, enum: ["users", "sellers"], required: true } },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'sellers', required: true },
    referrerCode: String,
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    joinedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Referral', referralSchema)
