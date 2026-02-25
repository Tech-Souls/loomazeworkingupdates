const express = require("express");
const router = express.Router();

const ordersModel = require("../models/orders");
const productsModel = require("../models/products");
const reviewsModel = require("../models/reviews");
const settingsModel = require("../models/settings");

router.get("/all", async (req, res) => {
    try {
        const { userID } = req.query
        if (!userID) return res.status(400).json({ message: "userID is required" });

        const reviews = await reviewsModel.find({ userID })

        res.json({ message: "Reviews fetched!", reviews });
    } catch (error) {
        console.error("Reviews fetch error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

router.get("/add-review/fetch-order", async (req, res) => {
    try {
        const { userID, orderID } = req.query
        if (!userID || !orderID) return res.status(400).json({ message: "userID and orderID are required" });

        const order = await ordersModel.findOne({ userID, orderID })
        const settings = await settingsModel.findOne({ sellerID: order.sellerID })
        const currency = settings?.content?.currency || "USD";

        res.json({ message: "Orders fetched!", order, currency });
    } catch (error) {
        console.error("Order fetch error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

router.post("/add-review", async (req, res) => {
    try {
        const { orderID } = req.query
        const index = parseInt(req.query.index)
        const newReviewData = req.body

        if (!orderID) return res.status(400).json({ message: "orderID is required" });
        
        const existing = await reviewsModel.findOne({ productID: newReviewData.productID, userID: newReviewData.userID });
        if (existing) return res.status(400).json({ message: "You already reviewed this product." });

        const order = await ordersModel.findOne({ userID: newReviewData.userID, orderID })
        if (!order) return res.status(404).json({ message: "Order not found." });

        order.products[index].reviewed = true
        await order.save()

        const product = await productsModel.findOne({ productID: newReviewData.productID })
        if (!product) return res.status(404).json({ message: "Product not found." });
        
        product.averageRating = ((product.averageRating * product.totalReviews) + newReviewData.rating) / (product.totalReviews + 1)
        product.totalReviews += 1
        await product.save()

        await reviewsModel.create(newReviewData)

        res.json({ message: "Review submitted successfully!" });
    } catch (error) {
        console.error("Add review error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

module.exports = router