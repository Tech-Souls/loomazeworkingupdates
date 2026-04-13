const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings");

router.get("/all", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const domains = await settingsModel.find({ domain: { $ne: null } }).sort({ createdAt: -1 }).skip(skip).limit(limit).select("brandName domain")
        const totalDomains = await settingsModel.countDocuments({ domain: { $ne: null } })

        res.status(200).json({ message: 'Domains fetched', domains, totalDomains })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.get("/search", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const searchText = req.query.searchText
        const limit = 20
        const skip = (page - 1) * limit

        const query = {
            domain: { $ne: null, $regex: searchText, $options: "i" },
        };

        const searchedDomains = await settingsModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select("brandName domain")
        const totalSearchedDomains = await settingsModel.countDocuments(query)

        res.status(200).json({ message: 'Domains searched', searchedDomains, totalSearchedDomains })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;