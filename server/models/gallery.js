const mongoose = require("mongoose")
const { Schema } = mongoose

const gallerySchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    imageURL: { type: String, default: null }
}, { timestamps: true })

const galleryModel = mongoose.models.gallery || mongoose.model("gallery", gallerySchema)

module.exports = galleryModel