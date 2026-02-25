const express = require("express");
const router = express.Router();

const authModel = require("../models/auth");

router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { province, city, address, place } = req.body;

        await authModel.findByIdAndUpdate(id, { province, city, address, place }, { new: true });

        res.json({ message: "Address updated successfully!" });
    } catch (error) {
        console.error("Update address error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

module.exports = router