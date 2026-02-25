const express = require("express");
const router = express.Router();

const ordersModel = require("../models/orders");
const settingsModel = require("../models/settings");

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const orders = await ordersModel.find({ sellerID }).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalOrders = await ordersModel.countDocuments({ sellerID })
        const settings = await settingsModel.findOne({ sellerID })
        const currency = settings?.content?.currency || "USD";

        res.status(200).json({ message: 'Orders fetched', orders, totalOrders, currency })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.get("/search", async (req, res) => {
    try {
        const { sellerID } = req.query
        const page = parseInt(req.query.page) || 1
        const searchText = req.query.searchText
        const limit = 20
        const skip = (page - 1) * limit

        const query = {
            sellerID,
            $or: [
                { orderID: { $regex: searchText, $options: "i" } },
            ]
        };

        const searchedOrders = await ordersModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalSearchedOrders = await ordersModel.countDocuments(query)

        res.status(200).json({ message: 'Orders searched', searchedOrders, totalSearchedOrders })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await ordersModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Order deleted", order: deletedOrder });
    } catch (error) {
        console.error("Error deleting order:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router