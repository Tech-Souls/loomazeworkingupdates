const express = require("express");
const router = express.Router();

const authModel = require("../models/auth");

router.patch("/update-quantity", async (req, res) => {
    try {
        const { userID, productID, variantID, action } = req.body;

        if (!userID || !productID || !action)
            return res.status(400).json({ message: "userID, productID, and action are required" });

        const user = await authModel.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const cartItem = user.cart.find(item => {
            // For products without variants
            if (!variantID && !item.variantID) {
                return item.productID === productID;
            }
            // For products with variants
            return item.productID === productID && item.variantID === variantID;
        });

        if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

        if (action === "increment") {
            cartItem.quantity += 1;
        } else if (action === "decrement") {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                return res.status(400).json({ message: "Minimum quantity is 1" });
            }
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        await user.save();

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/remove-from-cart", async (req, res) => {
    try {
        const { userID, productID, variantID } = req.query
        if (!userID) return res.status(400).json({ message: "userID is required" });
        if (!productID) return res.status(400).json({ message: "productID is required" });

        const user = await authModel.findById(userID)
        if (!user) return res.status(404).json({ message: "User is not found" });

        const prevLength = user.cart.length;

        user.cart = user.cart.filter(item => {
            // For products without variants
            if (!variantID && variantID !== "null" && variantID !== "undefined") {
                return !(item.productID === productID && !item.variantID);
            }
            // For products with variants
            return !(item.productID === productID && item.variantID === variantID);
        });

        if (user.cart.length === prevLength) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await user.save();

        res.status(203).json({ message: "Product removed from shopping cart!", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router