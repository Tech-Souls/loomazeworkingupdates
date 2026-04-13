const express = require("express");
const router = express.Router();
const { getSellerWithdraws, updateWithdrawStatus, getUserWithdraws, updateUserWithdrawStatus } = require("../controllers/adminWithdrawController");

router.get("/withdraws/seller", getSellerWithdraws);
router.get("/withdraws/user", getUserWithdraws);

// PATCH route to update withdraw status
router.patch("/withdraw/:id", updateWithdrawStatus);
router.patch("/withdraw/user/:id", updateUserWithdrawStatus);
module.exports = router;
