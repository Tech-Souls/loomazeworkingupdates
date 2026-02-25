const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    orderID: { type: String, required: true, unique: true },
    userID: { type: Schema.Types.ObjectId, ref: "auth", default: null },
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    amount: { type: Number, required: true },
    
    isGuestPayment: { type: Boolean, default: false },

    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },

    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },

    // Refund Details
    refundAmount: { type: Number, default: 0 },
    refundReason: { type: String, default: null },

    // Online Transaction Details
    gateway: { type: String, default: null },
    transactionID: { type: String, default: null },
    transactionSS: { type: String, default: null },
}, { timestamps: true });

const paymentModel = mongoose.models.payments || mongoose.model('payments', paymentSchema);
module.exports = paymentModel;