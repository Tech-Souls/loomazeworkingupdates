const express = require("express");
const router = express.Router();

const menusModel = require("../models/menus");
const categoriesModel = require("../models/categories");
const productsModel = require("../models/products");
const galleryModel = require("../models/gallery");
const reviewsModel = require("../models/reviews");
const faqsModel = require("../models/faqs");

router.get("/fetch-main-menu", async (req, res) => {
  try {
    const { sellerID, headerMenuName } = req.query;
    const mainMenuItems = await menusModel
      .findOne({ sellerID, name: headerMenuName })
      .select("links");

    res.status(200).json({ message: "Main menu items fetched", mainMenuItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-categories", async (req, res) => {
  try {
    const { sellerID } = req.query;
    let categories = await categoriesModel.find({
      sellerID,
      displayOnHome: true,
    });
    
    if (categories.length === 0) {
      categories = await categoriesModel.find({
        isDemo: true,
      }).sort({ createdAt: 1 });
    }

    res.status(200).json({ message: "Categories fetched", categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-featured-products", async (req, res) => {
  try {
    const { sellerID } = req.query;
    let products = await productsModel.find({
      sellerID,
      isFeatured: true,
      status: "active",
    });
    if(products?.length === 0) {
      products = await productsModel.find({
        isDemo: true,
      }).sort({ createdAt: 1 });
    }

    res.status(200).json({ message: "Products fetched", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-recent-products", async (req, res) => {
  try {
    const { sellerID } = req.query;
    let products = await productsModel
      .find({ sellerID, isFeatured: { $ne: true }, status: "active" })
      .sort({ createdAt: -1 })
      .limit(12);

      if(products?.length === 0) {
      products = await productsModel.find({
        isDemo: true,
      }).sort({ createdAt: 1 }).limit(4);
    }

    res.status(200).json({ message: "Recent products fetched", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-recent-products-filtered", async (req, res) => {
  try {
    const { sellerID, category } = req.query;

    const baseFilter = { sellerID, status: "active", isFeatured: false };

    if (category !== "all") {
      baseFilter.category = { $regex: `^${category}$`, $options: "i" };
    }

    const products = await productsModel
      .find(baseFilter)
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json({ message: "Recent products fetched", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-image-gallery", async (req, res) => {
  try {
    const { sellerID } = req.query;
    const gallery = await galleryModel
      .find({ sellerID })
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Gallery fetched", gallery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-recent-reviews", async (req, res) => {
  try {
    const { brandSlug } = req.query;
    let reviews = await reviewsModel
      .find({ brandSlug })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userID", "username");

    reviews = reviews.filter((r) => r.userID !== null);

    res.status(200).json({ message: "Recent reviews fetched", reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-faqs", async (req, res) => {
  try {
    const { sellerID } = req.query;
    const faqs = await faqsModel.find({ sellerID }).sort({ createdAt: -1 });

    res.status(200).json({ message: "Faqs fetched", faqs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch-footer-menu", async (req, res) => {
  try {
    const { sellerID, footerMenu1Name, footerMenu2Name } = req.query;
    const footerMenu1Items = await menusModel
      .findOne({ sellerID, name: footerMenu1Name })
      .select("links");
    const footerMenu2Items = await menusModel
      .findOne({ sellerID, name: footerMenu2Name })
      .select("links");

    res
      .status(200)
      .json({
        message: "Main menu items fetched",
        footerMenu1Items,
        footerMenu2Items,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
