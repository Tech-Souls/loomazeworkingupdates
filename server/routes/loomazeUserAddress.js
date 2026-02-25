const express = require("express");
const router = express.Router();

const userModel = require("../models/users");

router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { province, city, address, place } = req.body;

        await userModel.findByIdAndUpdate(id, { province, city, address, place }, { new: true });

        res.json({ message: "Address updated successfully!" });
    } catch (error) {
        console.error("Update address error:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

module.exports = router