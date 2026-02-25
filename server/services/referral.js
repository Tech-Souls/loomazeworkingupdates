const mongoose = require("mongoose");
const Referral = require("../models/referral");
const ReferralEarning = require("../models/referralEarning");
const usersModel = require("../models/users");
const sellersModel = require("../models/sellers");
// 
async function generateReferralCode(seed = "USER") {
  const base =
    String(seed).replace(/\s/g, "").toUpperCase().slice(0, 4) || "USER";
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(10000 + Math.random() * 90000);
    const code = `LOOMAZE${base}${rand}`;
    const u = await usersModel.findOne({ referralCode: code }).lean();
    const s = await sellersModel.findOne({ referralCode: code }).lean();
    if (!u && !s) return code;
  }
  return `LOOMAZE${base}${Date.now().toString().slice(-6)}`;
}

async function createReferralForSeller({
  sellerDoc,
  referralCode,
  paymentConfirmed = false,
}) {
  if (!referralCode) return null;

  let referrer = await usersModel.findOne({ referralCode: referralCode });
  let referrerType = "users";
  if (!referrer) {
    referrer = await sellersModel.findOne({ referralCode: referralCode });
    referrerType = "sellers";
  }
  if (!referrer) return null;
  if (
    referrer._id &&
    sellerDoc._id &&
    referrer._id.equals &&
    referrer._id.equals(sellerDoc._id)
  ) {
    throw new Error("You cannot refer yourself!");
  }

  let referral = await Referral.findOne({
    "referrer.id": referrer._id,
    "referrer.type": referrerType,
    seller: sellerDoc._id,
  });
  if (!referral) {
    referral = await Referral.create({
      referrer: { id: referrer._id, type: referrerType },
      seller: sellerDoc._id,
      referralCode,
      status: "active",
    });
  }

  if (paymentConfirmed) {
    const existingSignup = await ReferralEarning.findOne({
      "referrer.id": referrer._id,
      "referrer.type": referrerType,
      seller: sellerDoc._id,
      type: "signup",
    }).lean();
    if (!existingSignup) {
      return await ReferralEarning.create({
        referrer: { id: referrer._id, type: referrerType },
        seller: sellerDoc._id,
        referral: referral._id,
        amount: 500,
        type: "signup",
        status: "pending",
      });
    }
  }
  return referral;
}

async function processSellerApproval(sellerId) {
  if (!sellerId) return null;

  const referral = await Referral.findOne({
    seller: sellerId,
    status: "active",
  }).lean();
  if (!referral) return null;

  const seller = await sellersModel.findById(sellerId).lean();
  if (!seller && seller.status !== "approved") return null;

  const exists = await ReferralEarning.findOne({
    "referrer.id": referral.referrer.id,
    "referrer.type": referral.referrer.type,
    seller: referral.seller,
    type: "signup",
  }).lean();
  if (exists) return null;

  const earning = await ReferralEarning.create({
    referrer: { id: referral.referrer.id, type: referral.referrer, type },
    seller: referral.seller,
    referral: referral._id,
    amount: 500,
    type: "signup",
    status: "pending",
  });
  return earning;
}

const Plan = require("../models/plan.models");
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

// async function createMonthlyEarningsForMonth(yearMonth) {

//   const plans = await fetchPlansFromDB();
//   console.log("[createMonthlyEarningsForMonth] fetched plans", plans);
//   return;

//   if (!/^\d{4}-\d{2}$/.test(yearMonth)) throw new Error("Invalid monthKey");
//   const monthKey = yearMonth;
//   const referrals = await Referral.find({ status: "active" }).lean();

//   for (const r of referrals) {
//     const seller = await sellersModel.findById(r.seller).lean();
//     if (!seller) continue;

//     const subStatus = seller.planDetails.subscriptionStatus;
//     if (subStatus !== "active") continue;

//     let commision = 0;
//     if ((seller.planDetails.plan).toLowerCase() === "grow") {
//       commision = 4000 * 0.05;
//     } else if (seller.planDetails.plan === "Basic") {
//       commision = 2000 * 0.05;
//     } else {
//       continue;
//     }

//     const exsits = await ReferralEarning.findOne({
//       "referrer.id": r.referrer.id,
//       "referrer.type": r.referrer.type,
//       seller: r.seller,
//       month: monthKey,
//       type: "monthly",
//     }).lean();
//     if (!exsits) {
//       // edited
//       await ReferralEarning.create({
//         referrer: { id: r.referrer.id, type: r.referrer.type },
//         seller: r.seller,
//         referral: r._id,
//         amount: commision,
//         type: "monthly",
//         month: monthKey,
//         status: "pending",
//       });
//       //   await ReferralEarning.create({
//       //     referrer: { id: r.referrer.id, type: r.referrer.type },
//       //     seller: r.seller,
//       //     referral: r._id,
//       //     amount: 200,
//       //     type: "monthly",
//       //     month: monthKey,
//       //     status: "pending",
//       //   });
//     }
//   }
// }

async function createMonthlyEarningsForMonth(yearMonth) {
  const plans = await fetchPlansFromDB();
  console.log("[createMonthlyEarningsForMonth] fetched plans", plans);

  if (!/^\d{4}-\d{2}$/.test(yearMonth)) throw new Error("Invalid monthKey");
  const monthKey = yearMonth;

  const referrals = await Referral.find({ status: "active" }).lean();

  // create a quick lookup by plan name for efficiency
  const planMap = plans.reduce((acc, p) => {
    acc[p.name.toLowerCase()] = p;
    return acc;
  }, {});

  for (const r of referrals) {
    const seller = await sellersModel.findById(r.seller).lean();
    if (!seller) continue;

    const subStatus = seller.planDetails.subscriptionStatus;
    if (subStatus !== "active") continue;

    const planName = seller.planDetails.plan?.toLowerCase();
    const plan = planMap[planName];
    if (!plan) continue; // skip unknown plan

    // calculate commission dynamically
    const commission = plan.price * (plan.referralBonusPercent / 100);

    const exists = await ReferralEarning.findOne({
      "referrer.id": r.referrer.id,
      "referrer.type": r.referrer.type,
      seller: r.seller,
      month: monthKey,
      type: "monthly",
    }).lean();

    if (!exists) {
      await ReferralEarning.create({
        referrer: { id: r.referrer.id, type: r.referrer.type },
        seller: r.seller,
        referral: r._id,
        amount: commission,
        type: "monthly",
        month: monthKey,
        status: "pending",
      });
    }
  }
}


async function createMonthlyEarningForSeller({
  sellerId,
  referrerId,
  referrerType,
  monthKey,
}) {
  if (!/^\d{4}-\d{2}$/.test(monthKey)) throw new Error("Invalid monthKey");

  const referral = await Referral.findOne({
    seller: sellerId,
    "referrer.id": referrerId,
    "referrer.type": referrerType,
  }).lean();
  if (!referral) return null;

  const exsits = await ReferralEarning.findOne({
    seller: sellerId,
    "referrer.id": referrerId,
    "referrer.type": referrerType,
    amount: 200,
    type: "monthly",
    month: monthKey,
    status: "pending",
  }).lean();
  if (exsits) return null;

  return await ReferralEarning.create({
    referrer: { id: referrerId, type: referrerType },
    seller: sellerId,
    referral: referral._id,
    amount: 200,
    type: "monthly",
    month: monthKey,
    status: "pending",
  });
}

module.exports = {
  generateReferralCode,
  createReferralForSeller,
  processSellerApproval,
  createMonthlyEarningsForMonth,
  createMonthlyEarningForSeller,
};
