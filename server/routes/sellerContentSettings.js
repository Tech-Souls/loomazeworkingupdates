const express = require("express");
const router = express.Router();
const fs = require("fs");

const settingsModel = require("../models/settings")
const upload = require("../middleware/multer");
const uploadToFTP = require("../middleware/uploadToFTP")
const delFromFTP = require("../middleware/delFromFTP")

router.post("/currency/update/:sellerID", async (req, res) => {
    try {
        const { sellerID } = req.params
        const { currency } = req.body

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" })

        sellerSettings.content.currency = currency
        await sellerSettings.save()

        res.status(202).json({ message: "Currency updated" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.post("/top-notifications/update/:sellerID", async (req, res) => {
    try {
        const { sellerID } = req.params
        const data = req.body

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" })

        const oldLength = sellerSettings.content.topNotifications.length
        sellerSettings.content.topNotifications = data
        await sellerSettings.save()

        const newLength = data.length
        const message = newLength > oldLength
            ? 'Notification added successfully!'
            : 'Notification deleted successfully!'

        res.status(202).json({ message })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.post("/hero-slider/add/:sellerID", upload.single("image"), async (req, res) => {
    try {
        const { sellerID } = req.params
        const { ctaLink, title, subtitle } = req.body;

        if (!req.file) return res.status(400).json({ message: "Image file is required" })

        const imagePath = await uploadToFTP(req.file.path);
        fs.unlinkSync(req.file.path);

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" })

        sellerSettings.content.heroSlider.push({
            title: title?.trim() || null,
            subtitle: subtitle?.trim() || null,
            ctaLink: ctaLink?.trim() || null,
            image: imagePath,
        });

        await sellerSettings.save();

        res.status(202).json({ message: "Slide added successfully!", heroSlider: sellerSettings.content.heroSlider })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.post("/hero-slider-2/add/:sellerID", upload.single("image"), async (req, res) => {
    try {
        const { sellerID } = req.params
        const { ctaLink, title, subtitle } = req.body;

        if (!req.file) return res.status(400).json({ message: "Image file is required" })

        const imagePath = await uploadToFTP(req.file.path);
        fs.unlinkSync(req.file.path);

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" })

        sellerSettings.content.heroSlider2.push({
            title: title?.trim() || null,
            subtitle: subtitle?.trim() || null,
            ctaLink: ctaLink?.trim() || null,
            image: imagePath,
        });

        await sellerSettings.save();

        res.status(202).json({ message: "Slide added successfully!", heroSlider: sellerSettings.content.heroSlider2 })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.delete("/hero-slider/delete/:sellerID/:index", async (req, res) => {
    try {
        const { sellerID, index } = req.params;

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" })

        const slide = sellerSettings.content.heroSlider[index];
        if (!slide) return res.status(404).json({ message: "Slide not found" });

        if (slide.image) {
            await delFromFTP(slide.image);
        }

        sellerSettings.content.heroSlider.splice(index, 1);
        sellerSettings.markModified("content.heroSlider");
        await sellerSettings.save();

        res.status(202).json({ message: "Hero slide deleted successfully!", heroSlider: sellerSettings.content.heroSlider });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/hero-slider-2/delete/:sellerID/:index", async (req, res) => {
    try {
        const { sellerID, index } = req.params;

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" })

        const slide = sellerSettings.content.heroSlider[index];
        if (!slide) return res.status(404).json({ message: "Slide not found" });

        if (slide.image) {
            await delFromFTP(slide.image);
        }

        sellerSettings.content.heroSlider2.splice(index, 1);
        sellerSettings.markModified("content.heroSlider");
        await sellerSettings.save();

        res.status(202).json({ message: "Hero slide deleted successfully!", heroSlider: sellerSettings.content.heroSlider2 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/explore-more/update/:sellerID", upload.single("image"), async (req, res) => {
    try {
        const { sellerID } = req.params
        const { title, subtitle, ctaLink } = req.body;

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" })

        if (req.file && sellerSettings.content.exploreMore.imageURL) {
            try {
                await delFromFTP(sellerSettings.content.exploreMore.imageURL);
            } catch (err) {
                console.error("Failed to delete old image from FTP:", err);
            }
        }

        const imagePath = req.file ? await uploadToFTP(req.file.path) : null;

        sellerSettings.content.exploreMore.title = title;
        sellerSettings.content.exploreMore.subtitle = subtitle;
        sellerSettings.content.exploreMore.ctaLink = ctaLink;
        if (imagePath) sellerSettings.content.exploreMore.imageURL = imagePath;

        sellerSettings.markModified("content.exploreMore");
        await sellerSettings.save();

        res.status(202).json({ message: "Content updated successfully!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.post("/explore-more-2/update/:sellerID", upload.single("image"), async (req, res) => {
    try {
        const { sellerID } = req.params
        const { title, subtitle, ctaLink } = req.body;

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" })

        if (req.file && sellerSettings.content.exploreMore2.imageURL) {
            try {
                await delFromFTP(sellerSettings.content.exploreMore2.imageURL);
            } catch (err) {
                console.error("Failed to delete old image from FTP:", err);
            }
        }

        const imagePath = req.file ? await uploadToFTP(req.file.path) : null;

        sellerSettings.content.exploreMore2.title = title;
        sellerSettings.content.exploreMore2.subtitle = subtitle;
        sellerSettings.content.exploreMore2.ctaLink = ctaLink;
        if (imagePath) sellerSettings.content.exploreMore2.imageURL = imagePath;

        sellerSettings.markModified("content.exploreMore2");
        await sellerSettings.save();

        res.status(202).json({ message: "Content updated successfully!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

module.exports = router