const mongoose = require('mongoose');
const { Schema } = mongoose;

const storeSubscriptionSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    image: { type: String },
    plan: { type: String, required: true },
    startDate: { type: Date, required: true, default: null },
    endDate: { type: Date, required: true, default: null },
    amount: { type: Number, required: true },

    paymentStatus: { type: String, enum: ["pending", "rejected", "paid"], default: 'pending' },
    subscriptionStatus: { type: String, enum: ["paid", "pending"], default: 'pending' },
    type: { type: String, default: 'manual' },
}, { timestamps: true });

const storeSubscriptionModel = mongoose.models.storesubscription || mongoose.model('storesubscription', storeSubscriptionSchema);
module.exports = storeSubscriptionModel;