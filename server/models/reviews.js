const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: "auth", required: true },
    productID: { type: String, required: true },
    productImageURL: { type: String, required: true },
    productTitle: { type: String, required: true },
    productSlug: { type: String, required: true },
    brandSlug: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: null },
}, { timestamps: true });

reviewSchema.index({ productID: 1, userID: 1 }, { unique: true });

const reviewModel = mongoose.models.reviews || mongoose.model("reviews", reviewSchema);
module.exports = reviewModel;