const express = require("express");
const router = express.Router();
const { verifySeller } = require("../middleware/auth");
const Invoices = require("../models/Invoices");
const Sellers = require("../models/sellers");
const upload = require("../middleware/multer")
const fs = require("fs");
const uploadToFTP = require("../middleware/uploadToFTP");
const Plan = require("../models/plan.models");

// router.post("/submit", verifySeller, upload.single("receipt"), async (req, res) => {
//     try {
//         const { plan, amount } = req.body;
//         const sellerId = req.sellerId;

//         if (!plan || !amount) return res.status(400).json({ message: "Plan and amount are required" });

//         if (!req.file) return res.status(400).json({ message: "Receipt image is required" });

//         if (Number(amount) < 2000) return res.status(400).json({ message: "Minimum amount is 2000" });

//         const receiptUrl = await uploadToFTP(req.file.path);
//         try { fs.unlinkSync(req.file.path); } catch (e) { }

//         const invoice = await Invoices.create({ seller: sellerId, plan, amount: Number(amount), receipt: receiptUrl, paymentStatus: "pending", type: "manual" });
//         return res.status(201).json({ message: "Payment proof submitted. Waiting for admin approval.", invoice });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to submit payment" });
//     }
// });

// replace your existing /submit route with this


// const PLAN_PRICES = {
//   Basic: 2000,
//   Grow: 4000,
// };
// const PLAN_ORDER = {
//   Basic: 1,
//   Grow: 2,
// };

const fetchPlansFromDB = async () => {
  const plans = await Plan.find({ isActive: true })
    .select("name price durationDays referralBonusPercent signUpBonusPercent")
    .sort({ price: 1 })
    .lean();

  return plans.map((p) => ({
    ...p,
    name: p.name.toLowerCase(),
  }));
};

router.post("/submit", verifySeller, upload.single("receipt"), async (req, res) => {
  let   PLAN_PRICES = {};
  let   PLAN_ORDER = {};
  const fetchedPlans = await fetchPlansFromDB(); // fetch from DB
    console.log("Available plans for validation:", fetchedPlans);
    PLAN_PRICES = fetchedPlans.reduce((acc, p) => {
      acc[p.name] = Number(p.price);
      return acc;
    }, {});
    const sortedPlans = [...fetchedPlans].sort((a, b) => a.price - b.price);
    PLAN_ORDER = sortedPlans.reduce((acc, p, idx) => {
      acc[p.name] = idx + 1;
      return acc;
    }, {});
    console.log("PLAN_PRICES:", PLAN_PRICES);
    console.log("PLAN_ORDER:", PLAN_ORDER);

    try {
    const { plan, amount } = req.body;
    const sellerId = req.sellerId;
    const isExtend = String(req.query.extend || "false").toLowerCase() === "true";

    // Basic validation
    if (!plan || !amount) return res.status(400).json({ message: "Plan and amount are required" });
    if (!req.file) return res.status(400).json({ message: "Receipt image is required" });

    // Validate plan price (prevent underpay)
    const expectedPrice = PLAN_PRICES[plan];
    if (!expectedPrice) return res.status(400).json({ message: "Invalid plan" });
    if (Number(amount) !== expectedPrice) {
      return res.status(400).json({ message: `Invalid amount. Expected ${expectedPrice}` });
    }

    if (Number(amount) < 2000) return res.status(400).json({ message: "Minimum amount is 2000" });

    // Fetch seller to attach previous plan and do extra checks
    const seller = await Sellers.findById(sellerId).lean();
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    // If extend flag is true, we will create an "extend" invoice.
    // Optionally prevent duplicate pending extend invoices for same seller+plan
    if (isExtend) {
      const existingPending = await Invoices.findOne({
        seller: sellerId,
        plan,
        paymentStatus: "pending",
        type: "extend",
      }).lean();
      if (existingPending) {
        return res.status(409).json({ message: "You already have a pending extension request for this plan" });
      }
    }

    // upload receipt
    const receiptUrl = await uploadToFTP(req.file.path);
    try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }

    // create invoice: type = 'manual' for normal, 'extend' for extension
    const invoiceType = isExtend ? "extend" : "manual";
    // const meta = { extend: !!isExtend, previousPlan: seller.planDetails?.plan || null };

    const invoice = await Invoices.create({
      seller: sellerId,
      plan,
      amount: Number(amount),
      receipt: receiptUrl,
      paymentStatus: "pending",
      type: invoiceType,
    //   meta,
    });

    return res.status(201).json({
      message: isExtend ? "Extension payment submitted. Waiting for admin approval." : "Payment proof submitted. Waiting for admin approval.",
      invoice,
    });
  } catch (error) {
    console.error("Payment submit error:", error);
    res.status(500).json({ message: "Failed to submit payment" });
  }
});


// const fetchPlansFromDB = async () => {
//   const plans = await Plan.find({ isActive: true })
//     .select("name price durationDays referralBonusPercent signUpBonusPercent")
//     .sort({ price: 1 })
//     .lean();

//   return plans.map((p) => ({
//     ...p,
//     name: p.name.toLowerCase(),
//   }));
// };


// router.post(
//   "/submit",
//   verifySeller,
//   upload.single("receipt"),
//   async (req, res) => {
//     try {
//       const { plan, amount } = req.body;
//       const sellerId = req.sellerId;

//       const isExtend =
//         String(req.query.extend || "false").toLowerCase() === "true";
//       const isUpgrade =
//         String(req.query.upgrade || "false").toLowerCase() === "true";

//       // ❌ cannot be both
//       if (isExtend && isUpgrade) {
//         return res
//           .status(400)
//           .json({ message: "Cannot extend and upgrade at the same time" });
//       }

//       if (!plan || !amount)
//         return res.status(400).json({ message: "Plan and amount are required" });

//       console.log("Payment submit:", { sellerId, plan, amount, isExtend, isUpgrade });
//       return;

//       if (!req.file)
//         return res.status(400).json({ message: "Receipt image is required" });

//       const expectedPrice = PLAN_PRICES[plan];
//       if (!expectedPrice)
//         return res.status(400).json({ message: "Invalid plan" });

//       if (Number(amount) !== expectedPrice) {
//         return res
//           .status(400)
//           .json({ message: `Invalid amount. Expected ${expectedPrice}` });
//       }

//       const seller = await Sellers.findById(sellerId).lean();
//       if (!seller)
//         return res.status(404).json({ message: "Seller not found" });

//       const currentPlan = seller.planDetails?.plan;

//       /* ================= EXTEND ================= */
//       if (isExtend) {
//         if (currentPlan !== plan) {
//           return res.status(400).json({
//             message: "Extend is only allowed for the current plan",
//           });
//         }
//       }

//       /* ================= UPGRADE ================= */
//       if (isUpgrade) {
//         if (!currentPlan) {
//           return res
//             .status(400)
//             .json({ message: "No existing plan to upgrade from" });
//         }

//         if (PLAN_ORDER[plan] <= PLAN_ORDER[currentPlan]) {
//           return res.status(400).json({
//             message: "Upgrade must be to a higher plan",
//           });
//         }
//       }

//       /* ===== prevent duplicate pending requests ===== */
//       const invoiceType = isUpgrade
//         ? "upgrade"
//         : isExtend
//         ? "extend"
//         : "manual";

//       const existingPending = await Invoices.findOne({
//         seller: sellerId,
//         paymentStatus: "pending",
//         type: invoiceType,
//       }).lean();

//       if (existingPending) {
//         return res.status(409).json({
//           message: `You already have a pending ${invoiceType} request`,
//         });
//       }

//       // upload receipt
//       const receiptUrl = await uploadToFTP(req.file.path);
//       try {
//         fs.unlinkSync(req.file.path);
//       } catch (e) {}

//       const invoice = await Invoices.create({
//         seller: sellerId,
//         plan,
//         amount: Number(amount),
//         receipt: receiptUrl,
//         paymentStatus: "pending",
//         type: invoiceType,
//         meta: {
//           previousPlan: currentPlan || null,
//         },
//       });

//       return res.status(201).json({
//         message:
//           invoiceType === "upgrade"
//             ? "Upgrade request submitted. Waiting for admin approval."
//             : invoiceType === "extend"
//             ? "Extension payment submitted. Waiting for admin approval."
//             : "Payment proof submitted. Waiting for admin approval.",
//         invoice,
//       });
//     } catch (error) {
//       console.error("Payment submit error:", error);
//       res.status(500).json({ message: "Failed to submit payment" });
//     }
//   }
// );


// router.post(
//   "/submit",
//   verifySeller,
//   upload.single("receipt"),
//   async (req, res) => {
//     try {
//       const { plan, amount } = req.body;
//       const sellerId = req.sellerId;

//       const isExtend =
//         String(req.query.extend || "false").toLowerCase() === "true";
//       const isUpgrade =
//         String(req.query.upgrade || "false").toLowerCase() === "true";

//       // ❌ cannot be both
//       if (isExtend && isUpgrade) {
//         return res
//           .status(400)
//           .json({ message: "Cannot extend and upgrade at the same time" });
//       }

//       if (!plan || !amount)
//         return res.status(400).json({ message: "Plan and amount are required" });

//       if (!req.file)
//         return res.status(400).json({ message: "Receipt image is required" });

//       // ================= DYNAMIC PLAN DATA =================
//       const plans = await fetchPlansFromDB(); // fetch from DB
// if (!plans || plans.length === 0)
//   return res.status(400).json({ message: "No active plans available" });

//       // map for price lookup
//       const PLAN_PRICES = plans.reduce((acc, p) => {
//   acc[p.name] = Number(p.price); // <-- keep original case
//   return acc;
// }, {});

//       // map for order lookup (based on price ascending)
//       const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
// const PLAN_ORDER = sortedPlans.reduce((acc, p, idx) => {
//   acc[p.name] = idx + 1; // <-- keep original case
//   return acc;
// }, {});

//       const planLower = plan.toLowerCase();
//       const expectedPrice = PLAN_PRICES[planLower];
//       if (!expectedPrice)
//         return res.status(400).json({ message: "Invalid plan" });

//       if (Number(amount) !== expectedPrice) {
//         return res
//           .status(400)
//           .json({ message: `Invalid amount. Expected ${expectedPrice}` });
//       }

//       const seller = await Sellers.findById(sellerId).lean();
//       if (!seller)
//         return res.status(404).json({ message: "Seller not found" });

//       const currentPlan = seller.planDetails?.plan?.toLowerCase();

//       /* ================= EXTEND ================= */
//       if (isExtend) {
//         if (currentPlan !== planLower) {
//           return res.status(400).json({
//             message: "Extend is only allowed for the current plan",
//           });
//         }
//       }

//       /* ================= UPGRADE ================= */
//       if (isUpgrade) {
//         if (!currentPlan) {
//           return res
//             .status(400)
//             .json({ message: "No existing plan to upgrade from" });
//         }

//         if (PLAN_ORDER[planLower] <= PLAN_ORDER[currentPlan]) {
//           return res.status(400).json({
//             message: "Upgrade must be to a higher plan",
//           });
//         }
//       }

//       /* ===== prevent duplicate pending requests ===== */
//       const invoiceType = isUpgrade
//         ? "upgrade"
//         : isExtend
//         ? "extend"
//         : "manual";

//       const existingPending = await Invoices.findOne({
//         seller: sellerId,
//         paymentStatus: "pending",
//         type: invoiceType,
//       }).lean();

//       if (existingPending) {
//         return res.status(409).json({
//           message: `You already have a pending ${invoiceType} request`,
//         });
//       }

//       // upload receipt
//       const receiptUrl = await uploadToFTP(req.file.path);
//       try {
//         fs.unlinkSync(req.file.path);
//       } catch (e) {}

//       const invoice = await Invoices.create({
//         seller: sellerId,
//         plan,
//         amount: Number(amount),
//         receipt: receiptUrl,
//         paymentStatus: "pending",
//         type: invoiceType,
//         meta: {
//           previousPlan: currentPlan || null,
//         },
//       });

//       return res.status(201).json({
//         message:
//           invoiceType === "upgrade"
//             ? "Upgrade request submitted. Waiting for admin approval."
//             : invoiceType === "extend"
//             ? "Extension payment submitted. Waiting for admin approval."
//             : "Payment proof submitted. Waiting for admin approval.",
//         invoice,
//       });
//     } catch (error) {
//       console.error("Payment submit error:", error);
//       res.status(500).json({ message: "Failed to submit payment" });
//     }
//   }
// );


router.get("/seller/invoices", verifySeller, async (req, res) => {
    try {
        const { search = "", sort = "createdAt:desc", page = 1, limit = 10 } = req.query;

        const query = { seller: req.sellerId, $or: [{ plan: { $regex: search, $options: "i" } }, { paymentStatus: { $regex: search, $options: "i" } }, { type: { $regex: search, $options: "i" } }] };

        const [sortField, sortOrder] = sort.split(":");
        const sortObj = { [sortField]: sortOrder === "asc" ? 1 : -1 };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Invoices.countDocuments(query);
        const invoices = await Invoices.find(query).sort(sortObj).skip(skip).limit(parseInt(limit));

        res.status(200).json({ total, page: parseInt(page), limit: parseInt(limit), invoices });
    } catch (error) {
        console.error("Invoices fetch error:", error);
        res.status(500).json({ message: error.message });
    }
});
// router.put("/change-status/:invoiceId", async (req, res) => {
//     try {
//         const { status } = req.body;
//         const invoice = await Invoices.findById(req.params.invoiceId).populate("seller");
//         if (!invoice) return res.status(404).json({ message: "Invoice not found" });

//         const seller = invoice.seller;
//         const prev = invoice.paymentStatus;

//         const now = new Date();
//         const end = new Date(); end.setMonth(end.getMonth() + 1);

//         // -------- VALIDATION --------
//         if (status === "paid" && prev !== "pending") return res.status(400).json({ message: "Only pending can be paid" });
//         if (status === "rejected" && prev !== "pending") return res.status(400).json({ message: "Only pending can be rejected" });
//         if (status === "refund" && prev !== "paid") return res.status(400).json({ message: "Only paid can be refunded" });
//         if (status === "pending" && !["paid", "rejected", "refund"].includes(prev)) return res.status(400).json({ message: "Nothing to revert" });

//         // -------- PAID --------
//         if (status === "paid") {
//             invoice.paymentStatus = "paid";
//             invoice.subscriptionStart = now;
//             invoice.subscriptionEnd = end;
//             seller.planDetails = { plan: invoice.plan, startDate: now, endDate: end, subscriptionStatus: "active" };
//             // If this is an extension, we should extend the current end date instead of setting new one. Optional improvement.
//             if(invoice.type === "extend" && seller.planDetails.subscriptionStatus === "active" && seller.planDetails.endDate > now) {
//                 invoice.subscriptionStart = seller.planDetails.endDate;
//                 invoice.subscriptionEnd = new Date(seller.planDetails.endDate.getTime());
//                 invoice.subscriptionEnd.setMonth(invoice.subscriptionEnd.getMonth() + 1);
//                 seller.planDetails.endDate = invoice.subscriptionEnd;
//             }
//             if(invoice.type === "upgrade") {
//                 // For upgrade, we can either keep the same end date or reset it. Here we choose to keep the same end date.
//                 invoice.subscriptionStart = now;
//                 invoice.subscriptionEnd = seller.planDetails.endDate > now ? seller.planDetails.endDate : end;
//                 seller.planDetails = { plan: invoice.plan, startDate: now, endDate: invoice.subscriptionEnd, subscriptionStatus: "active" };
//             }
//         }

//         // -------- REJECT --------
//         if (status === "rejected") {
//             invoice.paymentStatus = "rejected";
//         }

//         // -------- REFUND --------
//         if (status === "refund") {
//             invoice.paymentStatus = "refund";
//             invoice.subscriptionStart = null;
//             invoice.subscriptionEnd = null;
//             seller.planDetails = { plan: null, startDate: null, endDate: null, subscriptionStatus: "inactive" };
//         }

//         // -------- REVERT --------
//         if (status === "pending") {
//             if (["paid", "refund"].includes(prev)) {
//                 seller.planDetails = { plan: null, startDate: null, endDate: null, subscriptionStatus: "inactive" };
//             }
//             invoice.paymentStatus = "pending";
//             invoice.subscriptionStart = null;
//             invoice.subscriptionEnd = null;
//         }

//         await Promise.all([invoice.save(), seller.save()]);

//         res.json({ message: "Status updated", from: prev, to: status });
//     } catch (e) {
//         res.status(500).json({ message: e.message });
//     }
// });

const DAY_MS = 24 * 60 * 60 * 1000;
const PLAN_DURATION_DAYS = 30; // change if you use different durations

router.put("/change-status/:invoiceId", async (req, res) => {
  let   PLAN_PRICES = {};
  let   PLAN_ORDER = {};
  const fetchedPlans = await fetchPlansFromDB(); // fetch from DB
    console.log("Available plans for validation:", fetchedPlans);
    PLAN_PRICES = fetchedPlans.reduce((acc, p) => {
      acc[p.name] = Number(p.price);
      return acc;
    }, {});
    const sortedPlans = [...fetchedPlans].sort((a, b) => a.price - b.price);
    PLAN_ORDER = sortedPlans.reduce((acc, p, idx) => {
      acc[p.name] = idx + 1;
      return acc;
    }, {});
    console.log("PLAN_PRICES:", PLAN_PRICES);
    console.log("PLAN_ORDER:", PLAN_ORDER);
  try {
    const { status } = req.body;
    const invoice = await Invoices.findById(req.params.invoiceId).populate("seller");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const seller = invoice.seller;
    const prev = invoice.paymentStatus;

    const now = new Date();

    // -------- VALIDATION --------
    if (status === "paid" && prev !== "pending")
      return res.status(400).json({ message: "Only pending can be paid" });
    if (status === "rejected" && prev !== "pending")
      return res.status(400).json({ message: "Only pending can be rejected" });
    if (status === "refund" && prev !== "paid")
      return res.status(400).json({ message: "Only paid can be refunded" });
    if (status === "pending" && !["paid", "rejected", "refund"].includes(prev))
      return res.status(400).json({ message: "Nothing to revert" });

    // cache seller previous plan data BEFORE mutating seller.planDetails
    const prevPlan = seller.planDetails?.plan || null;
    const prevStart = seller.planDetails?.startDate ? new Date(seller.planDetails.startDate) : null;
    const prevEnd = seller.planDetails?.endDate ? new Date(seller.planDetails.endDate) : null;
    const prevActive = prevEnd && prevEnd > now;

    // -------- PAID --------
    if (status === "paid") {
      invoice.paymentStatus = "paid";

      // default values
      let subscriptionStart = now;
      let subscriptionEnd = new Date(now.getTime());
      subscriptionEnd.setDate(subscriptionEnd.getDate() + PLAN_DURATION_DAYS);

      // === EXTEND ===
      if (invoice.type === "extend") {
        // If seller has active plan, extend from prevEnd, otherwise from now
        if (prevActive) {
          subscriptionStart = prevEnd;
          subscriptionEnd = new Date(prevEnd.getTime());
          subscriptionEnd.setDate(subscriptionEnd.getDate() + PLAN_DURATION_DAYS);

          // update seller end date
          seller.planDetails = {
            plan: invoice.plan, // should match prevPlan
            startDate: prevStart || subscriptionStart,
            endDate: subscriptionEnd,
            subscriptionStatus: "active",
          };

          invoice.subscriptionStart = subscriptionStart;
          invoice.subscriptionEnd = subscriptionEnd;
        } else {
          // no active plan — treat as a fresh subscription (extension from now)
          seller.planDetails = {
            plan: invoice.plan,
            startDate: subscriptionStart,
            endDate: subscriptionEnd,
            subscriptionStatus: "active",
          };
          invoice.subscriptionStart = subscriptionStart;
          invoice.subscriptionEnd = subscriptionEnd;
        }
      }

      // === UPGRADE ===
      else if (invoice.type === "upgrade") {
        // If no previous active plan treat as new subscription
        if (!prevActive || !prevPlan) {
          seller.planDetails = {
            plan: invoice.plan,
            startDate: subscriptionStart,
            endDate: subscriptionEnd,
            subscriptionStatus: "active",
          };
          invoice.subscriptionStart = subscriptionStart;
          invoice.subscriptionEnd = subscriptionEnd;
        } else {
          // prorate logic
          const remainingMs = prevEnd.getTime() - now.getTime();
          const remainingDays = Math.ceil(Math.max(0, remainingMs) / DAY_MS);
          const prorateRatio = Math.min(1, remainingDays / PLAN_DURATION_DAYS);

          const oldPrice = PLAN_PRICES[prevPlan];
          const newPrice = PLAN_PRICES[invoice.plan];

          if (oldPrice == null || newPrice == null) {
            return res.status(400).json({ message: "Unknown plan price for prorating" });
          }

          // amount required for the upgrade for the remaining period
          const proratedUpgradeCost = (newPrice - oldPrice) * prorateRatio;

          // defensive parse
          const amountPaid = Number(invoice.amount);

          // if admin somehow marked paid but amount < required, refuse (or you can allow partial and handle differently)
          if (amountPaid < Math.round(proratedUpgradeCost)) {
            return res.status(400).json({
              message: `Paid amount (${amountPaid}) is less than prorated upgrade cost (${Math.round(proratedUpgradeCost)}).`,
            });
          }

          // Apply upgrade immediately for the remaining period: keep prevEnd as end
          let newEnd = new Date(prevEnd.getTime()); // keep original end by default

          // if admin accepted extra payment beyond the proratedUpgradeCost, convert extra to extra days on top of prevEnd
          const extraAmount = amountPaid - Math.round(proratedUpgradeCost);
          if (extraAmount > 0) {
            // how many days does extraAmount buy for the NEW plan?
            // days = extraAmount / newPrice * PLAN_DURATION_DAYS
            const extraDaysFloat = (extraAmount / newPrice) * PLAN_DURATION_DAYS;
            const extraDays = Math.floor(extraDaysFloat);
            if (extraDays > 0) {
              newEnd = new Date(newEnd.getTime() + extraDays * DAY_MS);
            }
          }

          // update seller plan details: upgrade now, end = newEnd
          seller.planDetails = {
            plan: invoice.plan,
            startDate: prevStart || now,
            endDate: newEnd,
            subscriptionStatus: "active",
          };

          invoice.subscriptionStart = now;
          invoice.subscriptionEnd = newEnd;
        }
      }

      // === MANUAL / NEW SUBSCRIPTION ===
      else {
        // standard new subscription (manual)
        seller.planDetails = {
          plan: invoice.plan,
          startDate: subscriptionStart,
          endDate: subscriptionEnd,
          subscriptionStatus: "active",
        };
        invoice.subscriptionStart = subscriptionStart;
        invoice.subscriptionEnd = subscriptionEnd;
      }
    }

    // -------- REJECT --------
    if (status === "rejected") {
      invoice.paymentStatus = "rejected";
    }

    // -------- REFUND --------
    if (status === "refund") {
      invoice.paymentStatus = "refund";
      invoice.subscriptionStart = null;
      invoice.subscriptionEnd = null;
      seller.planDetails = { plan: null, startDate: null, endDate: null, subscriptionStatus: "inactive" };
    }

    // -------- REVERT (set back to pending) --------
    if (status === "pending") {
      if (["paid", "refund"].includes(prev)) {
        seller.planDetails = { plan: null, startDate: null, endDate: null, subscriptionStatus: "inactive" };
      }
      invoice.paymentStatus = "pending";
      invoice.subscriptionStart = null;
      invoice.subscriptionEnd = null;
    }

    await Promise.all([invoice.save(), seller.save()]);

    res.json({ message: "Status updated", from: prev, to: status });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});


router.get("/admin/invoices", async (req, res) => {
    try {
        const { search = "", status, page = 1, sortField = "createdAt", sortOrder = "desc" } = req.query;
        const limit = 20;
        const skip = (parseInt(page) - 1) * limit;

        let query = {};

        if (search) {
            const matchedSellers = await Sellers.find({ $or: [{ brandName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }).select("_id");
            const sellerIds = matchedSellers.map(s => s._id);
            query.seller = { $in: sellerIds };
        }
        if (status) { query.paymentStatus = status; }
        const data = await Invoices.find(query).populate("seller", "brandName email planDetails").sort({ [sortField]: sortOrder === "asc" ? 1 : -1 }).skip(skip).limit(limit);

        const total = await Invoices.countDocuments(query);

        res.status(200).json({ data, total });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 