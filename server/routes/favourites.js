const express = require("express");
const router = express.Router();

const authModel = require("../models/auth");
const settingsModel = require("../models/settings");

router.get("/get", async (req, res) => {
    try {
        const { userID } = req.query;
        if (!userID) return res.status(400).json({ message: "userID is required" });

        const user = await authModel.findById(userID).populate("favourites").select("favourites");
        if (!user) return res.status(404).json({ message: "User not found" });

        const settings = await settingsModel.findOne({ sellerID: user.favourites[0].sellerID })
        const currency = settings.content.currency

        res.status(200).json({ favourites: user.favourites || [], currency });
    } catch (error) {
        console.error("Backend GET error:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/add", async (req, res) => {
    try {
        const { userID, productID } = req.body;
        if (!userID || !productID) return res.status(400).json({ message: "Invalid request" });

        await authModel.findByIdAndUpdate(userID, { $addToSet: { favourites: productID } }, { new: true })

        res.status(201).json({ message: "Product added to favourites!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/remove", async (req, res) => {
    try {
        const { userID, productID } = req.body;
        if (!userID || !productID) return res.status(400).json({ message: "Invalid request" });

        await authModel.findByIdAndUpdate(userID, { $pull: { favourites: productID } });

        res.status(200).json({ message: "Product removed from favourites!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router