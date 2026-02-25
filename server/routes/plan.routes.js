// // GET /admin/plans
// const express = require("express");
// const router = express.Router();
// const Plans = require("../models/plan.models");
// // const verifyAdmin = require("../middleware/verifyAdmin");

// router.get("/admin", async (req, res) => {
//     console.log("Admin requested plans");
// //   try {
// //     const planDoc = await Plans.findOne().lean();
// //     if (!planDoc) return res.status(404).json({ message: "Plans not found" });

// //     // return all plan details including referral bonus and duration
// //     res.json({ plans: planDoc.plans });
// //   } catch (e) {
// //     console.error("Admin fetch plans error:", e);
// //     res.status(500).json({ message: "Failed to fetch plans" });
// //   }
//     // fetch all plans from database
//     try {
//         const plans = await Plans.findOne().lean();
//         if (!plans) {
//             return res.status(404).json({ message: "No plans found" });
//         }
//         console.log("Fetched plans from DB:", plans);
//         res.status(200).json({ plans: plans.plans });
//     } catch (e) {
//         console.error("Admin fetch plans error:", e);
//         res.status(500).json({ message: "Failed to fetch plans" });
//     }



// });

// // GET /seller/plans
// router.get("/seller", async (req, res) => {
//   try {
//     const planDoc = await Plans.findOne().lean();
//     if (!planDoc) return res.status(404).json({ message: "Plans not found" });

//     // only send relevant info to seller (price, duration)
//     const sellerView = {};
//     Object.keys(planDoc.plans).forEach((plan) => {
//       sellerView[plan] = {
//         price: planDoc.plans[plan].price,
//         durationDays: planDoc.plans[plan].durationDays,
//       };
//     });

//     res.json({ plans: sellerView });
//   } catch (e) {
//     console.error("Seller fetch plans error:", e);
//     res.status(500).json({ message: "Failed to fetch plans" });
//   }
// });

// // PUT /admin/plans
// router.put("/admin", async (req, res) => {
//   try {
//     const { plans } = req.body;
//     if (!plans) return res.status(400).json({ message: "Plans data is required" });

//     let planDoc = await Plans.findOne();
//     if (!planDoc) planDoc = new Plans({ plans });

//     Object.keys(plans).forEach((planName) => {
//       const incoming = plans[planName];
//       const existing = planDoc.plans[planName];

//       if (!existing) throw new Error(`Invalid plan: ${planName}`);

//       // VALIDATION
//       if (incoming.price != null && incoming.price <= 0)
//         throw new Error(`${planName} price must be > 0`);
//       if (
//         incoming.referralBonusPercent != null &&
//         (incoming.referralBonusPercent < 0 || incoming.referralBonusPercent > 100)
//       )
//         throw new Error(`${planName} referral bonus must be 0–100`);
//       if (incoming.durationDays != null && incoming.durationDays < 1)
//         throw new Error(`${planName} duration must be at least 1 day`);

//       // MERGE update
//       planDoc.plans[planName] = { ...existing, ...incoming };
//     });

//     await planDoc.save();

//     res.json({
//       message: "Plan settings updated successfully",
//       plans: planDoc.plans,
//     });
//   } catch (e) {
//     console.error("Admin update plans error:", e);
//     res.status(400).json({ message: e.message });
//   }
// });


// module.exports = router;



// routes/plans.js
const express = require("express");
const router = express.Router();
const Plan = require("../models/plan.models");
// const verifyAdmin = require("../middleware/verifyAdmin");

/**
 * GET /admin
 * Return all plans as an array
 */
router.get("/admin", async (req, res) => {
  try {
    const plans = await Plan.find().lean();
    if (!plans || plans.length === 0) {
      return res.status(404).json({ message: "No plans found" });
    }

    const plansArray = plans.map((p) => ({
      name: p.name,
      price: p.price,
      durationDays: p.durationDays,
      referralBonusPercent: p.referralBonusPercent,
      signUpBonusPercent: p.signUpBonusPercent,
      isActive: p.isActive,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return res.status(200).json(plansArray); // array response
  } catch (e) {
    console.error("Admin fetch plans error:", e);
    return res.status(500).json({ message: "Failed to fetch plans" });
  }
});

/**
 * GET /seller
 * Return limited view for sellers (only active plans) as an array
 */
router.get("/seller", async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).lean();
    if (!plans || plans.length === 0) {
      return res.status(404).json({ message: "No plans available" });
    }

    const sellerArray = plans.map((p) => ({
      name: p.name,
      price: p.price,
      durationDays: p.durationDays,
    }));

    return res.status(200).json(sellerArray); // array response
  } catch (e) {
    console.error("Seller fetch plans error:", e);
    return res.status(500).json({ message: "Failed to fetch plans" });
  }
});

/**
 * PUT /admin
 * Body: { plans: { PlanName: { price, durationDays, referralBonusPercent, signUpBonusPercent, isActive } } }
 * Creates or updates plans. Plan names are normalized to lowercase.
 * Returns an array of updated/created plans.
 */
router.put("/admin", async (req, res) => {
  try {
    const { plans } = req.body;
    if (!plans || typeof plans !== "object") {
      return res.status(400).json({ message: "Plans data is required" });
    }

    // Allowed fields for update
    const allowedFields = [
      "price",
      "durationDays",
      "referralBonusPercent",
      "signUpBonusPercent",
      "isActive",
    ];

    // Build an array of upsert promises using map
    const upsertPromises = Object.entries(plans).map(async ([rawName, incoming]) => {
      if (!incoming || typeof incoming !== "object") {
        throw new Error(`Invalid payload for plan ${rawName}`);
      }

      const name = rawName.toLowerCase().trim();

      // VALIDATION
      if (incoming.price != null && typeof incoming.price !== "number") {
        throw new Error(`${rawName} price must be a number`);
      }
      if (incoming.price != null && incoming.price <= 0) {
        throw new Error(`${rawName} price must be > 0`);
      }
      if (
        incoming.referralBonusPercent != null &&
        (incoming.referralBonusPercent < 0 || incoming.referralBonusPercent > 100)
      ) {
        throw new Error(`${rawName} referral bonus must be 0–100`);
      }
      if (
        incoming.signUpBonusPercent != null &&
        (incoming.signUpBonusPercent < 0 || incoming.signUpBonusPercent > 100)
      ) {
        throw new Error(`${rawName} sign-up bonus must be 0–100`);
      }
      if (incoming.durationDays != null && incoming.durationDays < 1) {
        throw new Error(`${rawName} duration must be at least 1 day`);
      }

      // Build updateFields using reduce (only allowed keys)
      const updateFields = Object.keys(incoming).reduce((acc, key) => {
        if (allowedFields.includes(key) && incoming[key] !== undefined) {
          acc[key] = incoming[key];
        }
        return acc;
      }, {});

      // Ensure name is set on insert and setDefaultsOnInsert true
      const planDoc = await Plan.findOneAndUpdate(
        { name },
        { $set: { name, ...updateFields } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();

      return {
        name: planDoc.name,
        price: planDoc.price,
        durationDays: planDoc.durationDays,
        referralBonusPercent: planDoc.referralBonusPercent,
        signUpBonusPercent: planDoc.signUpBonusPercent,
        isActive: planDoc.isActive,
        createdAt: planDoc.createdAt,
        updatedAt: planDoc.updatedAt,
      };
    });

    // Wait for all upserts to finish (map -> Promise.all)
    const updatedPlansArray = await Promise.all(upsertPromises);

    return res.status(200).json(updatedPlansArray); // return array
  } catch (e) {
    console.error("Admin update plans error:", e);
    if (e.code === 11000) {
      return res.status(400).json({ message: "Plan name conflict (duplicate name)" });
    }
    return res.status(400).json({ message: e.message || "Failed to update plans" });
  }
});

module.exports = router;
