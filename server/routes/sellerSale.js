const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings");

router.get("/fetch-settings", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const settings = await settingsModel.findOne({ sellerID }).select("sale")

        res.status(200).json({ message: 'Seller settings fetched', settings })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.put("/save-changes", async (req, res) => {
    try {
        const { sellerID } = req.query
        const sale = req.body

        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        await settingsModel.findOneAndUpdate({ sellerID }, { sale }, { new: true })

        res.status(202).json({ message: 'Changes saved succesfully!' })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router