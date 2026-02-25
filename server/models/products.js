const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    productID: { type: String, required: true, unique: true },
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    brandSlug: { type: String, required: true, default: null },

    // Basic Info
    title: { type: String, required: true },
    description: { type: String, default: null },
    category: { type: String, default: null, lowercase: true },
    subcategory: { type: String, default: null },
    tags: { type: [String] },
    sku: { type: String },

    // Pricing & Stock
    price: { type: Number, required: true },
    comparedPrice: { type: Number, default: null },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },

    // Variants
    options: [{
        name: { type: String, required: true },   // e.g. "Size"
        values: [String] // e.g. ["Small", "Meidum", "Large"]
    }],

    // All individual combinations of the variants
    variants: [{
        id: { type: String },
        optionValues: [String], // e.g. ["Small", "Red"]
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        imageURL: { type: String },
    }],

    sizeChart: { type: Schema.Types.ObjectId, ref: "sizecharts", default: null },

    // Product Weight
    weight: { type: Number, default: 0 },
    weightUnit: { type: String, enum: ["g", "kg", "lb"], default: "kg" },

    // Images
    mainImageURL: { type: String, required: true },

    // Ratings & Reviews
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // Visibility & Status
    onSale: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    taxable: { type: Boolean, default: false },
    boughtTogether: [{ type: Schema.Types.ObjectId, ref: "products" }],
    paymentModes: { type: [String] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    // SEO & Slug
    slug: { type: String, required: true, unique: true },
    isDemo: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ title: "text", description: "text", tags: "text", });

const productModel = mongoose.models.products || mongoose.model("products", productSchema);
module.exports = productModel;