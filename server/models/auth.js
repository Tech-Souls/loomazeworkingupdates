const mongoose = require('mongoose');
const { Schema } = mongoose;

const authSchema = new Schema({
    userID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'customer' },

    brandName: { type: String, required: true },
    brandSlug: { type: String, required: true },

    province: { type: String, default: null },
    city: { type: String, default: null },
    place: { type: String, default: "home" },
    address: { type: String, default: null },
    phoneNumber: { type: String, default: null },

    avatar: { type: String, default: null },
    dob: { type: Date, default: null },
    gender: { type: String, enum: ['male', 'female', 'other'], default: null },

    cart: [{
        productID: { type: String, required: true },
        variantID: { type: String, default: null },
        brandSlug: { type: String, required: true },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        mainImageURL: { type: String, required: true },
        variantImageURL: { type: String, default: null },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        comparedPrice: { type: Number, required: true },
        stock: { type: Number, default: null },
        selectedOptions: [{ // Structured variant selection
            optionName: { type: String }, // e.g., "Size"
            optionValue: { type: String }  // e.g., "Large"
        }],
    }],

    favourites: [{ type: Schema.Types.ObjectId, ref: 'products' }],
}, { timestamps: true });

authSchema.index({ email: 1, brandName: 1, brandSlug: 1 }, { unique: true });
authSchema.index({ username: 1, brandName: 1, brandSlug: 1 }, { unique: true });

const authModel = mongoose.models.auth || mongoose.model('auth', authSchema);
module.exports = authModel;