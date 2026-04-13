const express = require("express");
const router = express.Router();
const axios = require("axios");

const settingsModel = require("../models/settings");

const VERCEL_API_URL = process.env.VERCEL_API_URL;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

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

router.post("/add-domain", async (req, res) => {
    try {
        const { sellerID, domain } = req.body;
        if (!sellerID || !domain) {
            return res.status(400).json({ message: "sellerID and domain are required" });
        }

        const cleanDomain = domain.replace(/^www\./, "").trim().toLowerCase();

        if (!cleanDomain || cleanDomain.includes(' ') || !cleanDomain.includes('.')) {
            return res.status(400).json({ message: "Invalid domain format" });
        }

        // Find seller settings
        let settings = await settingsModel.findOne({ sellerID });
        if (!settings) {
            return res.status(404).json({ message: "Seller settings not found. Please create settings first." });
        }

        // Prevent duplicates
        if (settings.domain && settings.domain === cleanDomain) {
            return res.status(400).json({ message: "This domain is already set" });
        }

        const oldDomain = settings.domain;

        if (oldDomain) {
            try {
                await axios.delete(
                    `${VERCEL_API_URL}/${VERCEL_PROJECT_ID}/domains/${oldDomain}`,
                    {
                        headers: {
                            Authorization: `Bearer ${VERCEL_TOKEN}`,
                        },
                    }
                );
                console.log(`Old domain ${oldDomain} removed from Vercel`);
            } catch (deleteError) {
                console.error("Error removing old domain from Vercel:", deleteError.response?.data || deleteError.message);
            }
        }

        // ✅ Add domain to Vercel automatically
        try {
            const response = await axios.post(
                `${VERCEL_API_URL}/${VERCEL_PROJECT_ID}/domains`,
                { name: cleanDomain },
                {
                    headers: {
                        Authorization: `Bearer ${VERCEL_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                settings.domain = cleanDomain;
                await settings.save();
                return res.status(200).json({
                    message: oldDomain ? "Domain updated successfully" : "Domain added successfully",
                    domain: cleanDomain,
                });
            } else {
                return res.status(500).json({
                    message: "Failed to add domain to Vercel",
                    details: response.data,
                });
            }
        } catch (addError) {
            console.error("Add Domain to Vercel Error:", addError.response?.data || addError.message);

            // Check if domain already exists in Vercel
            if (addError.response?.status === 409) {
                // Domain exists, just update in DB
                settings.domain = cleanDomain;
                await settings.save();
                return res.status(200).json({
                    message: "Domain updated successfully (already exists in Vercel)",
                    domain: cleanDomain,
                });
            }

            return res.status(500).json({
                message: "Error adding domain to Vercel",
                details: addError.response?.data || addError.message,
            });
        }
    } catch (error) {
        console.error("Add Domain Error:", error.message);
        return res.status(500).json({
            message: "Error adding domain",
            details: error.message,
        });
    }
});

router.delete("/remove-domain", async (req, res) => {
    try {
        const { sellerID } = req.query;
        if (!sellerID) return res.status(400).json({ message: "sellerID required" });

        const settings = await settingsModel.findOne({ sellerID });
        if (!settings || !settings.domain) {
            return res.status(404).json({ message: "No domain found for this seller" });
        }

        const domain = settings.domain;

        // ✅ Remove from Vercel
        try {
            await axios.delete(
                `${VERCEL_API_URL}/${VERCEL_PROJECT_ID}/domains/${domain}`,
                {
                    headers: {
                        Authorization: `Bearer ${VERCEL_TOKEN}`,
                    },
                }
            );
            console.log(`Domain ${domain} removed from Vercel`);
        } catch (vercelError) {
            console.error("Vercel domain removal error:", vercelError.response?.data || vercelError.message);
            // Continue even if Vercel deletion fails
        }

        // ✅ Remove from DB
        settings.domain = null;
        await settings.save();

        res.status(200).json({ message: "Domain removed successfully" });
    } catch (error) {
        console.error("Remove Domain Error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Error removing domain",
            details: error.response?.data || error.message,
        });
    }
});

module.exports = router