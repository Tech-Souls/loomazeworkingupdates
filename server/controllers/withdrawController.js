const WithdrawReq = require("../models/withDrawRequest.js");

// CREATE WITHDRAW REQUEST
const createWithdrawRequest = async (req, res) => {
  try {
    const { amount, bankName, accountNumber, accountHolder } = req.body;

    const withdraw = await WithdrawReq.create({
      seller: req.sellerId,
      amount,
      bankName,
      accountNumber,
      accountHolder,
      status: "pending",
    });

    res.status(201).json({
      message: "Withdraw request submitted",
      withdraw,
    });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SELLER WITHDRAWS
const getSellerWithdraws = async (req, res) => {
  try {
    const withdraws = await WithdrawReq.find({
      seller: req.sellerId,
    }).sort({ createdAt: -1 });

    res.status(200).json(withdraws);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createWithdrawRequest,
  getSellerWithdraws,
};
