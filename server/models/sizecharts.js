const mongoose = require("mongoose");
const { Schema } = mongoose;

const sizeChartSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    name: { type: String, required: true },
    columns: [{ type: String, required: true }],
    rows: [{
        type: Map, // flexible key:value pairs for each row
        of: String, // values will be stored as strings (can hold numbers too)
    },],
}, { timestamps: true });

const sizeChartModel = mongoose.models.sizecharts || mongoose.model("sizecharts", sizeChartSchema);
module.exports = sizeChartModel;