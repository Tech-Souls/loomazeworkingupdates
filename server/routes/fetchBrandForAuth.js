const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings");

router.get("/get", async (req, res) => {
    try {
        let { domain } = req.query;

        if (domain && domain.startsWith("www.")) {
            domain = domain.replace(/^www\./, "");
        }

        const brand = await settingsModel.findOne({ domain }).select("brandName brandSlug");

        if (!brand) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.status(200).json({ message: 'Brand fetched', brand });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;