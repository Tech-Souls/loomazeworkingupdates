const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings");

const VALID_TAGS = [
    "googleAnalytics",
    "googleTagManager",
    "googleSearchConsole",
    "googleAdsConversion",
    "facebookPixel",
    "tiktokPixel",
    "pinterestTag",
];

function validateTrackingTag(tagKey, tagValue) {
    if (!VALID_TAGS.includes(tagKey)) {
        return `${tagKey} is not a supported tracking tag.`;
    }

    // Empty or null check
    if (!tagValue || typeof tagValue !== "string" || !tagValue.trim()) {
        return "Tag code cannot be empty.";
    }

    // General check for <script> or <meta>
    const hasScript = /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(tagValue);
    const hasMeta = /<meta[\s\S]*?>/i.test(tagValue);

    if (!hasScript && !hasMeta) {
        return "Tag must include a valid <script> or <meta> tag.";
    }

    // Optional specific pattern checks
    const patterns = {
        googleAnalytics: /gtag\(('|")config('|")/i,
        googleTagManager: /GTM-[A-Z0-9]+/i,
        googleSearchConsole: /<meta.*?name=["']google-site-verification["']/i,
        googleAdsConversion: /AW-[0-9]+/i,
        facebookPixel: /fbq\(('|")init('|")/i,
        tiktokPixel: /ttq\.track|TiktokAnalytics/i,
        pinterestTag: /pintrk\(/i,
    };

    const pattern = patterns[tagKey];
    if (pattern && !pattern.test(tagValue)) {
        return `Invalid ${tagKey} tag format.`;
    }

    const isSafeSource = /(google|facebook|tiktok|pinterest)\./i.test(tagValue);
    if (!isSafeSource) {
        return "Only Google, Facebook, TikTok, and Pinterest tags are allowed.";
    }

    return null; // means valid
}

router.get("/fetch-settings", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const settings = await settingsModel.findOne({ sellerID })

        res.status(200).json({ message: 'Seller settings fetched', settings })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.put("/update", async (req, res) => {
    try {
        const { sellerID, tagKey, tagValue } = req.body;

        if (!sellerID || !tagKey)
            return res.status(400).json({ message: "sellerID and tagKey are required." });

        const validationError = validateTrackingTag(tagKey, tagValue);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updateField = `trackingTags.${tagKey}`;

        const updated = await settingsModel.findOneAndUpdate(
            { sellerID },
            { $set: { [updateField]: tagValue } },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Settings not found for this seller." });

        res.status(200).json({ message: `${tagKey} updated successfully`, settings: updated });
    } catch (error) {
        console.error("Error updating tag:", error);
        res.status(500).json({ message: error.message });
    }
});

router.put("/remove", async (req, res) => {
    try {
        const { sellerID, tagKey } = req.body;

        if (!sellerID || !tagKey)
            return res.status(400).json({ message: "sellerID and tagKey are required." });

        const updateField = `trackingTags.${tagKey}`;

        const updated = await settingsModel.findOneAndUpdate(
            { sellerID },
            { $unset: { [updateField]: "" } },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Settings not found for this seller." });

        res.status(200).json({ message: `${tagKey} removed successfully`, settings: updated });
    } catch (error) {
        console.error("Error removing tag:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router