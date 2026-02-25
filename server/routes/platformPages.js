const express = require("express");
const router = express.Router();

const brandPagesModel = require("../models/brandPages");

router.get("/fetch-page", async (req, res) => {
    try {
        const { sellerID, page } = req.query
        const pageData = await brandPagesModel.findOne({ sellerID, slug: page })

        res.status(200).json({ message: 'Page fetched', pageData })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
});

module.exports = router