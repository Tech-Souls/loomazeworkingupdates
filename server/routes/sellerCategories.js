const express = require("express");
const router = express.Router();
const fs = require("fs");

const categoriesModel = require("../models/categories");
const upload = require("../middleware/multer");
const uploadToFTP = require("../middleware/uploadToFTP")
const delFromFTP = require("../middleware/delFromFTP")

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        const categories = await categoriesModel.find({ sellerID }).sort({ createdAt: -1 })

        res.status(200).json({ message: 'Categories fetched', categories })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.get("/search", async (req, res) => {
    try {
        const { sellerID, searchText } = req.query

        const query = {
            sellerID,
            $or: [
                { name: { $regex: searchText, $options: "i" } },
                { subcategories: { $elemMatch: { $regex: searchText, $options: "i" } } },
            ]
        };

        const searchedCategories = await categoriesModel.find(query).sort({ createdAt: -1 })

        res.status(200).json({ message: 'Users searched', searchedCategories })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.post("/create", upload.single("categoryImage"), async (req, res) => {
    try {
        const { sellerID, name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        let imagePath = null

        if (req.file) {
            imagePath = await uploadToFTP(req.file.path);
            fs.unlinkSync(req.file.path);
        }

        const newCategory = new categoriesModel({
            sellerID,
            name: name.toLowerCase(),
            imageURL: req.file ? imagePath : null
        });

        await newCategory.save();

        res.status(201).json({ message: "New category created", category: newCategory });
    } catch (error) {
        console.error("Error creating category:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.put("/update/:id", upload.single("categoryImage"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subcategories } = req.body;

        const category = await categoriesModel.findById(id);

        if (name) category.name = name.toLowerCase();

        if (subcategories) {
            let parsedSubs = [];
            if (typeof subcategories === "string") {
                try {
                    parsedSubs = JSON.parse(subcategories);
                } catch {
                    parsedSubs = subcategories.split(",").map(s => s.trim().toLowerCase());
                }
            } else if (Array.isArray(subcategories)) {
                parsedSubs = subcategories.map(s => s.toLowerCase());
            }

            category.subcategories = parsedSubs;
        }

        if (req.file) {
            if (category.imageURL) {
                try {
                    await delFromFTP(category.imageURL);
                } catch (err) {
                    console.error("Failed to delete old image from FTP:", err);
                }
            }

            category.imageURL = await uploadToFTP(req.file.path);
            fs.unlinkSync(req.file.path);
        }

        await category.save();

        res.status(202).json({ message: "Category updated successfully", category });
    } catch (error) {
        console.error("Error updating category:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.put("/toggle-display/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoriesModel.findById(id);

        category.displayOnHome = !category.displayOnHome;
        await category.save();

        res.status(202).json({ category });
    } catch (error) {
        console.error("Error toggling category:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoriesModel.findById(id);

        if (category.imageURL) {
            try {
                await delFromFTP(category.imageURL);
            } catch (err) {
                console.error("Failed to delete old image from FTP:", err);
            }
        }

        const deletedCategory = await categoriesModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Category deleted", category: deletedCategory });
    } catch (error) {
        console.error("Error deleting category:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router