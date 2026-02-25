const Sellers = require("../models/sellers");

const checkPlan = async (req, res) => {
  try {
    const seller = await Sellers.findById(req.sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const plan = seller.planDetails;
    // const isActive = plan?.subscriptionStatus === 'active' && new Date(plan.endDate) > new Date();
    // console.log(isActive);
    res.json({plan: plan ? plan : null});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {checkPlan};