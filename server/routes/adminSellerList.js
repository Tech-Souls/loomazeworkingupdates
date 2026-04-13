const express = require("express");
const router = express.Router();
const dayjs = require("dayjs")

const sellersModel = require("../models/sellers");

router.get("/all", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const sellers = await sellersModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalSellers = await sellersModel.countDocuments()

        res.status(200).json({ message: 'Sellers fetched', sellers, totalSellers })
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

        const searchedSellers = await sellersModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalSearchedSellers = await sellersModel.countDocuments(query)

        res.status(200).json({ message: 'Sellers searched', searchedSellers, totalSearchedSellers })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.put("/update-status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const seller = await sellersModel.findById(id)

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        if (seller.status === status) {
            return res.status(200).json({ message: "Seller already has this status" });
        }

        if (status === "approved") {
            const now = dayjs();
            const trialEnds = now.add(3, 'day');

            seller.status = status;
            seller.planDetails.trialStarts = now.toISOString();
            seller.planDetails.trialEnds = trialEnds.toISOString();
        } else {
            seller.status = status
        }

        await seller.save()

        res.status(202).json({ message: "Seller status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await sellersModel.findByIdAndDelete(id);

        res.status(203).json({ message: "Seller deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router