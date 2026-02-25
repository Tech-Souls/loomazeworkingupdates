const mongoose = require("mongoose")
const { Schema } = mongoose

const pagesSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    title: { type: String, required: true },
    content: { type: String },
    visibility: { type: Boolean, required: true },
    slug: { type: String, required: true },
}, { timestamps: true })

const pagesModel = mongoose.models.pages || mongoose.model("pages", pagesSchema)

module.exports = pagesModel