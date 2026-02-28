const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const { config } = require("dotenv");
const scheduleMonthlyReferralJob = require("./jobs/referrals");
const withdrawRoutes = require("./routes/withdrawRoutes.js");
const userWithdrawRoutes = require("./routes/userWithdrawRoutes.js");
const adminWithdrawRoutes = require("./routes/adminWithdrawRoutes");
const sellerCheckPlan = require("./routes/sellerCheckPlan.js");
const planRoutes = require("./routes/plan.routes.js");

const app = express();
app.use(express.json());
app.use(cors());
config();

mongoose
  // .connect(process.env.MONGOURL, { dbName: "ecommerce-platform", connectTimeoutMS: 30000 })
  .connect(process.env.MONGOURL, { dbName: "ecommerce-platform", connectTimeoutMS: 30000 })
  // .connect(process.env.MONGOURL, { dbName: "loomaze", connectTimeoutMS: 30000 })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const authRouter = require("./routes/auth");
const fetchBrandForAuthRouter = require("./routes/fetchBrandForAuth");
const sellersAuthRouter = require("./routes/sellersAuth");
const adminUsersRouter = require("./routes/adminUsers");
const adminSellerRequestsRouter = require("./routes/adminSellerRequests");
const adminSellerListRouter = require("./routes/adminSellerList");
const adminDomainsRouter = require("./routes/adminDomains");

const sellerDashboardRouter = require("./routes/sellerDashboard");
const sellerMenusRouter = require("./routes/sellerMenus");
const sellerPagesRouter = require("./routes/sellerPages");
const sellerSaleRouter = require("./routes/sellerSale");
const sellerCouponsRouter = require("./routes/sellerCoupons");
const sellerFaqsRouter = require("./routes/sellerFaqs");
const sellerAddProductRouter = require("./routes/sellerAddProduct");
const sellerManageProductsRouter = require("./routes/sellerManageProducts");
const sellerEditProductRouter = require("./routes/sellerEditProduct");
const sellerCategoriesRouter = require("./routes/sellerCategories");
const sellerSizeChartsRouter = require("./routes/sellerSizeCharts");
const sellerImageGalleryRouter = require("./routes/sellerImageGallery");
const sellerThemeSettingsRouter = require("./routes/sellerThemeSettings");
const sellerLayoutSettingsRouter = require("./routes/sellerLayoutSettings");
const sellerProductPageLayoutSettingsRouter = require("./routes/sellerProductPageLayoutSettings");
const sellerContentSettingsRouter = require("./routes/sellerContentSettings");
const sellerHeaderContentSettingsRouter = require("./routes/sellerHeaderContentSettings");
const sellerFooterContentSettingsRouter = require("./routes/sellerFooterContentSettings");
const sellerManageOrdersRouter = require("./routes/sellerManageOrders");
const sellerUpdateOrderRouter = require("./routes/sellerUpdateOrder");
const sellerDeliveryDateEstimateRouter = require("./routes/sellerDeliveryDateEstimate");
const sellerManagePaymentsRouter = require("./routes/sellerManagePayments");
const sellerChargesAndMethodsRouter = require("./routes/sellerChargesAndMethods");
const sellerProfileRouter = require("./routes/sellerProfile");
const sellerDomainRouter = require("./routes/sellerDomain");
const sellerTagsManagerRouter = require("./routes/sellerTagsManager");

const fetchSellerDetailsRouter = require("./routes/fetchSellerDetails");
const platformHomeRouter = require("./routes/platformHome");
const platformPagesRouter = require("./routes/platformPages");
const platformProductsRouter = require("./routes/platformProducts");
const productPageRouter = require("./routes/productPage");
const platformCartRouter = require("./routes/platformCart");
const platformCouponsRouter = require("./routes/platformCoupons");
const platformPlaceOrderRouter = require("./routes/placeOrder");

const userDashboardRouter = require("./routes/userDashboard");
const userOrdersRouter = require("./routes/userOrders");
const userProfileRouter = require("./routes/userProfile");
const userAddressRouter = require("./routes/userAddress");
const userReviewsRouter = require("./routes/userReviews");
const userFavouritesRouter = require("./routes/favourites");

const userAuth = require("./routes/loomazeUserAuth");
const loomazeUserProfile = require("./routes/loomazeUserProfile");
const loomazeUserAddress = require("./routes/loomazeUserAddress");
const referral = require("./routes/referrals");
const payments = require("./routes/payments");

app.use("/auth", authRouter);
app.use("/auth/brand", fetchBrandForAuthRouter);
app.use("/auth/seller", sellersAuthRouter);
app.use("/admin/users", adminUsersRouter);
app.use("/admin/sellers/requests", adminSellerRequestsRouter);
app.use("/admin/sellers/list", adminSellerListRouter);
app.use("/admin/domains", adminDomainsRouter);

app.use("/seller/dashboard", sellerDashboardRouter);
app.use("/seller/menus", sellerMenusRouter);
app.use("/seller/pages", sellerPagesRouter);
app.use("/seller/sale", sellerSaleRouter);
app.use("/seller/coupons", sellerCouponsRouter);
app.use("/seller/faqs", sellerFaqsRouter);
app.use("/seller/add-product", sellerAddProductRouter);
app.use("/seller/manage-products", sellerManageProductsRouter);
app.use("/seller/edit-product", sellerEditProductRouter);
app.use("/seller/categories", sellerCategoriesRouter);
app.use("/seller/size-charts", sellerSizeChartsRouter);
app.use("/seller/image-gallery", sellerImageGalleryRouter);
app.use("/seller/theme", sellerThemeSettingsRouter);
app.use("/seller/layout", sellerLayoutSettingsRouter);
app.use("/seller/product-page-layout", sellerProductPageLayoutSettingsRouter);
app.use("/seller/content", sellerContentSettingsRouter);
app.use("/seller/header-content", sellerHeaderContentSettingsRouter);
app.use("/seller/footer-content", sellerFooterContentSettingsRouter);
app.use("/seller/manage-orders", sellerManageOrdersRouter);
app.use("/seller/update-order", sellerUpdateOrderRouter);
app.use("/seller/delivery-date-estimate", sellerDeliveryDateEstimateRouter);
app.use("/seller/manage-payments", sellerManagePaymentsRouter);
app.use("/seller/charges-and-methods", sellerChargesAndMethodsRouter);
app.use("/seller/profile", sellerProfileRouter);
app.use("/seller/domain", sellerDomainRouter);
app.use("/seller/tags-manager", sellerTagsManagerRouter);

app.use("/platform/seller-settings", fetchSellerDetailsRouter);
app.use("/platform/home", platformHomeRouter);
app.use("/platform/pages", platformPagesRouter);
app.use("/platform/products", platformProductsRouter);
app.use("/platform/product", productPageRouter);
app.use("/platform/cart", platformCartRouter);
app.use("/platform/coupons", platformCouponsRouter);
app.use("/platform/order", platformPlaceOrderRouter);

app.use("/user/dashboard", userDashboardRouter);
app.use("/user/orders", userOrdersRouter);
app.use("/user/profile", userProfileRouter);
app.use("/user/address", userAddressRouter);
app.use("/user/reviews", userReviewsRouter);
app.use("/user/favourites", userFavouritesRouter);
app.use("/uploads", express.static("uploads"));

app.use("/loomaze", userAuth);
app.use("/loomaze/profile", loomazeUserProfile);
app.use("/loomaze/address", loomazeUserAddress);
app.use("/referrals", referral);
app.use("/payments", payments);

app.use("/admin", adminWithdrawRoutes);
app.use("/withdraw/seller", withdrawRoutes);
app.use("/withdraw/user", userWithdrawRoutes);
app.use("/seller", sellerCheckPlan);

app.use("/plans", planRoutes);

const Plan = require("./models/plan.models");

const DEFAULT_PLANS = [
  {
    name: "basic",
    price: 2000,
    durationDays: 30,
    referralBonusPercent: 5,
    signUpBonusPercent: 0,
    isActive: true,
  },
  {
    name: "grow",
    price: 4000,
    durationDays: 30,
    referralBonusPercent: 5,
    signUpBonusPercent: 0,
    isActive: true,
  },
];

async function seedPlans() {
  try {
    // fetch existing plan names
    const existingPlans = await Plan.find(
      { name: { $in: DEFAULT_PLANS.map((p) => p.name) } },
      { name: 1 }
    ).lean();

    const existingNames = existingPlans.map((p) => p.name);

    // filter only missing plans
    const plansToInsert = DEFAULT_PLANS.filter(
      (p) => !existingNames.includes(p.name)
    );

    if (plansToInsert.length === 0) {
      console.log("✅ Plans seed: already up to date");
      return;
    }

    await Plan.insertMany(plansToInsert);
    console.log(
      `🌱 Plans seed: inserted ${plansToInsert
        .map((p) => p.name)
        .join(", ")}`
    );
  } catch (err) {
    console.error("❌ Plans seed error:", err.message);
  }
}

seedPlans();


const seedDemoCategories = require("./seeds/seedDemoCategories");

seedDemoCategories();

const seedDemoProducts = require("./seeds/seedDemoProducts");

seedDemoProducts();

module.exports = seedPlans;




scheduleMonthlyReferralJob();



const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
