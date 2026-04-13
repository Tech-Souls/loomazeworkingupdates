const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings")

router.put("/delivery-charges/update/:sellerID", async (req, res) => {
    try {
        const { sellerID } = req.params
        const data = req.body

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) {
            return res.status(404).json({ message: "Seller settings not found" });
        }

        sellerSettings.deliveryCharges = { ...data };
        await sellerSettings.save();

        res.status(202).json({ message: 'Changes saved successfully!' })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.post("/payment-modes/create/:sellerID", async (req, res) => {
    try {
        const { sellerID } = req.params
        const data = req.body

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) {
            return res.status(404).json({ message: "Seller settings not found" });
        }

        sellerSettings.paymentModes.online.push({ ...data, status: "active" })
        await sellerSettings.save();

        res.status(202).json({ message: 'Payment method added successfully!', sellerSettings })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.put("/payment-modes/update/:sellerID", async (req, res) => {
    try {
        const { sellerID } = req.params
        const data = req.body

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) {
            return res.status(404).json({ message: "Seller settings not found" });
        }

        sellerSettings.paymentModes = { ...data };
        await sellerSettings.save();

        res.status(202).json({ message: 'Changes saved successfully!' })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.delete("/payment-modes/delete/:sellerID/:methodID", async (req, res) => {
    try {
        const { sellerID, methodID } = req.params;

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) {
            return res.status(404).json({ message: "Seller settings not found" });
        }

        // filter out the deleted method
        sellerSettings.paymentModes.online = sellerSettings.paymentModes.online.filter(
            (mode) => mode._id.toString() !== methodID
        );

        await sellerSettings.save();

        res.status(200).json({ message: "Payment method deleted successfully" });
    } catch (err) {
        console.error("Error deleting payment method:", err);
        res.status(500).json({ message: "Failed to delete payment method" });
    }
});

module.exports = router