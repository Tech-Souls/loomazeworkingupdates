const express = require("express");
const router = express.Router();

const sizeChartsModel = require("../models/sizecharts");

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query;
        const sizeCharts = await sizeChartsModel.find({ sellerID }).sort({ createdAt: -1 });

        res.status(200).json({ message: "Size charts fetched!", sizeCharts });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

router.post("/create", async (req, res) => {
    try {
        const { sellerID, name, columns, rows } = req.body;

        if (!sellerID || !name?.trim() || !columns?.length || !rows?.length) {
            return res.status(400).json({ message: "Missing required fields!" });
        }

        const newSizeChart = new sizeChartsModel({ sellerID, name, columns, rows, });
        await newSizeChart.save();

        res.status(201).json({ message: "Size chart created successfully!", sizeChart: newSizeChart });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rows, columns } = req.body;

        const updatedChart = await sizeChartsModel.findByIdAndUpdate(id, { name, rows, columns }, { new: true });

        if (!updatedChart) {
            return res.status(404).json({ message: "Size chart not found" });
        }

        res.json({ message: "Size chart updated successfully!", sizeChart: updatedChart });
    } catch (error) {
        console.error("Update size chart error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await sizeChartsModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Size chart deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

module.exports = router