const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")

const sellersModel = require("../models/sellers");
const settingsModel = require("../models/settings");

router.patch("/update/:userID", async (req, res) => {
    try {
        const { userID } = req.params
        const state = req.body

        const user = await sellersModel.findOne({ userID })
        if (!user) {
            return res.status(404).json({ message: 'Seller not found!' })
        }

        const { brandName, username, fullname, email, cnic } = state

        if (!brandName || !username || !fullname || !email || !cnic) {
            return res.status(400).json({ message: "All fields with * are required!" });
        }

        const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
        let brandSlug = user.brandSlug;

        if (brandName !== user.brandName) {
            const newSlug = slugify(brandName);

            const existingBrand = await sellersModel.findOne({
                $or: [{ brandName }, { brandSlug: newSlug }],
                userID: { $ne: userID },
            });

            if (existingBrand) {
                return res.status(400).json({ message: "This brand name is already taken!" });
            }

            brandSlug = newSlug;
        }

        if (username !== user.username) {
            const existingUsername = await sellersModel.findOne({
                username,
                userID: { $ne: userID }
            });
            if (existingUsername) {
                return res.status(400).json({ message: "This username is already taken!" });
            }
        }

        if (email !== user.email) {
            const existingEmail = await sellersModel.findOne({
                email,
                userID: { $ne: userID }
            });
            if (existingEmail) {
                return res.status(400).json({ message: "This email is already registered!" });
            }
        }

        const updatedSellerData = {
            ...state,
            brandSlug,
        }

        const updatedUser = await sellersModel.findOneAndUpdate({ userID }, updatedSellerData, { new: true })
        if (brandName !== user.brandName) {
            await settingsModel.findOneAndUpdate({ sellerID: user._id }, { $set: { brandName, brandSlug } }, { new: true });
        }

        res.status(202).json({ message: 'Changes saved successfully!', updatedUser })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.patch("/change-password/:userID", async (req, res) => {
    try {
        const { userID } = req.params
        const { currentPassword, newPassword, confirmNewPassword } = req.body

        const user = await sellersModel.findOne({ userID })
        if (!user) {
            return res.status(404).json({ message: 'Seller not found!' })
        }

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "All fields with * are required!" });
        }

        const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
        if (!isCurrentPasswordCorrect) {
            return res.status(400).json({ message: 'Current password is incorrect!' })
        }

        if (newPassword === currentPassword) {
            return res.status(400).json({ message: 'New password must be different from current password!' })
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'New password and Confirm New Password must be same!' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await sellersModel.findOneAndUpdate({ userID }, { $set: { password: hashedPassword } }, { new: true })

        res.status(202).json({ message: 'Password updated successfully!' })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;