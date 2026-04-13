const express = require("express");
const router = express.Router();

const settingsModel = require("../models/settings");
const ordersModel = require("../models/orders");
const paymentsModel = require("../models/payments");

router.get("/fetch-settings", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const settings = await settingsModel.findOne({ sellerID })

        res.status(200).json({ message: 'Seller settings fetched', settings })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get("/get-overview-data", async (req, res) => {
    try {
        const { sellerID } = req.query
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        const completedOrders = await ordersModel.countDocuments({ sellerID, status: "delivered" })
        const pendingOrders = await ordersModel.countDocuments({ sellerID, status: { $in: ["pending", "processing", "shipped"] } })
        const completedPayments = await paymentsModel.find({ sellerID, status: "paid" })
        const pendingPayments = await paymentsModel.find({ sellerID, status: { $in: ["pending", "processing"] } })

        const completedSalesAmount = completedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
        const pendingSalesAmount = pendingPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)


        const overviewData = {
            orders: {
                completedOrders,
                pendingOrders
            },
            sales: {
                completedSales: completedSalesAmount,
                pendingSales: pendingSalesAmount,
            }
        }

        res.status(200).json({ message: 'Overview data fetched', overviewData })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get("/get-available-months", async (req, res) => {
    try {
        const { sellerID } = req.query;
        if (!sellerID) return res.status(400).json({ message: "sellerID is required" });

        // Convert sellerID to ObjectId if needed
        const mongoose = require('mongoose');
        const sellerObjectId = mongoose.Types.ObjectId.isValid(sellerID)
            ? new mongoose.Types.ObjectId(sellerID)
            : sellerID;

        // Get seller's first order date
        const firstOrder = await ordersModel.findOne({ sellerID: sellerObjectId }).sort({ createdAt: 1 });

        if (!firstOrder) {
            // If no orders, return current month only
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const monthName = currentDate.toLocaleString('default', { month: 'long' });

            return res.status(200).json({
                message: 'Available months fetched',
                availableMonths: [{
                    value: `${year}-${month + 1}`,
                    label: `${monthName} ${year}`
                }]
            });
        }

        const startDate = new Date(firstOrder.createdAt);
        const currentDate = new Date();
        const availableMonths = [];

        let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        while (current <= currentDate) {
            const year = current.getFullYear();
            const month = current.getMonth();
            const monthName = current.toLocaleString('default', { month: 'long' });

            availableMonths.push({
                value: `${year}-${(month + 1).toString().padStart(2, '0')}`,
                label: `${monthName} ${year}`
            });

            // Move to next month
            current.setMonth(current.getMonth() + 1);
        }

        // Reverse to show most recent first
        availableMonths.reverse();

        res.status(200).json({ message: 'Available months fetched', availableMonths });
    } catch (error) {
        console.error('Error in get-available-months:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/get-orders-chart-data", async (req, res) => {
    try {
        const { sellerID, month } = req.query;
        if (!sellerID || !month) {
            return res.status(400).json({ message: "sellerID and month are required" });
        }

        const mongoose = require('mongoose');
        const sellerObjectId = mongoose.Types.ObjectId.isValid(sellerID)
            ? new mongoose.Types.ObjectId(sellerID)
            : sellerID;

        const [year, monthNum] = month.split('-').map(Number);

        const startDate = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

        // FIX: Use simpler approach without UTC timezone in aggregation
        const ordersData = await ordersModel.aggregate([
            {
                $match: {
                    sellerID: sellerObjectId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.day": 1 }
            }
        ]);

        // Generate all days in the month
        const chartData = [];
        const daysInMonth = new Date(year, monthNum, 0).getDate();

        // Create a map for faster lookup
        const ordersMap = {};
        ordersData.forEach(item => {
            ordersMap[item._id.day] = item.count;
        });

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, monthNum - 1, day);
            const dateString = currentDate.toISOString().split('T')[0];

            chartData.push({
                date: dateString,
                day: day,
                orders: ordersMap[day] || 0,
                fullDate: currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })
            });
        }

        res.status(200).json({ message: 'Chart data fetched', chartData });
    } catch (error) {
        console.error('Error in get-orders-chart-data:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router