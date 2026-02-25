const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings")
const menusModel = require("../models/menus")

router.get("/fetch-menus", async (req, res) => {
    try {
        const { sellerID } = req.query

        if (!sellerID) return res.status(404).json({ message: "sellerID is required!" });
        const menus = await menusModel.find({ sellerID }).sort({ createdAt: 1 }).select("name")

        res.status(200).json({ message: 'Menus fetched!', menus })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.patch("/update-header-menu/:sellerID", async (req, res) => {
    try {
        const { sellerID } = req.params
        const { selectedMenu } = req.body

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

        sellerSettings.content.headerMenuName = selectedMenu
        await sellerSettings.save();

        res.status(202).json({ message: 'Changes saved successfully!' })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

module.exports = router