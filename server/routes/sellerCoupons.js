const express = require("express");
const router = express.Router();

const couponsModel = require("../models/coupons");

router.get("/all", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const coupons = await couponsModel.find({ sellerID }).sort({ createdAt: -1 })

        res.status(200).json({ message: 'Coupons fetched', coupons })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        if (!data.sellerID || !data.code || !data.type || !data.value) return res.status(400).json({ message: "Missing required fields" })
        data.code = data.code.trim()

        const isFound = await couponsModel.findOne({ sellerID: data.sellerID, code: data.code })
        if (isFound) return res.status(400).json({ message: "Coupons already exists" })

        const newCoupon = new couponsModel(data);
        await newCoupon.save();

        res.status(201).json({ message: "Coupon created successfully!", coupon: newCoupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/toggle-status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await couponsModel.findById(id);

        coupon.status = coupon.status === 'active' ? 'inactive' : 'active';
        await coupon.save();

        res.status(202).json({ message: `Coupon ${coupon.status === 'active' ? 'activated' : 'deactivated'} successfully`, coupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await couponsModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Coupon deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router