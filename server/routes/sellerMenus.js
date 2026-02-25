const express = require("express");
const router = express.Router();

const menusModel = require("../models/menus");

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" })

        const menus = await menusModel.find({ sellerID }).sort({ createdAt: 1 })

        res.status(200).json({ message: 'Seller menus fetched', menus })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post("/create-menu", async (req, res) => {
    try {
        const data = req.body;

        data.name = data.name.trim()
        if (!data.sellerID || !data.name) return res.status(400).json({ message: "Missing required fields" })

        const isFound = await menusModel.findOne({ sellerID: data.sellerID, name: data.name })
        if (isFound) return res.status(400).json({ message: "Menu already exists" })

        await menusModel.create(data)

        res.status(201).json({ message: "Menu created successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/fetch-single-menu/:menuID", async (req, res) => {
    try {
        const { menuID } = req.params
        if (!menuID) return res.status(400).json({ message: "menuID is required" })

        const menu = await menusModel.findById(menuID)

        res.status(200).json({ message: 'Menu fetched', menu })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.patch("/update-menu/:menuID", async (req, res) => {
    try {
        const { menuID } = req.params;
        const data = req.body;

        if (!menuID) return res.status(400).json({ message: "menuID is required" });
        if (!data.name) return res.status(400).json({ message: "Menu name is required" });

        data.name = data.name.trim();

        const exists = await menusModel.findOne({ _id: { $ne: menuID }, sellerID: data.sellerID, name: data.name });

        if (exists) return res.status(400).json({ message: "Menu name already exists!" });

        await menusModel.findByIdAndUpdate(menuID, data);

        res.status(202).json({ message: "Menu updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router