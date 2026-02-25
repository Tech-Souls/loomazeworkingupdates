const path = require("path");
const mongoose = require("mongoose");
const Category = require("../models/categories");
const uploadToFTP = require("../middleware/uploadToFTP");

const DEMO_SELLER_ID = new mongoose.Types.ObjectId("000000000000000000000001");

const demoCategoryData = [
  { name: "Electronics", file: "electronics.jpg" },
  { name: "Fashion", file: "fashion.jpg" },
  { name: "Home & Kitchen", file: "home.jpg" },
  { name: "Beauty & Care", file: "beauty.jpg" },
  { name: "Sports & Fitness", file: "sports.jpg" },
  { name: "Toys & Games", file: "toys.jpg" },
  { name: "Books & Stationery", file: "books.jpg" },
  { name: "Groceries", file: "grocery.jpg" },
  { name: "Automobile", file: "auto.jpg" },
  { name: "Mobile Accessories", file: "mobile.jpg" },
];

async function seedDemoCategories() {
  try {
    // 1️⃣ Check if already seeded
    const exists = await Category.exists({ isDemo: true });
    if (exists) {
      console.log("✅ Demo categories already seeded");
      return;
    }

    console.log("🚀 Seeding demo categories...");

    const categoriesToInsert = [];

    // 2️⃣ Upload images first
    for (const item of demoCategoryData) {
      const localImagePath = path.join(
        __dirname,
        "demo-assets",
        item.file
      );

      const imageURL = await uploadToFTP(localImagePath);

      categoriesToInsert.push({
        sellerID: DEMO_SELLER_ID,
        name: item.name,
        imageURL,
        subcategories: [],
        displayOnHome: true,
        isDemo: true,
      });

      console.log(`📤 Uploaded ${item.file}`);
    }

    // 3️⃣ Insert categories
    await Category.insertMany(categoriesToInsert);

    console.log("🎉 Demo categories uploaded & saved");

  } catch (err) {
    console.error("❌ Demo category seeding failed:", err);
  }
}

module.exports = seedDemoCategories;
