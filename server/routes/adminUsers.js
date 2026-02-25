const express = require("express");
const router = express.Router();

const userModel = require("../models/users");

router.get("/all", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const users = await userModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalUsers = await userModel.countDocuments()

        res.status(200).json({ message: 'Users fetched', users, totalUsers })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.get("/search", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const searchText = req.query.searchText
        const limit = 20
        const skip = (page - 1) * limit

        const query = {
            $or: [
                { userID: { $regex: searchText, $options: "i" } },
                { username: { $regex: searchText, $options: "i" } },
                { email: { $regex: searchText, $options: "i" } }
            ]
        };

        const searchedUsers = await userModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalSearchedUsers = await userModel.countDocuments(query)

        res.status(200).json({ message: 'Users searched', searchedUsers, totalSearchedUsers })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.put("/update-role/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: "Role is required" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, { role }, { new: true });

        res.status(202).json({ message: "User role updated successfully", updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await userModel.findByIdAndDelete(id);

        res.status(203).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;