const express = require("express");
const router = express.Router();
const fs = require("fs");

const galleryModel = require("../models/gallery");
const upload = require("../middleware/multer");
const uploadToFTP = require("../middleware/uploadToFTP")
const delFromFTP = require("../middleware/delFromFTP")

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        const gallery = await galleryModel.find({ sellerID }).sort({ createdAt: -1 })

        res.status(200).json({ message: 'Gallery fetched', gallery })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { sellerID } = req.body;

        if (!sellerID) {
            return res.status(400).json({ message: "SellerID is required" });
        }

        let imagePath = null

        if (req.file) {
            imagePath = await uploadToFTP(req.file.path);
            fs.unlinkSync(req.file.path);
        }

        const newImage = new galleryModel({
            sellerID,
            imageURL: imagePath
        });

        await newImage.save();

        res.status(201).json({ message: "Image added to gallery!", image: newImage });
    } catch (error) {
        console.error("Error adding image:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const image = await galleryModel.findById(id);

        try {
            await delFromFTP(image.imageURL);
        } catch (err) {
            console.error("Failed to delete old image from FTP:", err);
        }

        const deletedImage = await galleryModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Image deleted", image: deletedImage });
    } catch (error) {
        console.error("Error deleting image:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router