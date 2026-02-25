const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const settingsModel = require("../models/settings");
const ordersModel = require("../models/orders");
const productsModel = require("../models/products");
const paymentModel = require("../models/payments");

router.get("/fetch-order", async (req, res) => {
    try {
        const { sellerID, orderID } = req.query

        const order = await ordersModel.findOne({ orderID, sellerID }).populate("userID")
        const settingsContent = await settingsModel.findOne({ sellerID }).select("content.currency")

        const payment = await paymentModel.findOne({ orderID });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order fetched', order, payment, currency: settingsContent.content.currency })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});
/*
router.put("/update-status", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { sellerID, orderID, status } = req.body

        const order = await ordersModel.findOne({ orderID, sellerID }).session(session);

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Order not found' });
        }

        const isCancelOrReturn = status === "cancelled" || status === "returned";
        const wasCancelOrReturn = order.status === "cancelled" || order.status === "returned";

        // Restore stock if order now being cancelled/returned for the first time
        const shouldRestoreStock = isCancelOrReturn && !wasCancelOrReturn;

        // Deduct stock again if order was cancelled/returned before but is now reactivated
        const shouldDeductStock = !isCancelOrReturn && wasCancelOrReturn;

        if (Array.isArray(order.products)) {
            for (const item of order.products) {
                const product = await productsModel.findOne({ productID: item.productID }).session(session);

                if (!product) continue;

                const isVariantOrder = item.variantID && product.variants?.length > 0;

                if (isVariantOrder) {
                    // Find correct variant
                    const variantIndex = product.variants.findIndex(v => v.id === item.variantID);

                    if (variantIndex !== -1) {
                        if (shouldRestoreStock) {
                            product.variants[variantIndex].stock += item.quantity;
                            product.sold -= item.quantity; // Update MAIN sold
                        }
                        else if (shouldDeductStock) {
                            product.variants[variantIndex].stock -= item.quantity;
                            product.sold += item.quantity; // Update MAIN sold
                        }
                    }
                }
                else {
                    // Product without variants
                    if (shouldRestoreStock) {
                        product.stock += item.quantity;
                        product.sold -= item.quantity;
                    }
                    else if (shouldDeductStock) {
                        product.stock -= item.quantity;
                        product.sold += item.quantity;
                    }
                }

                await product.save({ session });
            }
        }

        order.status = status;
        await order.save({ session });

        await session.commitTransaction();
        res.status(202).json({ message: 'Order status updated', order })
    }
    catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message })
    } finally {
        session.endSession();
    }
});
*/
router.put("/update-status", async (req, res) => {
    try {
        const { sellerID, orderID, status } = req.body

        const order = await ordersModel.findOne({ orderID, sellerID });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isCancelOrReturn = status === "cancelled" || status === "returned";
        const wasCancelOrReturn = order.status === "cancelled" || order.status === "returned";

        // Restore stock if order now being cancelled/returned for the first time
        const shouldRestoreStock = isCancelOrReturn && !wasCancelOrReturn;

        // Deduct stock again if order was cancelled/returned before but is now reactivated
        const shouldDeductStock = !isCancelOrReturn && wasCancelOrReturn;

        if (Array.isArray(order.products)) {
            for (const item of order.products) {
                const product = await productsModel.findOne({ productID: item.productID });

                if (!product) continue;

                const isVariantOrder = item.variantID && product.variants?.length > 0;

                if (isVariantOrder) {
                    // Find correct variant
                    const variantIndex = product.variants.findIndex(v => v.id === item.variantID);

                    if (variantIndex !== -1) {
                        if (shouldRestoreStock) {
                            product.variants[variantIndex].stock += item.quantity;
                            product.sold -= item.quantity; // Update MAIN sold
                        }
                        else if (shouldDeductStock) {
                            product.variants[variantIndex].stock -= item.quantity;
                            product.sold += item.quantity; // Update MAIN sold
                        }
                    }
                }
                else {
                    // Product without variants
                    if (shouldRestoreStock) {
                        product.stock += item.quantity;
                        product.sold -= item.quantity;
                    }
                    else if (shouldDeductStock) {
                        product.stock -= item.quantity;
                        product.sold += item.quantity;
                    }
                }

                await product.save();
            }
        }

        order.status = status;
        await order.save();

        res.status(202).json({ message: 'Order status updated', order })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router