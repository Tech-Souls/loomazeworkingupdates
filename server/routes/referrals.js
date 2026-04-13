const express = require("express");
const router = express.Router();
const Referral = require("../models/referral");
const ReferralEarning = require("../models/referralEarning");
const sellersModel = require("../models/sellers");
const { verifySeller, verifyUserToken } = require("../middleware/auth");
const { processSellerApproval } = require("../services/referral");

router.get("/user", verifyUserToken, async (req, res) => {
  try {
    const userId = req.userId;
    console.log("User ID from token:", userId);
    const referrals = await Referral.find({
      "referrer.id": userId,
      "referrer.type": "users",
    })
      .populate({
        path: "seller",
        select: "brandNamen status createdAt",
        match: { status: { $in: ["pending", "approved"] } },
      })
      .lean();
    const earnings = await ReferralEarning.find({
      "referrer.id": userId,
      "referrer.type": "users",
    })
      .populate({
        path: "seller",
        select: "brandNamen status createdAt",
        match: { status: { $in: ["pending", "approved"] } },
      })
      .lean();

    const cleanSellers = referrals.filter((r) => r.seller !== null);
    const cleanEarnings = earnings.filter((e) => e.seller !== null);

    const totalEarned = cleanEarnings.reduce((s, e) => s + (e.amount || 0), 0);
    const pending = cleanEarnings
      .filter((e) => e.status === "pending")
      .reduce((s, e) => s + (e.amount || 0), 0);
    const activeSellers = cleanSellers.filter(
      (r) => r.seller && r.seller.status === "approved",
    ).length;
    const sellers = cleanSellers.map((r) => ({
      brand: r.seller.brandName || "Deleted Seller",
      joinedAt: r.joinedAt,
      status: r.seller?.status || r.status,
    }));

    console.log("Clean Sellers:", cleanSellers);
    console.log("Clean Earnings:", cleanEarnings);

    /*
    const totalPending = cleanEarnings
  .filter((e) => e.status === "pending")
  .reduce((s, e) => s + e.amount, 0);

const available = cleanEarnings
  .filter((e) => e.status === "available")
  .reduce((s, e) => s + e.amount, 0);

const paid = cleanEarnings
  .filter((e) => e.status === "paid")
  .reduce((s, e) => s + e.amount, 0);

const lifetimeEarnings = cleanEarnings
  .filter((e) => ["available", "paid"].includes(e.status))
  .reduce((s, e) => s + e.amount, 0);

    */
   const paid = cleanEarnings
  .filter((e) => e.status === "paid")
  .reduce((s, e) => s + e.amount, 0);

    res.status(200).json({
      referralCode: req.user.referralCode,
      totalReferrals: cleanSellers.length,
      activeSellers,
      totalEarned,
      pending,
      sellers,
      earnings: cleanEarnings,
      paid,
    });
  } catch (error) {
    console.error("user referral error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/seller", verifySeller, async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const referrals = await Referral.find({
      "referrer.id": sellerId,
      "referrer.type": "sellers",
    })
      .populate({
        path: "seller",
        select: "brandName status createdAt",
        match: { status: { $in: ["pending", "approved"] } },
      })
      .lean();

    const earnings = await ReferralEarning.find({
      "referrer.id": sellerId,
      "referrer.type": "sellers",
    })
      .populate({ path: "seller", match: { status: { $ne: "banned" } } })
      .lean();

    const cleanSellers = referrals.filter((r) => r.seller !== null);
    const cleanEarnings = earnings.filter((e) => e.seller !== null);

    const totalEarned = cleanEarnings.reduce((s, e) => s + (e.amount || 0), 0);

    const pending = cleanEarnings
      .filter((e) => e.status === "pending")
      .reduce((s, e) => s + (e.amount || 0), 0);

    const activeSellers = cleanSellers.filter(
      (r) => r.seller.status === "approved",
    ).length;

    const sellers = cleanSellers.map((r) => ({
      brand: r.seller.brandName,
      joinedAt: r.joinedAt,
      status: r.seller.status,
    }));

    res.json({
      referralCode: req.seller.referralCode,
      totalReferrals: cleanSellers.length,
      activeSellers,
      totalEarned,
      pending,
      sellers,
      earnings: cleanEarnings,
    });
  } catch (err) {
    console.error("Error fetching referral data:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/referral/:id/earnings", async (req, res) => {
  try {
    const referralId = req.params.id;
    const earnings = await ReferralEarning.find({ referral: referralId })
      .populate({ path: "seller", select: "brandName, status" })
      .populate({
        path: "referrer.id",
        select: "fullName username brandName referralCode",
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ earnings });
  } catch (err) {
    console.error("Error while fetchinig the referral earnings", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/search", async (req, res) => {
  try {
    const {
      q,
      referrerType,
      startDate,
      endDate,
      page = 1,
      limit = 25,
    } = req.query;
    const filter = {};

    if (referrerType && ["users", "sellers"].includes(referrerType)) {
      filter["referrer.type"] = referrerType;
    }

    if (q) {
      const sellerMatches = await sellersModel
        .find({ brandName: new RegExp(q, "i") })
        .select("_id")
        .lean();
      const sellerIds = sellerMatches.map((s) => s._id);
      filter.$or = [
        { referrerCode: new RegExp(q, "i") },
        { seller: { $in: sellerIds } },
      ];
    }

    if (startDate || endDate) {
      filter.joinedAt = {};
      if (startDate) filter.joinedAt.$gte = new Date(startDate);
      if (endDate) filter.joinedAt.$lte = new Date(endDate);
    }

    const referrals = await Referral.find(filter)
      .populate({ path: "seller", select: "brandName status createdAt" })
      .populate({
        path: "referrer.id",
        select: "fullName email username brandName referralCode",
      })
      .sort({ joinedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalCount = await Referral.countDocuments(filter);

    const referralIds = referrals.map((r) => r._id);
    const earningsFilter = referralIds.length
      ? { referral: { $in: referralIds } }
      : {};
    const earnings = await ReferralEarning.find(earningsFilter).lean();

    const totalEarnings = earnings.reduce((s, e) => s + (e.amount || 0), 0);
    const totalPaid = earnings
      .filter((e) => e.status === "paid")
      .reduce((s, e) => s + (e.amount || 0), 0);
    const totalPending = earnings
      .filter((e) => e.status === "pending")
      .reduce((s, e) => s + (e.amount || 0), 0);

    res.json({
      referrals,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
      },
      stats: { totalEarnings, totalPaid, totalPending },
    });
  } catch (err) {
    console.error("admin referrals search error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/earnings/:id/mark-paid", async (req, res) => {
  try {
    const earningId = req.params.id;
    const adminId = req.admin?._id || null;
    const earning = await ReferralEarning.findById(earningId);
    if (!earning) return res.status(404).json({ message: "Earning not found" });

    if (earning.status === "paid")
      return res.status(400).json({ message: "Already paid" });

    earning.status = "paid";
    earning.paidAt = new Date();
    earning.paidBy = adminId;
    await earning.save();

    res.json({ message: "Marked as paid", earning });
  } catch (err) {
    console.error("mark-paid error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/earnings/:id/mark-available", async (req, res) => {
  try {
    const earningId = req.params.id;
    const adminId = req.admin?._id || null;
    const earning = await ReferralEarning.findById(earningId);
    if (!earning) return res.status(404).json({ message: "Earning not found" });

    if (earning.status === "available")
      return res.status(400).json({ message: "Already paid" });

    earning.status = "available";
    // earning.paidAt = new Date();
    // earning.paidBy = adminId;
    await earning.save();

    res.json({ message: "Marked as available", earning });
  } catch (err) {
    console.error("mark-available error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/earnings/:id/revert", async (req, res) => {
  try {
    const { action = "pending" } = req.body;
    const earningId = req.params.id;
    const earning = await ReferralEarning.findById(earningId);
    if (!earning) return res.status(404).json({ message: "Earning not found" });

    if (action === "pending") {
      earning.status = "pending";
      earning.paidAt = null;
      earning.paidBy = null;
      await earning.save();
      return res.json({ message: "Earning reverted to pending", earning });
    } else if (action === "delete") {
      await ReferralEarning.deleteOne({ _id: earningId });
      return res.json({ message: "Earning deleted" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    console.error("revert earning error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/admin/backfill-signup-earnings", async (req, res) => {
  try {
    const { sellerId } = req.body;

    let processed = 0;
    let created = 0;

    if (sellerId) {
      processed = 1;
      try {
        const result = await processSellerApproval(sellerId);
        if (result) created = 1;
      } catch (e) {
        console.warn("backfill single seller error", e.message || e);
      }
    } else {
      const referrals = await Referral.find({}).select("seller").lean();
      processed = referrals.length;
      for (const r of referrals) {
        try {
          const resEarning = await processSellerApproval(r.seller);
          if (resEarning) created += 1;
        } catch (e) {
          console.warn("backfill skip seller", r.seller, e.message || e);
        }
      }
    }

    res.json({ message: "Backfill complete", processed, created });
  } catch (err) {
    console.error("admin backfill error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
