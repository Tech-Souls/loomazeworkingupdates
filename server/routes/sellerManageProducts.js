const express = require("express");
const router = express.Router();

const productsModel = require("../models/products");
const settingsModel = require("../models/settings");

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const products = await productsModel.find({ sellerID }).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalProducts = await productsModel.countDocuments({ sellerID })
        const settings = await settingsModel.findOne({ sellerID })
        const currency = settings?.content?.currency || "USD";

        res.status(200).json({ message: 'Products fetched', products, totalProducts, currency })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.get("/search", async (req, res) => {
    try {
        const { sellerID } = req.query
        const page = parseInt(req.query.page) || 1
        const searchText = req.query.searchText
        const limit = 20
        const skip = (page - 1) * limit

        const query = {
            sellerID,
            $or: [
                { productID: { $regex: searchText, $options: "i" } },
                { sku: { $regex: searchText, $options: "i" } },
                { title: { $regex: searchText, $options: "i" } },
                { description: { $regex: searchText, $options: "i" } },
                { tags: { $elemMatch: { $regex: searchText, $options: "i" } } }
            ]
        };

        const searchedProducts = await productsModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalSearchedProducts = await productsModel.countDocuments(query)

        res.status(200).json({ message: 'Products searched', searchedProducts, totalSearchedProducts })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.put("/toggle-status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productsModel.findById(id);

        product.status = product.status === 'active' ? 'inactive' : 'active';
        await product.save();

        res.status(202).json({ product });
    } catch (error) {
        console.error("Error toggling product status:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.put("/toggle-sale-status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productsModel.findById(id);

        product.onSale = product.onSale === true ? false : true;
        await product.save();

        res.status(202).json({ product });
    } catch (error) {
        console.error("Error toggling product status:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productsModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Product deleted", product: deletedProduct });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router