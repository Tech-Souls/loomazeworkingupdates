const express = require("express");
const router = express.Router();
// const { v4: uuidv4 } = require("uuid");
// 
let uuidv4;
(async () => {
  const uuid = await import("uuid");
  uuidv4 = uuid.v4;
})();
// 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const authModel = require("../models/auth");
const { verifyToken } = require("../middleware/auth");

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, role, brandName, brandSlug } = req.body;

        if (!username || !email || !password) return res.status(400).json({ message: "All fields are required!" })
        if (!brandName || !brandSlug) return res.status(400).json({ message: "Brand context is required!" })

        const existingUser = await authModel.findOne({
            brandSlug,
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists!" });
        }

        const userID = uuidv4().replace(/-/g, "").slice(0, 8);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { userID, username, email, password: hashedPassword, role: role || "customer", brandName, brandSlug }

        await authModel.create(newUser)

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username, email or referral code already exists" })
        }
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password, brandSlug } = req.body

        const user = await authModel.findOne({ username, brandSlug })
        if (!user) {
            return res.status(404).json({ message: 'Invalid username or password!' })
        }

        const matchedPassword = await bcrypt.compare(password, user.password)

        if (matchedPassword) {
            const { userID, brandSlug } = user
            // const token = jwt.sign({ userID, brandSlug }, "secret-key", { expiresIn: '30d' })
            const token = jwt.sign({ userID, brandSlug }, process.env.JWT_SECRET || "secret-key", { expiresIn: '30d' });


            res.status(200).json({ message: 'User logged in successfully!', token, user })
        }
        else {
            res.status(401).json({ message: 'Incorrect password!' })
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

router.get("/user", verifyToken, async (req, res) => {
    try {
        const userID = req.userID
        const brandSlug = req.tokenBrandSlug

        if (!brandSlug) {
            return res.status(400).json({ message: "Brand context missing" });
        }

        const user = await authModel.findOne({ userID, brandSlug });

        if (!user) {
            return res.status(403).json({ message: 'Access denied for this store!' });
        }

        res.status(200).json({ message: 'User found', user })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;