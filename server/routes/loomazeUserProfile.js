const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const userModel = require("../models/users");

router.put("/update-information/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phoneNumber, dob, gender } = req.body;

        const userFound = await userModel.findOne({ email, _id: { $ne: id } });
        if (userFound) return res.status(400).json({ message: "Email already exists!" });

        const updatedUser = await userModel.findByIdAndUpdate(id, { firstName, lastName, email, phoneNumber, dob, gender }, { new: true })

        res.json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
});

router.put("/change-password/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const user = await userModel.findById(id);
        if (!user) return res.status(400).json({ message: "User not found" });

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch) return res.status(400).json({ message: "Old password doesn't match" })

        if (newPassword.trim().length < 6) return res.status(400).json({ message: "Password must be atleast 6 characters long." })
        if (newPassword.trim() !== confirmPassword.trim()) return res.status(400).json({ message: "New password and confirm password does not match!" })
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })

        res.json({ message: "Password changed successfully" })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again" });
    }
})

module.exports = router