const express = require("express");
const router = express.Router();
const fs = require("fs");

const settingsModel = require("../models/settings");
const upload = require("../middleware/multer");
const uploadToFTP = require("../middleware/uploadToFTP");
const delFromFTP = require("../middleware/delFromFTP");

// ---------------- Currency Update ----------------
router.post("/currency/update/:sellerID", async (req, res) => {
  try {
    const { sellerID } = req.params;
    const { currency } = req.body;

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings)
      return res.status(404).json({ message: "Seller settings not found" });

    sellerSettings.content.currency = currency;
    await sellerSettings.save();

    res.status(202).json({ message: "Currency updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ---------------- Stripper Text ----------------
router.post('/stripper-text/:sellerID', upload.single('stripperImage'), async (req, res) => {
  try {
    const { sellerID } = req.params;
    const { stripperText } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    const imagePath = await uploadToFTP(req.file.path);
    fs.unlinkSync(req.file.path);

    sellerSettings.content.stripperText.push({
      text: stripperText?.trim() || null,
      imageURL: imagePath,
    });

    await sellerSettings.save();

    res.status(202).json({
      message: "Stripper content added successfully",
      stripperContent: sellerSettings.content.stripperText
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/stripper-text-delete/:sellerID', async (req, res) => {
  try {
    const { sellerID } = req.params;
    const { id } = req.body;

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    if (!sellerSettings.content?.stripperText)
      return res.status(400).json({ message: "Stripper text not found" });

    sellerSettings.content.stripperText = sellerSettings.content.stripperText.filter(
      item => item._id.toString() !== id
    );

    await sellerSettings.save();
    res.status(200).json({ message: "Stripper text deleted successfully", data: sellerSettings.content.stripperText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ---------------- Brand Icons ----------------
router.post('/brand-icons/:sellerID', upload.single('icons'), async (req,res) => {
  try {
    const { sellerID } = req.params;

    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    const imagePath = await uploadToFTP(req.file.path); 
    fs.unlinkSync(req.file.path);

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    sellerSettings.content.brandIcons.push({ imageURL: imagePath });
    await sellerSettings.save();

    res.status(202).json({ message: "Brand icon added successfully", data: sellerSettings.content.brandIcons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/brands-icons-delete/:sellerID', async(req,res) => {
  try {
    const { sellerID } = req.params;
    const { id } = req.body;

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    if (!sellerSettings.content?.brandIcons)
      return res.status(400).json({ message: "Brand icons not found" });

    sellerSettings.content.brandIcons = sellerSettings.content.brandIcons.filter(
      item => item._id.toString() !== id
    );

    await sellerSettings.save();
    res.status(200).json({ message: "Brand icon deleted successfully", data: sellerSettings.content.brandIcons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ---------------- Spotlight Product ----------------
router.post('/set-spotlight-product/:sellerID', async (req, res) => {
  try {
    const { sellerID } = req.params;
    const { productID, expiresIn } = req.body;

    if (!productID || !expiresIn)
      return res.status(400).json({ message: "productID and expiresIn are required" });

    const updatedSettings = await settingsModel.findOneAndUpdate(
      { sellerID },
      { 'content.spotlightProduct': [{ productID, expiresIn }] },
      { new: true, upsert: true }
    ).populate('content.spotlightProduct.productID');

    res.status(200).json({
      message: 'Spotlight product set successfully',
      data: updatedSettings.content.spotlightProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ---------------- Hero Slider 1 ----------------
router.post("/hero-slider/add/:sellerID", upload.single("image"), async (req, res) => {
  try {
    const { sellerID } = req.params;
    const { ctaLink, title, subtitle } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const imagePath = await uploadToFTP(req.file.path);
    fs.unlinkSync(req.file.path);

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    sellerSettings.content.heroSlider.push({ title, subtitle, ctaLink, image: imagePath });
    await sellerSettings.save();

    res.status(202).json({ message: "Slide added successfully", heroSlider: sellerSettings.content.heroSlider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/hero-slider/delete/:sellerID/:index", async (req, res) => {
  try {
    const { sellerID, index } = req.params;

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    const slide = sellerSettings.content.heroSlider[index];
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    if (slide.image) await delFromFTP(slide.image);

    sellerSettings.content.heroSlider.splice(index, 1);
    sellerSettings.markModified("content.heroSlider");
    await sellerSettings.save();

    res.status(202).json({ message: "Hero slide deleted successfully", heroSlider: sellerSettings.content.heroSlider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ---------------- Hero Slider 2 ----------------
router.post("/hero-slider-2/add/:sellerID", upload.single("image"), async (req, res) => {
  try {
    const { sellerID } = req.params;
    const { ctaLink, title, subtitle } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const imagePath = await uploadToFTP(req.file.path);
    fs.unlinkSync(req.file.path);

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    sellerSettings.content.heroSlider2.push({ title, subtitle, ctaLink, image: imagePath });
    await sellerSettings.save();

    res.status(202).json({ message: "Slide added successfully", heroSlider: sellerSettings.content.heroSlider2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/hero-slider-2/delete/:sellerID/:index", async (req, res) => {
  try {
    const { sellerID, index } = req.params;

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    const slide = sellerSettings.content.heroSlider2[index];
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    if (slide.image) await delFromFTP(slide.image);
    if (slide.video) await delFromFTP(slide.video);

    sellerSettings.content.heroSlider2.splice(index, 1);
    sellerSettings.markModified("content.heroSlider2");
    await sellerSettings.save();

    res.status(202).json({ message: "Hero slide deleted successfully", heroSlider: sellerSettings.content.heroSlider2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ---------------- Explore More ----------------
router.post("/explore-more/update/:sellerID", upload.single("image"), async (req, res) => {
  try {
    const { sellerID } = req.params;
    const { title, subtitle, ctaLink } = req.body;

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    if (req.file && sellerSettings.content.exploreMore?.imageURL)
      await delFromFTP(sellerSettings.content.exploreMore.imageURL);

    const imagePath = req.file ? await uploadToFTP(req.file.path) : null;

    sellerSettings.content.exploreMore = { title, subtitle, ctaLink, imageURL: imagePath || sellerSettings.content.exploreMore?.imageURL };
    sellerSettings.markModified("content.exploreMore");
    await sellerSettings.save();

    res.status(202).json({ message: "Content updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/explore-more-2/update/:sellerID", upload.single("image"), async (req, res) => {
  try {
    const { sellerID } = req.params;
    const { title, subtitle, ctaLink } = req.body;

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    if (req.file && sellerSettings.content.exploreMore2?.imageURL)
      await delFromFTP(sellerSettings.content.exploreMore2.imageURL);

    const imagePath = req.file ? await uploadToFTP(req.file.path) : null;

    sellerSettings.content.exploreMore2 = { title, subtitle, ctaLink, imageURL: imagePath || sellerSettings.content.exploreMore2?.imageURL };
    sellerSettings.markModified("content.exploreMore2");
    await sellerSettings.save();

    res.status(202).json({ message: "Content updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ---------------- Top Notifications ----------------
router.post("/top-notifications/update/:sellerID", async (req, res) => {
  try {
    const { sellerID } = req.params;
    const data = req.body;

    const sellerSettings = await settingsModel.findOne({ sellerID });
    if (!sellerSettings) return res.status(404).json({ message: "Seller settings not found" });

    const oldLength = sellerSettings.content.topNotifications.length;
    sellerSettings.content.topNotifications = data;
    await sellerSettings.save();

    const newLength = data.length;
    const message = newLength > oldLength ? "Notification added successfully!" : "Notification deleted successfully!";

    res.status(202).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;