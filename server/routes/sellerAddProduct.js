const express = require("express");
const router = express.Router();
// const { v4: uuidv4 } = require("uuid");
// 
let uuidv4;
(async () => {
  const uuid = await import("uuid");
  uuidv4 = uuid.v4;
})();
// 
const fs = require("fs")

const categoriesModel = require("../models/categories");
const sizeChartsModel = require("../models/sizecharts");
const productsModel = require("../models/products");
const upload = require("../middleware/multer");
const uploadToFTP = require("../middleware/uploadToFTP")

router.get("/fetch-categories", async (req, res) => {
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

router.get("/fetch-size-charts", async (req, res) => {
    try {
        const { sellerID } = req.query
        const sizeCharts = await sizeChartsModel.find({ sellerID }).sort({ createdAt: -1 })

        res.status(200).json({ message: 'Size charts fetched', sizeCharts })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.get("/frequent-bought-search", async (req, res) => {
    const { sellerID, q } = req.query;
    try {
        const products = await productsModel.find({
            sellerID,
            $or: [
                { title: new RegExp(q, "i") },
                { slug: new RegExp(q, "i") },
                { productID: new RegExp(q, "i") },
                { sku: new RegExp(q, "i") }
            ]
        }).select("title price comparedPrice mainImageURL");

        res.json({ products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/create", upload.any(), async (req, res) => {
    try {
        const {
            sellerID, brandSlug, title, description, category, subcategory, sku,
            price, comparedPrice, taxable, isFeatured, stock, weight, weightUnit,
            sizeChart, tags, paymentModes, boughtTogether, options, variants
        } = req.body;

        if (!title) return res.status(400).json({ message: "Title is required!" });
        if (!sellerID) return res.status(400).json({ message: "Seller ID is required!" });
        if (!brandSlug) return res.status(400).json({ message: "Brand slug is required!" });

        const mainImageFile = req.files.find(f => f.fieldname === "mainImage");
        if (!mainImageFile) return res.status(400).json({ message: "Product main image is required!" });

        // Parse JSON data
        const optionsArray = options ? JSON.parse(options) : [];
        const variantsArray = variants ? JSON.parse(variants) : [];
        const tagsArray = tags ? JSON.parse(tags) : [];
        const paymentModesArray = paymentModes ? JSON.parse(paymentModes) : [];
        const boughtTogetherArray = boughtTogether ? JSON.parse(boughtTogether) : [];

        let baseSlug = title.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        let slug = baseSlug;
        let counter = 1;

        while (await productsModel.findOne({ slug })) {
            slug = `${baseSlug}-${brandSlug}-${counter++}`;
        }

        const mainImageUploadedURL = await uploadToFTP(mainImageFile.path)
        fs.unlinkSync(mainImageFile.path);

        const updatedVariants = await Promise.all(
            variantsArray.map(async (variant) => {
                const variantImageFile = req.files.find(f =>
                    f.fieldname === `variantImage_${variant.id}`
                );

                let variantImageURL = "";
                if (variantImageFile) {
                    try {
                        variantImageURL = await uploadToFTP(variantImageFile.path);
                        fs.unlinkSync(variantImageFile.path);
                    } catch (err) {
                        console.error(`Error uploading variant image for ${variant.id}:`, err);
                    }
                }

                return {
                    id: variant.id || uuidv4(),
                    optionValues: variant.optionValues,
                    price: variant.price || price || 0,
                    stock: variant.stock || stock || 0,
                    imageURL: variantImageURL
                };
            })
        );

        const totalStock = updatedVariants.length > 0
            ? updatedVariants.reduce((sum, v) => sum + (v.stock || 0), 0)
            : (stock || 0);

        const newProduct = new productsModel({
            productID: uuidv4().replace(/-/g, "").slice(0, 8),
            sellerID,
            brandSlug,

            // Basic Info
            title,
            description: description || "",
            category: category || "",
            subcategory: subcategory || "",
            tags: tagsArray,
            sku: sku || "",

            // Pricing & Stock
            price: parseFloat(price) || 0,
            comparedPrice: parseFloat(comparedPrice) || null,
            stock: totalStock, // Use calculated total stock

            // Variants System
            options: optionsArray,
            variants: updatedVariants,

            // Size Chart
            sizeChart: sizeChart && sizeChart !== "null" && sizeChart !== "undefined"
                ? sizeChart
                : null,

            // Weight
            weight: parseFloat(weight) || 0,
            weightUnit: weightUnit || "kg",

            // Images
            mainImageURL: mainImageUploadedURL,

            // Product Settings
            isFeatured: isFeatured === 'true' || isFeatured === true,
            taxable: taxable === 'true' || taxable === true,

            // Relationships
            boughtTogether: boughtTogetherArray,
            paymentModes: paymentModesArray,

            // SEO & Slug
            slug,
        });

        await newProduct.save();

        res.status(201).json({ message: "Product created successfully!" });
    } catch (error) {
        console.error("Error creating product:", error.message);

        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        if (error instanceof SyntaxError) {
            return res.status(400).json({ message: "Invalid JSON data in one of the fields" });
        }
        res.status(500).json({ message: "Server error while creating product", error: error.message });
    }
});

module.exports = router