const mongoose = require("mongoose")
const { Schema } = mongoose

const faqsSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
}, { timestamps: true })

const faqsModel = mongoose.models.faqs || mongoose.model("faqs", faqsSchema)

module.exports = faqsModel