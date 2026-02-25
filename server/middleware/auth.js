const jwt = require("jsonwebtoken");
const usersModel = require("../models/users");
const sellersModel = require("../models/sellers");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) { return res.status(401).json({ message: "No token provided!" }); }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "secret-key", (err, decoded) => {
        if (err) { return res.status(401).json({ message: "Invalid or expired token!" }); }

        req.userID = decoded.userID;
        req.tokenBrandSlug = decoded.brandSlug;
        next();
    });
}

const verifyUserToken = async (req, res, next) => {
    try {
        // const token = req.headers.authorization?.split(" ")[1]
        // if (!token) return res.status(401).json({ message: "No token found" })
        let token = req.headers.authorization;
if (token?.startsWith("Bearer ")) {
    token = token.split(" ")[1];
}
if (!token) return res.status(401).json({ message: "No token found" });


        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await usersModel.findOne({ userID: decoded.userID }).lean();
        req.userId = user._id;
        console.log("req.userId: ", req.userId);
        req.user = user || decoded;
        req.userID = decoded.userID;
        next();
    } catch (err) {
        console.error("verifyUserToken failed:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
}

const isObjectId = (id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id) && id.length === 24

const verifySeller = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.status(401).json({ message: "No token provided" })

        let decoded
        try { decoded = jwt.verify(token, process.env.JWT_SECRET) }
        catch (err) { return res.status(401).json({ message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token" }) }

        const seller = (decoded.id && isObjectId(decoded.id) ? await sellersModel.findById(decoded.id) : null) || (decoded.userID ? await sellersModel.findOne({ userID: decoded.userID }) : null)

        if (!seller) return res.status(404).json({ message: "Seller not found" })

        req.seller = seller
        req.sellerId = seller._id
        req.userID = seller.userID
        next()
    } catch (err) {
        console.error("verifySeller:", err)
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = { verifyToken, verifySeller, verifyUserToken }