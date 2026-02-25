const express = require("express");
const router = express.Router();

const { verifySeller } = require("../middleware/auth");
const{checkPlan} = require("../controllers/sellerCheckPlan");

router.get("/check-Plan", verifySeller, checkPlan);

module.exports = router;