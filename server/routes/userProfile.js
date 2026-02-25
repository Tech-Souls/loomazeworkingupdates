const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const authModel = require("../models/auth");

router.put("/update-information/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phoneNumber, dob, gender, brandSlug } = req.body;

        // Get the current user
        const currentUser = await authModel.findById(id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Use the brandSlug from request or from current user
        const targetBrandSlug = brandSlug || currentUser.brandSlug;

        // Check for duplicates ONLY within the same brand
        const duplicateCheck = {
            brandSlug: targetBrandSlug,
            _id: { $ne: id }
        };

        // Check if username is changing and if it already exists
        if (username && username !== currentUser.username) {
            const usernameExists = await authModel.findOne({
                ...duplicateCheck,
                username: username
            });

            if (usernameExists) {
                return res.status(400).json({ message: "Username already exists in this brand!" });
            }
        }

        // Check if email is changing and if it already exists
        if (email && email !== currentUser.email) {
            const emailExists = await authModel.findOne({
                ...duplicateCheck,
                email: email
            });

            if (emailExists) {
                return res.status(400).json({ message: "Email already exists in this brand!" });
            }
        }

        // Update the user
        const updatedUser = await authModel.findByIdAndUpdate(
            id,
            { username, email, phoneNumber, dob, gender },
            { new: true }
        );

        res.json({
            message: "Profile updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update information error:", error);
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

router.put("/change-password/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const user = await authModel.findById(id);
        if (!user) return res.status(400).json({ message: "User not found!" });

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch) return res.status(400).json({ message: "Old password does not match!" });

        if (newPassword.trim().length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long!" });
        if (newPassword.trim() !== confirmPassword.trim()) return res.status(400).json({ message: "New password and confirm password does not match!" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await authModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })

        res.json({ message: "Password changed successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

module.exports = router