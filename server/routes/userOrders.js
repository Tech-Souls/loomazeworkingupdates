const express = require("express");
const router = express.Router();

const ordersModel = require("../models/orders");
const settingsModel = require("../models/settings");

router.get("/all", async (req, res) => {
    try {
        const { userID } = req.query
        if (!userID) return res.status(400).json({ message: "userID is required" });

        const orders = await ordersModel.find({ userID }).sort({ createdAt: -1 });
        const settings = await settingsModel.findOne({ sellerID: orders[0].sellerID })
        const currency = settings?.content?.currency || "USD";

        res.json({ message: "Orders fetched!", orders, currency });
    } catch (error) {
        console.error("Update address error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

module.exports = router