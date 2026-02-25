const UserwithdrawReq = require("../models/userWithDrawRequest");

const createUserwithdrawRequest = async (req, res) => {
  try {
    const { amount, bankName, accountNumber, accountHolder } = req.body;
    const userId = req.user._id;
    
    const withdraw = await UserwithdrawReq.create({
      user: userId,
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

// GET User WITHDRAWS
const getUserWithdraws = async (req, res) => {
  try {
    const userId = req.user._id;
    const withdraws = await UserwithdrawReq.find({
      user: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(withdraws);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  createUserwithdrawRequest,
  getUserWithdraws,
};
