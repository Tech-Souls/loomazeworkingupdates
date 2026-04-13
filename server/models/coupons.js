const mongoose = require("mongoose")
const { Schema } = mongoose

const couponsSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

const couponsModel = mongoose.models.coupons || mongoose.model("coupons", couponsSchema)

module.exports = couponsModel