const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingsSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: "sellers", required: true, unique: true },
    brandName: { type: String, unique: true, required: true },
    brandSlug: { type: String, unique: true, required: true },
    domain: { type: String, unique: true, sparse: true, default: null },
    logo: { type: String, default: null },
    favicon: { type: String, default: null },

    // Theme
    theme: {
        primary: { type: String, default: '#0795E6' },
        secondary: { type: String, default: '#000000' },
    },

    // Layout
    layout: {
        homePageStyle: { type: String, default: 'style1' },
        categoriesSection: { type: String, enum: ['grid', 'carousel'], default: 'grid' },
        showCategoriesText: { type: Boolean, default: true },
        productListing: { type: String, enum: ['grid', 'list'], default: 'grid' },
    },

    // Content
    content: {
        topNotifications: {
            type: [String],
            default: ["Get 100% Free Shipping on order above 5000", "Use our coupons to get extra discounts"]
        },
        headerMenuName: { type: String, default: "Main Menu" },
        heroSlider: [{
            title: { type: String, default: null },
            subtitle: { type: String, default: null },
            ctaLink: { type: String, default: null },
            image: { type: String, default: null },
        }],
        heroSlider2: [{
            title: { type: String, default: null },
            subtitle: { type: String, default: null },
            ctaLink: { type: String, default: null },
            image: { type: String, default: null },
        }],
        exploreMore: {
            title: { type: String, default: null },
            subtitle: { type: String, default: null },
            ctaLink: { type: String, default: null },
            imageURL: { type: String, default: null },
        },
        exploreMore2: {
            title: { type: String, default: null },
            subtitle: { type: String, default: null },
            ctaLink: { type: String, default: null },
            imageURL: { type: String, default: null },
        },
        currency: { type: String, default: 'Rs' },
        footerMenu1Name: { type: String, default: "Footer Menu 1" },
        footerMenu2Name: { type: String, default: "Footer Menu 2" }
    },

    // Visibility - Home Page
    visibility: {
        showTopNotification: { type: Boolean, default: true },
        showHeroSection: { type: Boolean, default: true },
        showCategories: { type: Boolean, default: true },
        autoplayCategories: { type: Boolean, default: false },
        autoplayCategoriesSpeed: { type: Number, default: 1 },
        showFeaturedProducts: { type: Boolean, default: true },
        showExploreMore: { type: Boolean, default: true },
        showReviews: { type: Boolean, default: true },
        showRatings: { type: Boolean, default: true },
    },

    // Product Page Sale Section
    sale: {
        saleEndTime: { type: Date, default: null },
        saleBoxBgColor: { type: String, default: "#000000" },
        saleHeading: { type: String, default: "Hurry Up! Sale ends in" },
        saleBoxTextColor: { type: String, default: "#ffffff" },
    },

    shippingGap: { type: Number, default: 1 },
    deliveryGap: { type: Number, default: 3 },

    // Visibility - Product Page
    productPageVisibility: {
        showCountDown: { type: Boolean, default: true },
        showPeopleViewing: { type: Boolean, default: true },
        showDeliveryDateEstimate: { type: Boolean, default: true },
        showStoreServices: { type: Boolean, default: true },
    },

    // Support Details
    support: {
        email: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        whatsappNumber: { type: String, default: null },
    },

    // Socials
    socials: {
        facebook: {
            show: { type: Boolean, default: true },
            link: { type: String, default: null },
        },
        instagram: {
            show: { type: Boolean, default: true },
            link: { type: String, default: null },
        },
        tiktok: {
            show: { type: Boolean, default: true },
            link: { type: String, default: null },
        },
        x: {
            show: { type: Boolean, default: false },
            link: { type: String, default: null },
        },
        youtube: {
            show: { type: Boolean, default: false },
            link: { type: String, default: null },
        },
        snapchat: {
            show: { type: Boolean, default: false },
            link: { type: String, default: null },
        },
    },

    footerDescription: { type: String, default: "Get exclusive deals and great quality products from here." },

    // Payment Modes
    paymentModes: {
        cod: { type: Boolean, default: true },
        online: [{
            bankName: { type: String, default: null },
            accountName: { type: String, default: null },
            accountNumber: { type: String, default: null },
            isActive: { type: Boolean, default: true }
        }]
    },

    // Delivery Charges
    deliveryCharges: {
        amount: { type: Number, default: null },
        freeDeliveryAbove: { type: Number, default: null },
        byWeight: { type: Number, default: null },
    },

    // SEO Tags
    trackingTags: {
        googleAnalytics: { type: String, default: null },
        googleTagManager: { type: String, default: null },
        googleSearchConsole: { type: String, default: null },
        googleAdsConversion: { type: String, default: null },
        facebookPixel: { type: String, default: null },
        tiktokPixel: { type: String, default: null },
        pinterestTag: { type: String, default: null },
    },
}, { timestamps: true });

const settingsModel = mongoose.models.settings || mongoose.model("settings", settingsSchema);
module.exports = settingsModel;