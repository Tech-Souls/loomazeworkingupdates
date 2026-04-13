const express = require("express");
const router = express.Router();

const faqsModel = require("../models/faqs");

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const faqs = await faqsModel.find({ sellerID }).sort({ createdAt: -1 })

        res.status(200).json({ message: 'Faqs fetched', faqs })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        if (!data.sellerID || !data.question || !data.answer) return res.status(400).json({ message: "Missing required fields!" })

        const newFaq = await faqsModel.create(data)
        res.status(201).json({ message: "Faq created successfully!", faq: newFaq });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await faqsModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Faq deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router