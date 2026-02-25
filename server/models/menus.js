const mongoose = require("mongoose")
const { Schema } = mongoose

const menusSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    name: { type: String, required: true },
    links: [{
        label: { type: String, required: true },
        url: { type: String, required: true },
    }]
}, { timestamps: true })

menusSchema.index({ sellerID: 1, name: 1 }, { unique: true });

const menusModel = mongoose.models.menus || mongoose.model("menus", menusSchema)
module.exports = menusModel