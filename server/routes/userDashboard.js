const express = require("express");
const router = express.Router();

const ordersModel = require("../models/orders");

router.get("/totals", async (req, res) => {
    try {
        const { userID } = req.query
        if (!userID) return res.status(400).json({ message: "userID is required" });

        const orders = await ordersModel.find({ userID }).lean()

        const totals = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(order => order.status === "pending" ||
                order.status === "processing" || order.status === "shipped").length,
        }

        res.json({ message: "Orders fetched!", totals });
    } catch (error) {
        console.error("Update address error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

module.exports = router