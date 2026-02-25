/*
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const upload = require("../middleware/multer");
const authModel = require("../models/auth");
const productsModel = require("../models/products");
const ordersModel = require("../models/orders");
const paymentsModel = require("../models/payments");
const uploadToFTP = require("../middleware/uploadToFTP");

const generateOrderID = () => {
    return String(Math.floor(10000000 + Math.random() * 90000000));
};
/*
/*
router.post("/place-order", upload.single("transactionSS"), async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            userID, sellerID, totalAmount, coupon, discountAmount, deliveryCharges, finalAmount,
            shippingDetails, products, paymentMethod, gateway, transactionID, paymentStatus,
            isGuestOrder // Add this from frontend
        } = req.body;

        // Modified validation - allow "guest" as userID
        if (!userID || !sellerID || !finalAmount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (paymentMethod === "online" && !gateway) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Gateway required for online payment" });
        }

        if (paymentMethod === "online" && !transactionID) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Transaction ID required for online payment" });
        }

        if (paymentMethod === "online" && !req.file) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Transaction screenshot required for online payment" });
        }

        const parsedProducts = typeof products === "string" ? JSON.parse(products) : products;
        const parsedShippingDetails = typeof shippingDetails === "string" ? JSON.parse(shippingDetails) : shippingDetails;

        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid products data" });
        }

        const requiredShippingFields = ['fullName', 'email', 'phoneNumber', 'province', 'city', 'place', 'address'];
        const missingFields = requiredShippingFields.filter(field => !parsedShippingDetails[field]?.trim());

        if (missingFields.length > 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: `Missing shipping details: ${missingFields.join(', ')}` });
        }

        // Stock validation map - stores product updates
        const productUpdates = [];

        // Validate all products and variants
        for (const item of parsedProducts) {
            if (!item.productID || !item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({ message: "Invalid product in cart" });
            }

            const product = await productsModel.findOne({ productID: item.productID }).session(session);

            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ message: `Product "${item.title}" not found` });
            }

            // Check if product has variants
            if (item.variantID) {
                const variantIndex = product.variants.findIndex(v => v.id === item.variantID);

                if (variantIndex === -1) {
                    await session.abortTransaction();
                    return res.status(404).json({
                        message: `Variant not found for "${item.title}"`
                    });
                }

                const variant = product.variants[variantIndex];

                // Validate variant stock
                if (variant.stock < item.quantity) {
                    await session.abortTransaction();
                    const variantDesc = item.selectedOptions?.map(o => o.optionValue).join(', ') || 'Unknown variant';
                    return res.status(400).json({
                        message: `Insufficient stock for "${item.title}" - ${variantDesc}. Available: ${variant.stock}, Requested: ${item.quantity}`
                    });
                }

                // Store update info
                productUpdates.push({
                    productId: product._id,
                    productID: item.productID,
                    variantID: item.variantID,
                    variantIndex, //Index for direct variant access
                    quantity: item.quantity,
                    title: item.title
                });
            } else {
                // Product without variants
                if (product.stock < item.quantity) {
                    await session.abortTransaction();
                    return res.status(400).json({
                        message: `Insufficient stock for "${item.title}". Available: ${product.stock}, Requested: ${item.quantity}`
                    });
                }

                // Store update info
                productUpdates.push({
                    productId: product._id,
                    productID: item.productID,
                    variantID: null,
                    quantity: item.quantity,
                    title: item.title
                });
            }
        }

        const orderID = generateOrderID();

        const orderProducts = parsedProducts.map(item => ({
            productID: item.productID,
            variantID: item.variantID || null,
            brandSlug: item.brandSlug,
            title: item.title,
            slug: item.slug,
            mainImageURL: item.mainImageURL,
            variantImageURL: item.variantImageURL || null,
            quantity: item.quantity,
            price: item.price,
            comparedPrice: item.comparedPrice,
            selectedOptions: item.selectedOptions || [],
            reviewed: false
        }));

        // Create order
        const orderData = {
            orderID,
            sellerID,
            totalAmount: parseFloat(totalAmount) || 0,
            coupon: coupon || null,
            discountAmount: parseFloat(discountAmount) || 0,
            deliveryCharges: parseFloat(deliveryCharges) || 0,
            finalAmount: parseFloat(finalAmount) || 0,
            shippingDetails: parsedShippingDetails,
            products: orderProducts,
            paymentMethod,
            status: "pending",
            paymentStatus: paymentStatus || "pending",
            paymentDetails: paymentMethod === "online" ? {
                gateway: gateway,
                transactionID: transactionID,
                transactionSS: req.file ? `/uploads/${req.file.filename}` : null
            } : {}
        };

        // Handle userID differently for guest orders
        if (userID === "guest" || isGuestOrder === "true" || isGuestOrder === true) {
            // For guest orders, store null or "guest" as userID
            orderData.userID = null;
            orderData.isGuestOrder = true;
        } else {
            // For regular orders, use the actual userID
            orderData.userID = userID;
            orderData.isGuestOrder = false;
        }

        const newOrder = new ordersModel(orderData);
        const savedOrder = await newOrder.save({ session });

        // Create payment record
        const paymentData = {
            orderID,
            sellerID,
            amount: parseFloat(finalAmount),
            paymentMethod,
            gateway: gateway || null,
            transactionID: transactionID || null,
            transactionSS: req.file ? `/uploads/${req.file.filename}` : null,
            status: paymentStatus || "pending"
        };

        // Handle userID for payment record
        if (userID === "guest" || isGuestOrder === "true" || isGuestOrder === true) {
            paymentData.userID = null;
            paymentData.isGuestPayment = true;
        } else {
            paymentData.userID = userID;
            paymentData.isGuestPayment = false;
        }

        const newPayment = new paymentsModel(paymentData);
        await newPayment.save({ session });

        // Only clear cart for logged-in users
        if (userID !== "guest" && !(isGuestOrder === "true" || isGuestOrder === true)) {
            await authModel.findByIdAndUpdate(userID, { cart: [] }, { new: true, session });
        }

        // Update stock for all products
        for (const update of productUpdates) {
            const product = await productsModel.findById(update.productId).session(session);

            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({
                    message: `Product not found: ${update.title}`
                });
            }

            if (update.variantID) {
                // Update variant stock
                const variant = product.variants[update.variantIndex];

                if (!variant) {
                    await session.abortTransaction();
                    return res.status(404).json({
                        message: `Variant not found for: ${update.title}`
                    });
                }

                // Decrement variant stock
                product.variants[update.variantIndex].stock -= update.quantity;

                // Ensure variant stock doesn't go negative
                if (product.variants[update.variantIndex].stock < 0) {
                    await session.abortTransaction();
                    return res.status(400).json({
                        message: `Stock update failed for: ${update.title}`
                    });
                }

                // Recalculate total product stock (sum of all variant stocks)
                product.stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
            } else {
                // Update base product stock
                product.stock -= update.quantity;

                // Ensure stock doesn't go negative
                if (product.stock < 0) {
                    await session.abortTransaction();
                    return res.status(400).json({ message: `Stock update failed for: ${update.title}` });
                }
            }

            // Increment sold count
            product.sold = (product.sold || 0) + update.quantity;

            // Save updated product
            await product.save({ session });
        }

        await session.commitTransaction();

        res.status(201).json({
            message: "Order placed successfully!",
            orderID,
            order: savedOrder,
            isGuestOrder: userID === "guest" || isGuestOrder === "true" || isGuestOrder === true
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Order placement error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again", error: error.message });
    } finally {
        session.endSession();
    }
});
*/

// router.post("/place-order", upload.single("transactionSS"), async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const {
//             userID, sellerID, totalAmount, coupon, discountAmount, deliveryCharges, finalAmount,
//             shippingDetails, products, paymentMethod, gateway, transactionID, paymentStatus
//         } = req.body;

//         if (!userID || !sellerID || !finalAmount) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         if (paymentMethod === "online" && !gateway) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: "Gateway required for online payment" });
//         }

//         if (paymentMethod === "online" && !transactionID) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: "Transaction ID required for online payment" });
//         }

//         if (paymentMethod === "online" && !req.file) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: "Transaction screenshot required for online payment" });
//         }

//         const parsedProducts = typeof products === "string" ? JSON.parse(products) : products;
//         const parsedShippingDetails = typeof shippingDetails === "string" ? JSON.parse(shippingDetails) : shippingDetails;

//         if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: "Invalid products data" });
//         }

//         const requiredShippingFields = ['province', 'city', 'place', 'address', 'phoneNumber'];
//         const missingFields = requiredShippingFields.filter(field => !parsedShippingDetails[field]?.trim());

//         if (missingFields.length > 0) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: `Missing shipping details: ${missingFields.join(', ')}` });
//         }

//         // Stock validation map - stores product updates
//         const productUpdates = [];

//         // Validate all products and variants
//         for (const item of parsedProducts) {
//             if (!item.productID || !item.quantity) {
//                 await session.abortTransaction();
//                 return res.status(400).json({ message: "Invalid product in cart" });
//             }

//             const product = await productsModel.findOne({ productID: item.productID }).session(session);

//             if (!product) {
//                 await session.abortTransaction();
//                 return res.status(404).json({ message: `Product "${item.title}" not found` });
//             }

//             // Check if product has variants
//             if (item.variantID) {
//                 const variantIndex = product.variants.findIndex(v => v.id === item.variantID);

//                 if (variantIndex === -1) {
//                     await session.abortTransaction();
//                     return res.status(404).json({
//                         message: `Variant not found for "${item.title}"`
//                     });
//                 }

//                 const variant = product.variants[variantIndex];

//                 // Validate variant stock
//                 if (variant.stock < item.quantity) {
//                     await session.abortTransaction();
//                     const variantDesc = item.selectedOptions?.map(o => o.optionValue).join(', ') || 'Unknown variant';
//                     return res.status(400).json({
//                         message: `Insufficient stock for "${item.title}" - ${variantDesc}. Available: ${variant.stock}, Requested: ${item.quantity}`
//                     });
//                 }

//                 // Store update info
//                 productUpdates.push({
//                     productId: product._id,
//                     productID: item.productID,
//                     variantID: item.variantID,
//                     variantIndex, //Index for direct variant access
//                     quantity: item.quantity,
//                     title: item.title
//                 });
//             } else {
//                 // Product without variants
//                 if (product.stock < item.quantity) {
//                     await session.abortTransaction();
//                     return res.status(400).json({
//                         message: `Insufficient stock for "${item.title}". Available: ${product.stock}, Requested: ${item.quantity}`
//                     });
//                 }

//                 // Store update info
//                 productUpdates.push({
//                     productId: product._id,
//                     productID: item.productID,
//                     variantID: null,
//                     quantity: item.quantity,
//                     title: item.title
//                 });
//             }
//         }

//         const orderID = generateOrderID();

//         const orderProducts = parsedProducts.map(item => ({
//             productID: item.productID,
//             variantID: item.variantID || null,
//             brandSlug: item.brandSlug,
//             title: item.title,
//             slug: item.slug,
//             mainImageURL: item.mainImageURL,
//             variantImageURL: item.variantImageURL || null,
//             quantity: item.quantity,
//             price: item.price,
//             comparedPrice: item.comparedPrice,
//             selectedOptions: item.selectedOptions || [],
//             reviewed: false
//         }));

//         // Create order
//         const newOrder = new ordersModel({
//             orderID,
//             userID,
//             sellerID,
//             totalAmount: parseFloat(totalAmount) || 0,
//             coupon: coupon || null,
//             discountAmount: parseFloat(discountAmount) || 0,
//             deliveryCharges: parseFloat(deliveryCharges) || 0,
//             finalAmount: parseFloat(finalAmount) || 0,
//             shippingDetails: parsedShippingDetails,
//             products: orderProducts,
//             paymentMethod,
//             status: "pending",
//             paymentStatus: paymentStatus || "pending",
//             paymentDetails: paymentMethod === "online" ? {
//                 gateway: gateway,
//                 transactionID: transactionID,
//                 transactionSS: `/uploads/${req.file.filename}`
//             } : {}
//         });

//         const savedOrder = await newOrder.save({ session });

//         const newPayment = new paymentsModel({
//             orderID,
//             userID,
//             sellerID,
//             amount: parseFloat(finalAmount),
//             paymentMethod,
//             gateway: gateway || null,
//             transactionID: transactionID || null,
//             transactionSS: req.file ? `/uploads/${req.file.filename}` : null,
//             status: paymentStatus || "pending"
//         });

//         await newPayment.save({ session });

//         await authModel.findByIdAndUpdate(userID, { cart: [] }, { new: true, session })

//         // Update stock for all products
//         for (const update of productUpdates) {
//             const product = await productsModel.findById(update.productId).session(session);

//             if (!product) {
//                 await session.abortTransaction();
//                 return res.status(404).json({
//                     message: `Product not found: ${update.title}`
//                 });
//             }

//             if (update.variantID) {
//                 // Update variant stock
//                 const variant = product.variants[update.variantIndex];

//                 if (!variant) {
//                     await session.abortTransaction();
//                     return res.status(404).json({
//                         message: `Variant not found for: ${update.title}`
//                     });
//                 }

//                 // Decrement variant stock
//                 product.variants[update.variantIndex].stock -= update.quantity;

//                 // Ensure variant stock doesn't go negative
//                 if (product.variants[update.variantIndex].stock < 0) {
//                     await session.abortTransaction();
//                     return res.status(400).json({
//                         message: `Stock update failed for: ${update.title}`
//                     });
//                 }

//                 // Recalculate total product stock (sum of all variant stocks)
//                 product.stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
//             } else {
//                 // Update base product stock
//                 product.stock -= update.quantity;

//                 // Ensure stock doesn't go negative
//                 if (product.stock < 0) {
//                     await session.abortTransaction();
//                     return res.status(400).json({ message: `Stock update failed for: ${update.title}` });
//                 }
//             }

//             // Increment sold count
//             product.sold = (product.sold || 0) + update.quantity;

//             // Save updated product
//             await product.save({ session });
//         }

//         await session.commitTransaction();

//         res.status(201).json({ message: "Order placed successfully!", orderID, order: savedOrder });
//     } catch (error) {
//         await session.abortTransaction();
//         console.error("Order placement error:", error.message);
//         res.status(500).json({ message: "Something went wrong. Please try again", error: error.message });
//     } finally {
//         session.endSession();
//     }
// });

// original
/*
router.post("/place-order", upload.single("transactionSS"), async (req, res) => {
    try {
        const {
            userID, sellerID, totalAmount, coupon, discountAmount, deliveryCharges, finalAmount,
            shippingDetails, products, paymentMethod, gateway, transactionID, paymentStatus,
            isGuestOrder
        } = req.body;

        if (!userID || !sellerID || !finalAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (paymentMethod === "online" && !gateway) {
            return res.status(400).json({ message: "Gateway required for online payment" });
        }

        if (paymentMethod === "online" && !transactionID) {
            return res.status(400).json({ message: "Transaction ID required for online payment" });
        }

        if (paymentMethod === "online" && !req.file) {
            return res.status(400).json({ message: "Transaction screenshot required for online payment" });
        }

        const parsedProducts = typeof products === "string" ? JSON.parse(products) : products;
        const parsedShippingDetails = typeof shippingDetails === "string" ? JSON.parse(shippingDetails) : shippingDetails;

        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
            return res.status(400).json({ message: "Invalid products data" });
        }

        const requiredShippingFields = ['fullName', 'email', 'phoneNumber', 'province', 'city', 'place', 'address'];
        const missingFields = requiredShippingFields.filter(field => !parsedShippingDetails[field]?.trim());

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing shipping details: ${missingFields.join(', ')}` });
        }

        const productUpdates = [];

        for (const item of parsedProducts) {
            if (!item.productID || !item.quantity) {
                return res.status(400).json({ message: "Invalid product in cart" });
            }

            const product = await productsModel.findOne({ productID: item.productID });

            if (!product) {
                return res.status(404).json({ message: `Product "${item.title}" not found` });
            }

            if (item.variantID) {
                const variantIndex = product.variants.findIndex(v => v.id === item.variantID);

                if (variantIndex === -1) {
                    return res.status(404).json({
                        message: `Variant not found for "${item.title}"`
                    });
                }

                const variant = product.variants[variantIndex];

                if (variant.stock < item.quantity) {
                    const variantDesc = item.selectedOptions?.map(o => o.optionValue).join(', ') || 'Unknown variant';
                    return res.status(400).json({
                        message: `Insufficient stock for "${item.title}" - ${variantDesc}. Available: ${variant.stock}, Requested: ${item.quantity}`
                    });
                }

                productUpdates.push({
                    productId: product._id,
                    variantID: item.variantID,
                    variantIndex,
                    quantity: item.quantity,
                    title: item.title
                });

            } else {
                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient stock for "${item.title}". Available: ${product.stock}, Requested: ${item.quantity}`
                    });
                }

                productUpdates.push({
                    productId: product._id,
                    variantID: null,
                    quantity: item.quantity,
                    title: item.title
                });
            }
        }

        const orderID = generateOrderID();

        const orderProducts = parsedProducts.map(item => ({
            productID: item.productID,
            variantID: item.variantID || null,
            brandSlug: item.brandSlug,
            title: item.title,
            slug: item.slug,
            mainImageURL: item.mainImageURL,
            variantImageURL: item.variantImageURL || null,
            quantity: item.quantity,
            price: item.price,
            comparedPrice: item.comparedPrice,
            selectedOptions: item.selectedOptions || [],
            reviewed: false
        }));

        const orderData = {
            orderID,
            sellerID,
            totalAmount: parseFloat(totalAmount) || 0,
            coupon: coupon || null,
            discountAmount: parseFloat(discountAmount) || 0,
            deliveryCharges: parseFloat(deliveryCharges) || 0,
            finalAmount: parseFloat(finalAmount) || 0,
            shippingDetails: parsedShippingDetails,
            products: orderProducts,
            paymentMethod,
            status: "pending",
            paymentStatus: paymentStatus || "pending",
            paymentDetails: paymentMethod === "online" ? {
                gateway: gateway,
                transactionID: transactionID,
                transactionSS: req.file ? `/uploads/${req.file.filename}` : null
            } : {}
        };

        if (userID === "guest" || isGuestOrder === "true" || isGuestOrder === true) {
            orderData.userID = null;
            orderData.isGuestOrder = true;
        } else {
            orderData.userID = userID;
            orderData.isGuestOrder = false;
        }

        const newOrder = new ordersModel(orderData);
        const savedOrder = await newOrder.save();

        const paymentData = {
            orderID,
            sellerID,
            amount: parseFloat(finalAmount),
            paymentMethod,
            gateway: gateway || null,
            transactionID: transactionID || null,
            transactionSS: req.file ? `/uploads/${req.file.filename}` : null,
            status: paymentStatus || "pending"
        };

        if (userID === "guest" || isGuestOrder === "true" || isGuestOrder === true) {
            paymentData.userID = null;
            paymentData.isGuestPayment = true;
        } else {
            paymentData.userID = userID;
            paymentData.isGuestPayment = false;
        }

        const newPayment = new paymentsModel(paymentData);
        await newPayment.save();

        if (userID !== "guest" && !(isGuestOrder === "true" || isGuestOrder === true)) {
            await authModel.findByIdAndUpdate(userID, { cart: [] }, { new: true });
        }

        for (const update of productUpdates) {
            const product = await productsModel.findById(update.productId);

            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${update.title}`
                });
            }

            if (update.variantID) {
                const variant = product.variants[update.variantIndex];

                if (!variant) {
                    return res.status(404).json({
                        message: `Variant not found for: ${update.title}`
                    });
                }

                product.variants[update.variantIndex].stock -= update.quantity;

                if (product.variants[update.variantIndex].stock < 0) {
                    return res.status(400).json({
                        message: `Stock update failed for: ${update.title}`
                    });
                }

                product.stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
            } else {
                product.stock -= update.quantity;

                if (product.stock < 0) {
                    return res.status(400).json({
                        message: `Stock update failed for: ${update.title}`
                    });
                }
            }

            product.sold = (product.sold || 0) + update.quantity;

            await product.save();
        }

        res.status(201).json({
            message: "Order placed successfully!",
            orderID,
            order: savedOrder,
            isGuestOrder: userID === "guest" || isGuestOrder === "true" || isGuestOrder === true
        });

    } catch (error) {
        console.error("Order placement error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again", error: error.message });
    }
});
*/

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const upload = require("../middleware/multer");           // multer middleware (writes local file)
const authModel = require("../models/auth");
const productsModel = require("../models/products");
const ordersModel = require("../models/orders");
const paymentsModel = require("../models/payments");
const uploadToFTP = require("../middleware/uploadToFTP"); // should be async and return uploaded file URL

const generateOrderID = () => {
    return String(Math.floor(10000000 + Math.random() * 90000000));
};

router.post("/place-order", upload.single("transactionSS"), async (req, res) => {
    try {
        const {
            userID, sellerID, totalAmount, coupon, discountAmount, deliveryCharges, finalAmount,
            shippingDetails, products, paymentMethod, gateway, transactionID, paymentStatus,
            isGuestOrder
        } = req.body;

        if (!userID || !sellerID || !finalAmount) {
            // cleanup local file if exists
            if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (paymentMethod === "online" && !gateway) {
            if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
            return res.status(400).json({ message: "Gateway required for online payment" });
        }

        if (paymentMethod === "online" && !transactionID) {
            if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
            return res.status(400).json({ message: "Transaction ID required for online payment" });
        }

        if (paymentMethod === "online" && !req.file) {
            return res.status(400).json({ message: "Transaction screenshot required for online payment" });
        }

        const parsedProducts = typeof products === "string" ? JSON.parse(products) : products;
        const parsedShippingDetails = typeof shippingDetails === "string" ? JSON.parse(shippingDetails) : shippingDetails;

        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
            if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
            return res.status(400).json({ message: "Invalid products data" });
        }

        const requiredShippingFields = ['fullName', 'email', 'phoneNumber', 'province', 'city', 'place', 'address'];
        const missingFields = requiredShippingFields.filter(field => !parsedShippingDetails[field]?.trim());

        if (missingFields.length > 0) {
            if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
            return res.status(400).json({ message: `Missing shipping details: ${missingFields.join(', ')}` });
        }

        const productUpdates = [];

        for (const item of parsedProducts) {
            if (!item.productID || !item.quantity) {
                if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
                return res.status(400).json({ message: "Invalid product in cart" });
            }

            const product = await productsModel.findOne({ productID: item.productID });

            if (!product) {
                if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
                return res.status(404).json({ message: `Product "${item.title}" not found` });
            }

            if (item.variantID) {
                const variantIndex = product.variants.findIndex(v => v.id === item.variantID);

                if (variantIndex === -1) {
                    if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
                    return res.status(404).json({
                        message: `Variant not found for "${item.title}"`
                    });
                }

                const variant = product.variants[variantIndex];

                if (variant.stock < item.quantity) {
                    if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
                    const variantDesc = item.selectedOptions?.map(o => o.optionValue).join(', ') || 'Unknown variant';
                    return res.status(400).json({
                        message: `Insufficient stock for "${item.title}" - ${variantDesc}. Available: ${variant.stock}, Requested: ${item.quantity}`
                    });
                }

                productUpdates.push({
                    productId: product._id,
                    variantID: item.variantID,
                    variantIndex,
                    quantity: item.quantity,
                    title: item.title
                });

            } else {
                if (product.stock < item.quantity) {
                    if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
                    return res.status(400).json({
                        message: `Insufficient stock for "${item.title}". Available: ${product.stock}, Requested: ${item.quantity}`
                    });
                }

                productUpdates.push({
                    productId: product._id,
                    variantID: null,
                    quantity: item.quantity,
                    title: item.title
                });
            }
        }

        // Upload file to FTP (if present) and get the URL
        let ftpUrl = null;
        if (req.file) {
            const localPath = req.file.path || path.join("uploads", req.file.filename);
            try {
                // uploadToFTP must be an async function that accepts local path and returns remote URL
                ftpUrl = await uploadToFTP(localPath);
            } catch (err) {
                // cleanup local file if upload failed
                await fs.promises.unlink(localPath).catch(() => {});
                console.error("FTP upload failed:", err);
                return res.status(500).json({ message: "Failed to upload transaction screenshot to FTP", error: err.message || err });
            }

            // delete local file after successful upload (optional but recommended)
            await fs.promises.unlink(localPath).catch(() => {});
        }

        const orderID = generateOrderID();

        const orderProducts = parsedProducts.map(item => ({
            productID: item.productID,
            variantID: item.variantID || null,
            brandSlug: item.brandSlug,
            title: item.title,
            slug: item.slug,
            mainImageURL: item.mainImageURL,
            variantImageURL: item.variantImageURL || null,
            quantity: item.quantity,
            price: item.price,
            comparedPrice: item.comparedPrice,
            selectedOptions: item.selectedOptions || [],
            reviewed: false
        }));

        const orderData = {
            orderID,
            sellerID,
            totalAmount: parseFloat(totalAmount) || 0,
            coupon: coupon || null,
            discountAmount: parseFloat(discountAmount) || 0,
            deliveryCharges: parseFloat(deliveryCharges) || 0,
            finalAmount: parseFloat(finalAmount) || 0,
            shippingDetails: parsedShippingDetails,
            products: orderProducts,
            paymentMethod,
            status: "pending",
            paymentStatus: paymentStatus || "pending",
            paymentDetails: paymentMethod === "online" ? {
                gateway: gateway,
                transactionID: transactionID,
                transactionSS: ftpUrl || null
            } : {}
        };

        if (userID === "guest" || isGuestOrder === "true" || isGuestOrder === true) {
            orderData.userID = null;
            orderData.isGuestOrder = true;
        } else {
            orderData.userID = userID;
            orderData.isGuestOrder = false;
        }

        const newOrder = new ordersModel(orderData);
        const savedOrder = await newOrder.save();

        const paymentData = {
            orderID,
            sellerID,
            amount: parseFloat(finalAmount),
            paymentMethod,
            gateway: gateway || null,
            transactionID: transactionID || null,
            transactionSS: ftpUrl || null,
            status: paymentStatus || "pending"
        };

        if (userID === "guest" || isGuestOrder === "true" || isGuestOrder === true) {
            paymentData.userID = null;
            paymentData.isGuestPayment = true;
        } else {
            paymentData.userID = userID;
            paymentData.isGuestPayment = false;
        }

        const newPayment = new paymentsModel(paymentData);
        await newPayment.save();

        if (userID !== "guest" && !(isGuestOrder === "true" || isGuestOrder === true)) {
            await authModel.findByIdAndUpdate(userID, { cart: [] }, { new: true });
        }

        for (const update of productUpdates) {
            const product = await productsModel.findById(update.productId);

            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${update.title}`
                });
            }

            if (update.variantID) {
                const variant = product.variants[update.variantIndex];

                if (!variant) {
                    return res.status(404).json({
                        message: `Variant not found for: ${update.title}`
                    });
                }

                product.variants[update.variantIndex].stock -= update.quantity;

                if (product.variants[update.variantIndex].stock < 0) {
                    return res.status(400).json({
                        message: `Stock update failed for: ${update.title}`
                    });
                }

                product.stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
            } else {
                product.stock -= update.quantity;

                if (product.stock < 0) {
                    return res.status(400).json({
                        message: `Stock update failed for: ${update.title}`
                    });
                }
            }

            product.sold = (product.sold || 0) + update.quantity;

            await product.save();
        }

        res.status(201).json({
            message: "Order placed successfully!",
            orderID,
            order: savedOrder,
            isGuestOrder: userID === "guest" || isGuestOrder === "true" || isGuestOrder === true
        });

    } catch (error) {
        console.error("Order placement error:", error);
        // Attempt to clean up uploaded local file if present
        if (req.file?.path) {
            await fs.promises.unlink(req.file.path).catch(() => {});
        }
        res.status(500).json({ message: "Something went wrong. Please try again", error: error.message });
    }
});



module.exports = router