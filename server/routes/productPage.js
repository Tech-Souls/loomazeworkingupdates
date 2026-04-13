const express = require("express");
const router = express.Router();

const authModel = require("../models/auth");
const productsModel = require("../models/products");
const reviewsModel = require("../models/reviews");

router.get("/fetch-product", async (req, res) => {
  try {
    const { sellerID, productSlug } = req.query;
    if (!sellerID) {
      return res.status(400).json({ message: "sellerID is required" });
    }

    let product = await productsModel
      .findOne({ sellerID, slug: productSlug, status: "active" })
      .populate("sizeChart")
      .populate("boughtTogether");

    if (!product) {
      product = await productsModel.findOne({
        slug: productSlug,
        isDemo: true,
      });
    }

    res.status(200).json({ message: "Product fetched", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-similar-products", async (req, res) => {
  try {
    const { sellerID, productSlug, category, subcategory } = req.query;
    if (!sellerID)
      return res.status(400).json({ message: "sellerID is required" });

    const searchConditions = [];

    if (category) {
      searchConditions.push(
        { title: { $regex: category, $options: "i" } },
        { tags: { $regex: category, $options: "i" } },
        { category: { $regex: category, $options: "i" } },
      );
    }

    if (subcategory) {
      searchConditions.push(
        { title: { $regex: subcategory, $options: "i" } },
        { tags: { $regex: subcategory, $options: "i" } },
        { subcategory: { $regex: subcategory, $options: "i" } },
      );
    }

    const searchQuery = {
      sellerID,
      status: "active",
      $or: searchConditions,
      productSlug: { $ne: productSlug },
    };

    const products = await productsModel
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json({ message: "Similar products fetched", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/add-to-cart", async (req, res) => {
  try {
    const { userID } = req.query;
    const data = req.body;

    if (!userID) return res.status(400).json({ message: "userID is required" });

    const user = await authModel.findById(userID);
    if (!user) return res.status(404).json({ message: "User is not found" });

    if (!data.productID) {
      return res.status(400).json({ message: "productID is required" });
    }

    // Check if same product + variant combination already exists in cart
    const existingItemIndex = user.cart.findIndex((item) => {
      // For products without variants
      if (!data.variantID && !item.variantID) {
        return item.productID === data.productID;
      }
      // For products with variants
      return (
        item.productID === data.productID && item.variantID === data.variantID
      );
    });

    if (existingItemIndex !== -1) {
      const existingItem = user.cart[existingItemIndex];
      const newQuantity = existingItem.quantity + (data.quantity || 1);

      if (newQuantity > data.stock) {
        return res.status(400).json({
          message: `Cannot add more. Only ${data.stock} units available.`,
        });
      }

      user.cart[existingItemIndex].quantity = newQuantity;
      await user.save();

      return res
        .status(201)
        .json({ message: "Cart updated!", cart: user.cart });
    }

    if (data.quantity > data.stock) {
      return res.status(400).json({
        message: `${data.stock > 0 ? `Only ${data.stock} units available.` : "Out of stock"}`,
      });
    }

    const cartItem = {
      productID: data.productID,
      variantID: data.variantID || null,
      brandSlug: data.brandSlug,
      title: data.title,
      slug: data.slug,
      mainImageURL: data.mainImageURL,
      variantImageURL: data.variantImageURL || null,
      quantity: data.quantity || 1,
      price: data.price,
      comparedPrice: data.comparedPrice,
      stock: data.stock,
      selectedOptions: data.selectedOptions || [],
    };

    user.cart.push(cartItem);
    await user.save();

    res
      .status(201)
      .json({ message: "Product added to cart!", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-reviews", async (req, res) => {
  try {
    const { productID } = req.query;

    const reviews = await reviewsModel
      .find({ productID })
      .sort({ createdAt: -1 })
      .populate("userID", "username");

    res.status(200).json({ message: "Reviews fetched", reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
