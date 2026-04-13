const express = require("express");
const router = express.Router();
const fs = require("fs");

const settingsModel = require("../models/settings")
const upload = require("../middleware/multer");
const uploadToFTP = require("../middleware/uploadToFTP")

router.post("/update/:sellerID", upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 }
]), async (req, res) => {
    try {
        const { sellerID } = req.params
        const { primaryColor, secondaryColor } = req.body

        const sellerSettings = await settingsModel.findOne({ sellerID })
        if (!sellerSettings) {
            return res.status(404).json({ message: "Seller settings not found" });
        }

        if (req.files?.logo) {
            const logoUrl = await uploadToFTP(req.files.logo[0].path);
            fs.unlinkSync(req.files.logo[0].path);

            sellerSettings.logo = logoUrl;
        } else if (req.body.logoPath) {
            sellerSettings.logo = req.body.logoPath;
        }

        if (req.files?.favicon) {
            const faviconUrl = await uploadToFTP(req.files.favicon[0].path);
            fs.unlinkSync(req.files.favicon[0].path);

            sellerSettings.favicon = faviconUrl;
        } else if (req.body.faviconPath) {
            sellerSettings.favicon = req.body.faviconPath;
        }

        if (primaryColor && primaryColor.trim() !== "") {
            sellerSettings.theme.primary = primaryColor;
        }
        if (secondaryColor && secondaryColor.trim() !== "") {
            sellerSettings.theme.secondary = secondaryColor;
        }

        await sellerSettings.save();

        res.status(202).json({
            message: 'Theme changes saved!',
            updatedData: {
                logo: sellerSettings.logo,
                favicon: sellerSettings.favicon,
                theme: sellerSettings.theme,
            },
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

module.exports = router