const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Users = require("../models/users")
// const { v4: uuidv4 } = require("uuid");
// 
let uuidv4;
(async () => {
    const uuid = await import("uuid");
    uuidv4 = uuid.v4;
})();
// 
const { verifyUserToken } = require('../middleware/auth')
const { generateReferralCode } = require("../services/referral");
const verifyEmailModel = require('../models/verifyemail');
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");

const { JWT_SECRET } = process.env

router.post("/send-email-verification", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        await verifyEmailModel.deleteOne({ email });

        const code = Math.floor(100000 + Math.random() * 900000);
        await verifyEmailModel.create({ email, code });

        await sendVerificationEmail(email, code);

        res.status(201).json({ message: "Verification code sent to your email. Check you inbox or spam folder!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, fullName, email, password, verificationCode } = req.body;

        if (!firstName || !email || !password || !verificationCode) return res.status(400).json({ message: "Missing required fields" });

        const record = await verifyEmailModel.findOne({ email });
        if (!record || record.code !== verificationCode) {
            return res.status(400).json({ message: "Invalid or expired verification code." });
        }

        const user = await Users.findOne({ email });
        if (user) { return res.status(401).json({ message: "Email is already in use", isError: true }); }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userID = uuidv4().replace(/-/g, "").slice(0, 8);

        const userReferralCode = await generateReferralCode(fullName || `${firstName}${lastName}`);

        const newUserData = { firstName, lastName, fullName, email, password: hashedPassword, userID, referralCode: userReferralCode };

        const newUser = new Users(newUserData);
        await newUser.save();
        await verifyEmailModel.deleteOne({ email });

        res.status(201).json({ message: "User registered successfully", isError: false, user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Internal server error.", isError: true, error });
    }
});

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await Users.findOne({ email })
        if (!user) { return res.status(404).json({ message: "User not found" }) }

        const match = await bcrypt.compare(password, user.password)

        if (match) {

            const { userID } = user

            const token = jwt.sign({ userID }, JWT_SECRET, { expiresIn: "1d" })

            res.status(200).json({ message: "User loggedin successfully", isError: false, token })
        } else {
            return res.status(404).json({ message: "Password is incorrect" })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Something went wrong. Internal server error.", isError: true, error })
    }
})


router.get("/user", verifyUserToken, async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Something went wrong. Internal server error.", isError: true, error })
    }
})

module.exports = router