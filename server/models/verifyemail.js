const mongoose = require("mongoose")
const { Schema } = mongoose

const verifyEmailSchema = new Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String },
}, { timestamps: true })

const verifyEmailModel = mongoose.models.verifyemail || mongoose.model("verifyemail", verifyEmailSchema)

module.exports = verifyEmailModel