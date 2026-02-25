const mongoose = require("mongoose");

// const planSchema = new mongoose.Schema(
//   {
//     plans: {
//       Basic: {
//         price: {
//           type: Number,
//           required: true,
//           default: 2000,
//         },
//         durationDays: {
//           type: Number,
//           default: 30,
//         },
//         referralBonusPercent: {
//           type: Number,
//           default: 5, // % for Basic
//         },
//       },
//       Grow: {
//         price: {
//           type: Number,
//           required: true,
//           default: 4000,
//         },
//         durationDays: {
//           type: Number,
//           default: 30,
//         },
//         referralBonusPercent: {
//           type: Number,
//           default: 5, // % for Grow (can be different)
//         },
//       },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("plans", planSchema);

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,   // 👈 auto convert to lowercase
      trim: true,        // 👈 removes extra spaces
    },
    price: {
      type: Number,
      required: true,
    },
    durationDays: {
      type: Number,
      default: 30,
    },
    referralBonusPercent: {
      type: Number,
      default: 5,
    },
    signUpBonusPercent: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
