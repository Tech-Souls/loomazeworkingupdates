const express = require("express");
const { createUserwithdrawRequest, getUserWithdraws } = require("../controllers/userWithdrawController");

const { verifyUserToken } = require("../middleware/auth");

const router = express.Router();

router.post("/create", verifyUserToken, createUserwithdrawRequest);
router.get("/", verifyUserToken, getUserWithdraws);


module.exports = router;
