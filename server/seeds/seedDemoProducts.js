const path = require("path");
const mongoose = require("mongoose");
const Product = require("../models/products"); // adjust path
const uploadToFTP = require("../middleware/uploadToFTP");

const DEMO_SELLER_ID = new mongoose.Types.ObjectId("000000000000000000000001");

const demoProductData = [
  { title: "Wireless Headphones", file: "headphones.jpg", category: "Electronics", price: 99 },
  { title: "Smart Watch", file: "smartwatch.jpg", category: "Electronics", price: 149 },
  { title: "Running Shoes", file: "running-shoes.jpg", category: "Sports & Fitness", price: 79 },
  { title: "Leather Wallet", file: "wallet.jpg", category: "Fashion", price: 49 },
  { title: "Coffee Maker", file: "coffee-maker.jpg", category: "Home & Kitchen", price: 129 },
  { title: "Toy Car Set", file: "toy-car.jpg", category: "Toys & Games", price: 29 },
  { title: "Yoga Mat", file: "yoga-mat.jpg", category: "Sports & Fitness", price: 39 },
  { title: "Cookbook", file: "cookbook.jpg", category: "Books & Stationery", price: 24 },
  { title: "Smartphone Case", file: "phone-case.jpg", category: "Mobile Accessories", price: 19 },
  { title: "Sunglasses", file: "sunglasses.jpg", category: "Fashion", price: 59 },
];

async function seedDemoProducts() {
  try {
    // 1️⃣ Check if already seeded
    const exists = await Product.exists({ isDemo: true });
    if (exists) {
      console.log("✅ Demo products already seeded");
      return;
    }

    console.log("🚀 Seeding demo products...");

    const productsToInsert = [];

    // 2️⃣ Upload images first
    for (const item of demoProductData) {
      const localImagePath = path.join(__dirname, "demo-assets", item.file);

      const imageURL = await uploadToFTP(localImagePath);

      productsToInsert.push({
        productID: new mongoose.Types.ObjectId().toString(), // unique productID
        sellerID: DEMO_SELLER_ID,
        brandSlug: "demo-brand",
        title: item.title,
        description: `Demo product: ${item.title}`,
        category: item.category,
        subcategory: null,
        tags: [item.category.toLowerCase()],
        price: item.price,
        stock: 100,
        mainImageURL: imageURL,
        isDemo: true,
        slug: item.title.toLowerCase().replace(/\s+/g, "-"),
      });

      console.log(`📤 Uploaded ${item.title}`);
    }

    // 3️⃣ Insert products
    await Product.insertMany(productsToInsert);

    console.log("🎉 Demo products uploaded & saved");

  } catch (err) {
    console.error("❌ Demo product seeding failed:", err);
  }
}

module.exports = seedDemoProducts;
