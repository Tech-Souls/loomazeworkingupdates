const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const upload = require("../middleware/multer")
// const fs = require("fs");

// const uploadToFTP = require("../middleware/uploadToFTP");
const { verifySeller } = require("../middleware/auth");
// const { v4: uuidv4 } = require("uuid");
//
let uuidv4;
(async () => {
  const uuid = await import("uuid");
  uuidv4 = uuid.v4;
})();
//
const bcrypt = require("bcrypt");
const verifyEmailModel = require("../models/verifyemail");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const sellersModel = require("../models/sellers");
// const userModel = require("../models/users");
const settingsModel = require("../models/settings");
const menusModel = require("../models/menus");
const pagesModel = require("../models/brandPages");
const {
  createReferralForSeller,
  generateReferralCode,
} = require("../services/referral");

const { JWT_SECRET } = process.env;

router.post("/send-email-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await verifyEmailModel.deleteOne({ email });

    const code = Math.floor(100000 + Math.random() * 900000);
    await verifyEmailModel.create({ email, code });

    await sendVerificationEmail(email, code);

    res.status(201).json({
      message:
        "Verification code sent to your email. Check you inbox or spam folder!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send verification email. Please try again.",
    });
  }
});

// router.post("/signup", upload.fields([{ name: "cnicFront", maxCount: 1 }, { name: "cnicBack", maxCount: 1 }]), async (req, res) => {
router.post("/signup", async (req, res) => {
  try {
    const state = req.body;
    const {
      fullname,
      username,
      email,
      password,
      address,
      phoneNumber,
      whatsappNumber,
      brandName,
      referralCode,
      verificationCode,
    } = state;

    if (
      !fullname ||
      !username ||
      !email ||
      !password ||
      !address ||
      !phoneNumber ||
      !whatsappNumber ||
      !brandName ||
      !verificationCode
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    // if (!req.files?.cnicFront || !req.files?.cnicBack) { return res.status(400).json({ message: "CNIC front and back images are required!" }) }

    const record = await verifyEmailModel.findOne({ email });
    if (!record) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    if (record.code != verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    const existingUser = await sellersModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists!" });
    }

    const userID = uuidv4().replace(/-/g, "").slice(0, 8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const slugify = (str) =>
      str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    const brandSlug = slugify(brandName);

    const existingBrand = await sellersModel.findOne({
      $or: [{ brandName }, { brandSlug }],
    });
    if (existingBrand) {
      return res
        .status(400)
        .json({ message: "This brand name is already taken!" });
    }

    // const cnicFrontUrl = await uploadToFTP(req.files.cnicFront[0].path);
    // const cnicBackUrl = await uploadToFTP(req.files.cnicBack[0].path);
    // try { fs.unlinkSync(req.files.cnicFront[0].path); } catch (e) { }
    // try { fs.unlinkSync(req.files.cnicBack[0].path); } catch (e) { }

    const sellerReferralCode = await generateReferralCode(username || fullname);

    // const newSeller = { ...state, userID, password: hashedPassword, brandSlug, cnicFront: cnicFrontUrl, cnicBack: cnicBackUrl, referralCode: sellerReferralCode, referredBy: null };
    const newSeller = {
      ...state,
      userID,
      password: hashedPassword,
      brandSlug,
      referralCode: sellerReferralCode,
      referredBy: null,
    };

    const seller = await sellersModel.create(newSeller);
    // console.log("Seller created with ID:", seller);
    // return;
    await verifyEmailModel.deleteOne({ email });

    if (referralCode) {
      try {
        const referral = await createReferralForSeller({
          sellerDoc: seller,
          referralCode: referralCode,
        });
        if (referral) {
          seller.referredBy = {
            id: referral.referrer.id,
            type: referral.referrer.type,
            referralCode,
          };
          await seller.save();
        }
      } catch (err) {
        await sellersModel.deleteOne({ _id: seller._id });
        return res
          .status(400)
          .json({ message: err.message || "Invalid referral code" });
      }
    }

    const settings = await settingsModel.create({
      sellerID: seller._id,
      brandName: seller.brandName,
      brandSlug: seller.brandSlug,
    });
    if (!settings) {
      await sellersModel.deleteOne({ _id: seller._id });
      console.error("Failed to create settings for seller ID:", seller._id);
      return res
        .status(500)
        .json({ message: "Failed to create settings for the seller." });
    }
    console.log(settings);

    // await menusModel.insertMany([
    //     {
    //         sellerID: seller._id,
    //         name: "Main Menu",
    //         links: [{ label: "Products", url: "/pages/products" }, { label: "Contact Us", url: "/pages/contact-us" }, { label: "About Us", url: "/pages/about-us" }]
    //     },
    //     {
    //         sellerID: seller._id,
    //         name: "Footer Menu 1",
    //         links: [{ label: "Products", url: "/pages/products" }, { label: "Coupons", url: "/pages/coupons" }]
    //     },
    //     {
    //         sellerID: seller._id,
    //         name: "Footer Menu 2",
    //         links: [{ label: "Terms & Conditions", url: "/pages/terms-and-conditions" }, { label: "Privacy Policies", url: "/pages/privacy-policies" }, { label: "About Us", url: "/oages/about-us" }, { label: "Contact Us", url: "/pages/contact-us" }]
    //     }
    // ]);

    // after: await settingsModel.create({ sellerID: seller._id, brandName: seller.brandName, brandSlug: seller.brandSlug });

    // create default menus (fixed typo)
    await menusModel.insertMany([
      {
        sellerID: seller._id,
        name: "Main Menu",
        links: [
          { label: "Products", url: "/pages/products" },
          { label: "Contact Us", url: "/pages/contact-us" },
          { label: "About Us", url: "/pages/about-us" },
        ],
      },
      {
        sellerID: seller._id,
        name: "Footer Menu 1",
        links: [
          { label: "Products", url: "/pages/products" },
          { label: "Coupons", url: "/pages/coupons" },
        ],
      },
      {
        sellerID: seller._id,
        name: "Footer Menu 2",
        links: [
          { label: "Terms & Conditions", url: "/pages/terms-and-conditions" },
          { label: "Privacy Policies", url: "/pages/privacy-policies" },
          { label: "About Us", url: "/pages/about-us" },
          { label: "Contact Us", url: "/pages/contact-us" },
        ],
      },
    ]);

    // Default page HTML content (raw HTML strings)
    const aboutContent = `
<section class="max-w-5xl mx-auto px-4 py-16">
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold">About ${seller.brandName}</h1>
    <p class="text-lg text-gray-600 mt-3">At ${seller.brandName}, we connect customers with trusted sellers — delivering quality products and a seamless shopping experience.</p>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-3">Our Story</h2>
    <p class="text-gray-700 leading-relaxed">We started with a simple idea: make online selling accessible to everyone. Today, our platform helps sellers reach more customers and grow their businesses.</p>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-3">Our Mission</h2>
    <p class="text-gray-700 leading-relaxed">To make ecommerce simple, reliable, and rewarding for both sellers and buyers.</p>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-3">Connect With Us</h2>
    <p class="text-gray-700">Email: <a href="mailto:support@loomaze.com" class="text-blue-600">support@loomaze.com</a></p>
  </div>
</section>
`;
    /*
    const contactContent = `
<section class="max-w-3xl mx-auto px-4 py-12">
  <h1 class="text-3xl font-bold text-center mb-4">Contact Us</h1>
  <p class="text-center text-gray-600 mb-6">We’re here to help. Use the form below to reach out and we’ll get back to you within 24 business hours.</p>

  <!-- Contact form (rendered as HTML; handle submit via frontend JS) -->
  <form class="contact-form space-y-4" method="POST" action="/api/contact">
    <div>
      <label for="name" class="block font-medium mb-1">Full Name</label>
      <input id="name" name="name" required class="w-full border rounded px-3 py-2" placeholder="Your name" />
    </div>

    <div>
      <label for="email" class="block font-medium mb-1">Email</label>
      <input id="email" type="email" name="email" required class="w-full border rounded px-3 py-2" placeholder="you@example.com" />
    </div>

    <div>
      <label for="message" class="block font-medium mb-1">Message</label>
      <textarea id="message" name="message" rows="5" required class="w-full border rounded px-3 py-2" placeholder="Write your message..."></textarea>
    </div>

    <button type="submit" class="bg-blue-600 text-white px-5 py-2 rounded">Send Message</button>
  </form>

  <div class="mt-8 text-sm text-gray-600">
    <p>Phone: +92 300 0000000</p>
    <p>Address: Faisalabad, Punjab, Pakistan</p>
  </div>
</section>
`;
*/
    const contactContent = `<section class="max-w-4xl mx-auto px-4 py-6">

<div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4">

<p class="text-gray-600 mb-4 text-sm">
If you have any questions about products, orders, or support, feel free to reach out.
Our team typically responds within 24 business hours.
</p>

<div class="grid md:grid-cols-1 gap-3 text-sm text-gray-700">

<div class="flex items-start gap-2">
<span class="text-blue-600">📞</span>
<div>
<p class="font-medium text-gray-900 leading-tight">Phone</p>
<p class="leading-tight">+92 300 0000000</p>
</div>
</div>

<div class="flex items-start gap-2">
<span class="text-green-600">📧</span>
<div>
<p class="font-medium text-gray-900 leading-tight">Email</p>
<p class="leading-tight">support@yourstore.com</p>
</div>
</div>

<div class="flex items-start gap-2">
<span class="text-purple-600">📍</span>
<div>
<p class="font-medium text-gray-900 leading-tight">Address</p>
<p class="leading-tight">Faisalabad, Punjab, Pakistan</p>
</div>
</div>

<div class="flex items-start gap-2">
<span class="text-orange-600">⏰</span>
<div>
<p class="font-medium text-gray-900 leading-tight">Business Hours</p>
<p class="leading-tight">Mon – Sat: 9:00 AM – 6:00 PM</p>
</div>
</div>

</div>

</div>

</section>`;

    const termsContent = `
<section class="max-w-5xl mx-auto px-4 py-12">
  <h1 class="text-3xl font-bold mb-4">Terms & Conditions</h1>
  <p class="text-gray-700 leading-relaxed">This is a placeholder for terms and conditions. Sellers should update this from their dashboard to include their specific terms.</p>
</section>
`;

    // create default pages
    await pagesModel.insertMany([
      {
        sellerID: seller._id,
        title: "About Us",
        content: aboutContent,
        visibility: true,
        slug: "about-us",
      },
      {
        sellerID: seller._id,
        title: "Contact Us",
        content: contactContent,
        visibility: true,
        slug: "contact-us",
      },
      {
        sellerID: seller._id,
        title: "Terms & Conditions",
        content: termsContent,
        visibility: true,
        slug: "terms-and-conditions",
      },
    ]);

    return res.status(201).json({
      message: "Form submitted successfully!",
      sellerReferralCode: seller.referralCode,
      seller,
    });
  } catch (error) {
    console.error("Error creating seller:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while creating account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await sellersModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid username or password!" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (matchedPassword) {
      const { userID } = user;
      const token = jwt.sign({ userID }, JWT_SECRET, { expiresIn: "30d" });

      res
        .status(200)
        .json({ message: "User logged in successfully!", token, user });
    } else {
      res.status(401).json({ message: "Invalid username or password!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/user", verifySeller, async (req, res) => {
  try {
    const user = req.seller;
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
