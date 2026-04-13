const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings")

router.post("/update/:sellerID", async (req, res) => {
    try {
        const { sellerID } = req.params
        const data = req.body

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) {
            return res.status(404).json({ message: "Seller settings not found" });
        }

        if (data.layout) {
            sellerSettings.layout = {
                ...sellerSettings.layout.toObject(),
                ...data.layout
            };
        }

        if (data.visibility) {
            sellerSettings.visibility = {
                ...sellerSettings.visibility.toObject(),
                ...data.visibility
            };
        }

        await sellerSettings.save();

        res.status(202).json({ message: 'Changes saved successfully!', updatedData: sellerSettings, })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

module.exports = router