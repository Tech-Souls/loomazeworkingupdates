const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriesSchema = new Schema(
  {
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true },
    imageURL: { type: String, default: null },
    name: { type: String, required: true, lowercase: true,  },
    subcategories: { type: [String] },
    displayOnHome: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const categoriesModel =
  mongoose.models.categories || mongoose.model("categories", categoriesSchema);

module.exports = categoriesModel;
