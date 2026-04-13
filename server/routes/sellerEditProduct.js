const express = require("express");
const router = express.Router();
const fs = require("fs")

const productsModel = require("../models/products");
const categoriesModel = require("../models/categories");
const sizeChartsModel = require("../models/sizecharts");
const upload = require("../middleware/multer");
const uploadToFTP = require("../middleware/uploadToFTP")
const delFromFTP = require("../middleware/delFromFTP")

router.get("/fetch-product", async (req, res) => {
    try {
        const { sellerID, productID } = req.query

        const product = await productsModel.findOne({ _id: productID, sellerID })
            .populate("boughtTogether", "_id title")
            .populate("sizeChart", "_id name");

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product fetched', product })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get("/fetch-categories", async (req, res) => {
    try {
        const { sellerID } = req.query
        const categories = await categoriesModel.find({ sellerID }).sort({ createdAt: -1 })

        res.status(200).json({ message: 'Categories fetched', categories })
    }
    catch (error) {
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

router.post("/update", upload.any(), async (req, res) => {
    try {
        const { productID } = req.query;

        if (!productID) return res.status(400).json({ message: "Product ID is required!" });

        const existingProduct = await productsModel.findById(productID);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found!" });
        }

        // ------------------ BASIC FIELDS ------------------
        const { title, description, category, subcategory, sku, price, comparedPrice, taxable, isFeatured,
            stock, weight, weightUnit, sizeChart, tags, paymentModes, boughtTogether, options, variants
        } = req.body;

        if (!title) return res.status(400).json({ message: "Title is required!" });

        // Parse JSON fields safely
        const parsedTags = JSON.parse(tags || "[]");
        const parsedPaymentModes = JSON.parse(paymentModes || "[]");
        const parsedBoughtTogether = JSON.parse(boughtTogether || "[]");
        const parsedOptions = JSON.parse(options || "[]");
        const parsedVariants = JSON.parse(variants || "[]");

        // ------------------ MAIN IMAGE ------------------
        const mainImageFile = req.files.find(f => f.fieldname === "mainImage");
        let mainImageURL = existingProduct.mainImageURL;

        if (mainImageFile) {
            try {
                if (existingProduct.mainImageURL) {
                    await delFromFTP(existingProduct.mainImageURL);
                }

                mainImageURL = await uploadToFTP(mainImageFile.path);
                fs.unlinkSync(mainImageFile.path);
            } catch (err) {
                console.error("Error handling main image:", err);

                if (fs.existsSync(mainImageFile.path)) {
                    fs.unlinkSync(mainImageFile.path);
                }
                throw err;
            }
        }

        // ------------------ VARIANT IMAGES ------------------
        const updatedVariants = await Promise.all(
            parsedVariants.map(async (variant) => {
                const file = req.files.find(f => f.fieldname === `variantImage_${variant.id}`);

                const existingVariant = existingProduct.variants.find(v => v.id === variant.id);
                let variantImageURL = existingVariant?.imageURL || variant.imageURL || "";

                if (file) {
                    try {
                        if (existingVariant?.imageURL) {
                            await delFromFTP(existingVariant.imageURL);
                        }

                        variantImageURL = await uploadToFTP(file.path);
                        fs.unlinkSync(file.path);
                    } catch (err) {
                        console.error(`Error uploading variant image for ${variant.id}:`, err);

                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    }
                }

                return {
                    ...variant,
                    imageURL: file
                        ? variantImageURL // new uploaded image
                        : variant.imageURL || ""      // keep existing image
                };
            })
        );

        // Delete images of variants that were removed
        const removedVariants = existingProduct.variants.filter(
            oldVar => !parsedVariants.some(newVar => newVar.id === oldVar.id)
        );

        for (const removedVariant of removedVariants) {
            if (removedVariant.imageURL) {
                try {
                    await delFromFTP(removedVariant.imageURL);
                } catch (err) {
                    console.error(`Error deleting removed variant image ${removedVariant.id}:`, err);
                }
            }
        }

        const totalStock = updatedVariants.length > 0
            ? updatedVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
            : Number(stock) || 0;

        // ------------------ UPDATE SLUG IF TITLE CHANGES ------------------
        let updatedSlug = existingProduct.slug;
        if (existingProduct.title !== title) {
            let baseSlug = title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            let slug = baseSlug;
            let counter = 1;

            while (await productsModel.findOne({ slug, _id: { $ne: productID } })) {
                slug = `${baseSlug}-${counter++}`;
            }

            updatedSlug = slug;
        }

        // ------------------ FINAL DATA TO UPDATE ------------------
        const updatedData = {
            title,
            slug: updatedSlug,
            description,
            category,
            subcategory,
            sku,
            price: Number(price),
            comparedPrice,
            taxable,
            isFeatured,
            stock: totalStock,
            weight: Number(weight) || 0,
            weightUnit,
            sizeChart: sizeChart && sizeChart !== "null" ? sizeChart : null,
            tags: parsedTags,
            paymentModes: parsedPaymentModes,
            boughtTogether: parsedBoughtTogether,
            options: parsedOptions,
            variants: updatedVariants,
            mainImageURL
        };

        // ------------------ UPDATE IN DB ------------------
        const updatedProduct = await productsModel.findByIdAndUpdate(productID, updatedData, { new: true })
            .populate("boughtTogether", "_id title")
            .populate("sizeChart", "_id name");

        res.status(202).json({
            message: "Product updated successfully!",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error updating product:", error.message);

        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (err) {
                        console.error("Error cleaning up temp file:", err);
                    }
                }
            });
        }

        res.status(500).json({ message: error.message });
    }
});


module.exports = router