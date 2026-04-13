const express = require("express");
const router = express.Router();

const couponsModel = require("../models/coupons");

router.get("/all/:sellerID", async (req, res) => {
    try {
        const { sellerID } = req.params;
        const coupons = await couponsModel.find({ sellerID, status: "active" }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, coupons });
    } catch (err) {
        console.error("Get coupons error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/verify-coupon", async (req, res) => {
    try {
        const { sellerID, code, amount } = req.body;

        const coupon = await couponsModel.findOne({ sellerID, code, status: "active" });
        if (!coupon) return res.status(404).json({ success: false, message: "Invalid or inactive coupon" });

        if (amount < coupon.minOrderValue) {
            return res.status(400).json({ success: false, message: `Minimum order value should be ${coupon.minOrderValue} to apply this coupon` });
        }

        return res.status(200).json({ success: true, coupon });
    } catch (err) {
        console.error("Coupon verify error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;