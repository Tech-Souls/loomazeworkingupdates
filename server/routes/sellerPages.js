const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings");
const brandPagesModel = require("../models/brandPages");

router.get("/fetch-settings", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const settings = await settingsModel.findOne({ sellerID }).select("brandSlug domain")

        res.status(200).json({ message: 'Seller settings fetched', settings })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const pages = await brandPagesModel.find({ sellerID }).sort({ updatedAt: -1 })

        res.status(200).json({ message: 'Pages fetched!', pages })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post("/create-page", async (req, res) => {
    try {
        const { sellerID } = req.query
        const state = req.body

        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const pageExists = await brandPagesModel.findOne({ sellerID, slug: state.slug })
        if (pageExists) return res.status(400).json({ message: "Page already exists!" });

        await brandPagesModel.create({
            ...state, sellerID
        })

        res.status(201).json({ message: 'Page created succesfully!' })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get("/fetch-update-page/:id", async (req, res) => {
    try {
        const { id } = req.params
        const page = await brandPagesModel.findOne({ _id: id })

        res.status(200).json({ message: 'Page fetched!', page })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.patch("/update-page", async (req, res) => {
    try {
        const { pageID } = req.query
        const state = req.body

        if (!pageID) return res.status(400).json({ message: "pageID is required" });

        await brandPagesModel.findByIdAndUpdate(pageID, { ...state }, { new: true })

        res.status(202).json({ message: 'Page updated succesfully!' })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete("/delete-page/:id", async (req, res) => {
    try {
        const { id } = req.params
        await brandPagesModel.findByIdAndDelete(id)

        res.status(203).json({ message: 'Pages deleted succesfully!' })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router