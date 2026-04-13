const express = require("express");
const router = express.Router();

const paymentsModel = require("../models/payments");
const ordersModel = require("../models/orders");
const settingsModel = require("../models/settings");

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const payments = await paymentsModel.find({ sellerID }).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalPayments = await paymentsModel.countDocuments({ sellerID })
        const settings = await settingsModel.findOne({ sellerID })
        const currency = settings?.content?.currency || "USD";

        res.status(200).json({ message: 'Payments fetched', payments, totalPayments, currency })
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

        const searchedPayments = await paymentsModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalSearchedPayments = await paymentsModel.countDocuments(query)

        res.status(200).json({ message: 'Payments searched', searchedPayments, totalSearchedPayments })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.put("/update-status", async (req, res) => {
    try {
        const { paymentID, status } = req.body;

        const updatedPayment = await paymentsModel.findByIdAndUpdate(paymentID, { status }, { new: true });

        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        await ordersModel.findOneAndUpdate({ orderID: updatedPayment.orderID }, { paymentStatus: status }, { new: true });

        res.status(202).json({ message: "Payment status updated" });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPayment = await paymentsModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Payment deleted", payment: deletedPayment });
    } catch (error) {
        console.error("Error deleting order:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router