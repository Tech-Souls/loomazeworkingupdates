const express = require("express");
const {
  createWithdrawRequest,
  getSellerWithdraws,
} = require("../controllers/withdrawController");

const { verifySeller } = require("../middleware/auth");

const router = express.Router();

router.post("/create", verifySeller, createWithdrawRequest);
router.get("/", verifySeller, getSellerWithdraws);


module.exports = router;
