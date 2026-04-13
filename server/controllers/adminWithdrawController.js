const WithdrawReq = require("../models/withDrawRequest");
const UserwithdrawReq = require("../models/userWithDrawRequest");
const Sellers = require("../models/sellers");
const Users = require("../models/users");

// getSellerWithdraws
const getSellerWithdraws = async (req, res) => {
  try {
    const withdraws = await WithdrawReq.find({
      seller: { $exists: true }
    })
      .sort({ createdAt: -1 })
      .populate("seller", "username email");

    res.status(200).json(withdraws);
  } catch (err) {
    console.error("Seller withdraw fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//getUserWithdraws
const getUserWithdraws = async (req, res) => {
  try {
    const Userwithdraws = await UserwithdrawReq.find({
      user: { $exists: true }
    })
      .sort({ createdAt: -1 })
      .populate("user", "username email");

    res.status(200).json(Userwithdraws);
  } catch (err) {
    console.error("user withdraw fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


const updateWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("this is id: ", id);
    console.log("this is status: ", status);

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const withdraw = await WithdrawReq.findById(id);
    console.log("witdraw: ", withdraw);
    if (!withdraw) {
      return res.status(404).json({ message: "Withdraw not found" });
    }



    withdraw.status = status;
    await withdraw.save();

    res.status(200).json({
      message: "Withdraw status updated successfully",
      withdraw,
    });

  } catch (err) {
    console.error("Update withdraw error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//user updatewithdraw staus
const updateUserWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const withdraw = await UserwithdrawReq.findById(id);
    if (!withdraw) {
      return res.status(404).json({ message: "User withdraw not found" });
    }

    // 🔹 Simple status update
    withdraw.status = status;
    await withdraw.save();

    res.status(200).json({
      message: "User withdraw status updated successfully",
      withdraw,
    });

  } catch (err) {
    console.error("Update user withdraw error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  updateWithdrawStatus,
  getSellerWithdraws,
  getUserWithdraws,
  updateUserWithdrawStatus
};
