import React from "react";

// ─── Platform Components ────────────────────────────────────────────────
import PlatformHero from "../../../components/PlatformHero";
import PlatformHeroTwo from "../../../components/PlatformHeroTwo";
import PlatformHeroThree from "../../../components/PlatformHeroThree";
import PlatformHeroJewellery from "../../../components/PlatformHeroJewellery";
import PlatformHeroDouble from "../../../components/PlatformHeroDouble";
import PlatformHeroFashion from "../../../components/PlatformHeroFashion";
import PlatformHeroTopFashion from "../../../components/PlatformHeroTopFashion";
import PlatformHeroPremium from "../../../components/PlatformHeroPremium";

import PlatformCategories from "../../../components/PlatformCategories";
import PlatformCategoriesTwo from "../../../components/PlatformCategoriesTwo";
import PlatformCategoriesThree from "../../../components/PlatformCategoriesThree";
import PlatformCategoriesJewellery from "../../../components/PlatformCategoriesJewellery";
import PlatformCategoriesFashion from "../../../components/PlatformCategoriesFashion";
import PlatformCategoriesPremium from "../../../components/PlatformCategoriesPremium";
import PlatformCategoriesLuxury from "../../../components/PlatformCategoriesLuxury";

import PlatformFeaturedProducts from "../../../components/PlatformFeaturedProducts";
import PlatformFeaturedProductsTwo from "../../../components/PlatformFeaturedProductsTwo";
import PlatformFeaturedProductsThree from "../../../components/PlatformFeaturedProductsThree";
import PlatformFeaturedProductsJewellery from "../../../components/PlatformFeaturedProductsJewellery";
import PlatformFeaturedProductsFashion from "../../../components/PlatformFeaturedProductsFashion";
import PlatformFeaturedProductsPremium from "../../../components/PlatformFeaturedProductsPremium";
import PlatformFeaturedProductsLuxury from "../../../components/PlatformFeaturedProductsLuxury";

import PlatformRecentProducts from "../../../components/PlatformRecentProducts";
import PlatformRecentProductsTwo from "../../../components/PlatformRecentProductsTwo";
import PlatformRecentProductsThree from "../../../components/PlatformRecentProductsThree";
import PlatformRecentProductsJewellery from "../../../components/PlatformRecentProductsJewellery";
import PlatformRecentProductsFashion from "../../../components/PlatformRecentProductsFashion";
import PlatformRecentProductsPremium from "../../../components/PlatformRecentProductsPremium";
import PlatformRecentProductsLuxury from "../../../components/PlatformRecentProductsLuxury";

import PlatformExplore from "../../../components/PlatformExplore";
import PlatformExploreTwo from "../../../components/PlatformExploreTwo";
import PlatformExploreThree from "../../../components/PlatformExploreThree";
import PlatformExploreDouble from "../../../components/PlatformExploreDouble";
import PlatformExplorePremium from "../../../components/PlatformExplorePremium";

import PlatformImageGallery from "../../../components/PlatformImageGallery";
import PlatformImageGalleryTwo from "../../../components/PlatformImageGalleryTwo";
import PlatformImageGalleryFour from "../../../components/PlatformImageGalleryFour";

import PlatformStripperPremium from "../../../components/PlatformStripperPremium";
import SellerSpotlightProductPremium from "../../../components/SellerSpotlightProductPremium";
import PlatformIconsPremium from "../../../components/PlatformIconsPremium";

// ─── Brand Components ────────────────────────────────────────────────
import BrandReview from "../../../components/BrandReview";
import BrandReviewTwo from "../../../components/BrandReviewTwo";
import BrandReviewThree from "../../../components/BrandReviewThree";
import BrandReviewFour from "../../../components/BrandReviewFour";
import BrandReviewPremium from "../../../components/BrandReviewPremium";
import BrandReviewsFive from "../../../components/BrandReviewsFive";

import BrandFaqs from "../../../components/BrandFaqs";
import BrandFaqsThree from "../../../components/BrandFaqsThree";
import BrandFaqsFour from "../../../components/BrandFaqsFour";
import BrandFaqsFive from "../../../components/BrandFaqsFive";

// ─── Tools Components ────────────────────────────────────────────────
import ToolsHeroSection from "../../../components/ToolsHeroSection";
import ToolsCategories from "../../../components/ToolsCategories";
import ToolsBrandsIcon from "../../../components/ToolsBrandsIcon";
import ToolsFeaturedProduct from "../../../components/ToolsFeaturedProduct";
import ToolsSpotlightProduct from "../../../components/ToolsSpotlightProduct";
import ToolsReviewProduct from "../../../components/ToolsReviewProduct";
import ToolsFaqs from "../../../components/ToolsFaqs";
import ToolsImageGallery from "../../../components/ToolsImageGallery";

// ─── Home Component ──────────────────────────────────────────────────
export default function Home({ settings, isCustomDomain }) {
  const style = settings?.layout?.homePageStyle;
  const knownStyles = ["style1", "style2", "style3", "jewellery", "fashion", "luxury", "premium" , 'tools'];
  const effectiveStyle = knownStyles.includes(style) ? style : "style1";

  // ─── Component Mappings ────────────────────────────────────────────
  const heroComponents = {
    style1: PlatformHero,
    style2: PlatformHeroTwo,
    style3: PlatformHeroThree,
    jewellery: PlatformHeroDouble,
    fashion: PlatformHeroFashion,
    premium: PlatformHeroPremium,
    tools: ToolsHeroSection,
  };

  const categoriesComponents = {
    style1: PlatformCategories,
    style2: PlatformCategoriesTwo,
    style3: PlatformCategoriesThree,
    jewellery: PlatformCategoriesJewellery,
    fashion: PlatformCategoriesFashion,
    luxury: PlatformCategoriesLuxury,
    premium: PlatformCategoriesPremium,
    tools: ToolsCategories,
  };

  const featuresProductsComponents = {
    style1: PlatformFeaturedProducts,
    style2: PlatformFeaturedProductsTwo,
    style3: PlatformFeaturedProductsThree,
    jewellery: PlatformFeaturedProductsJewellery,
    fashion: PlatformFeaturedProductsFashion,
    luxury: PlatformFeaturedProductsLuxury,
    premium: PlatformFeaturedProductsPremium,
    tools: ToolsFeaturedProduct,
  };

  const recentProductsComponents = {
    style1: PlatformRecentProducts,
    style2: PlatformRecentProductsTwo,
    style3: PlatformRecentProductsThree,
    jewellery: PlatformRecentProductsJewellery,
    fashion: PlatformRecentProductsFashion,
    luxury: PlatformRecentProductsLuxury,
    premium: PlatformRecentProductsPremium,
  };

  const exploreComponents = {
    style1: PlatformExplore,
    style2: PlatformExploreTwo,
    style3: PlatformExploreThree,
    jewellery: PlatformExploreDouble,
    fashion: PlatformExploreDouble,
    premium: PlatformExplorePremium,
  };

  const imageGalleryComponents = {
    style1: PlatformImageGallery,
    style2: PlatformImageGalleryTwo,
    style3: PlatformImageGalleryTwo,
    jewellery: PlatformImageGallery,
    fashion: PlatformImageGallery,
    luxury: PlatformImageGalleryFour,
    tools: ToolsImageGallery,
  };

  const reviewsComponents = {
    style1: BrandReview,
    style2: BrandReviewTwo,
    style3: BrandReviewThree,
    jewellery: BrandReviewFour,
    fashion: BrandReviewFour,
    luxury: BrandReviewsFive,
    premium: BrandReviewPremium,
    tools: ToolsReviewProduct,
  };

  const faqsComponents = {
    style1: BrandFaqs,
    style2: BrandFaqsThree,
    style3: BrandFaqsThree,
    jewellery: BrandFaqsFour,
    fashion: BrandFaqsFour,
    luxury: BrandFaqsFive,
    tools: ToolsFaqs,
  };

  const stripperComponents = {
    premium: PlatformStripperPremium,
  };

  const spotlightProductComponents = {
    premium: SellerSpotlightProductPremium,
    tools: ToolsSpotlightProduct,
  };

  const brandsComponents = {
    premium: PlatformIconsPremium,
    tools: ToolsBrandsIcon,
  };

  // ─── Resolve Components ────────────────────────────────────────────
  const HeroComponent = heroComponents[effectiveStyle] || null;
  const CategoriesComponent = categoriesComponents[effectiveStyle] || null;
  const FeaturesProductsComponent = featuresProductsComponents[effectiveStyle] || null;
  const RecentProductsComponent = recentProductsComponents[effectiveStyle] || null;
  const ExploreComponent = exploreComponents[effectiveStyle] || null;
  const ImageGalleryComponent = imageGalleryComponents[effectiveStyle] || null;
  const ReviewsComponent = reviewsComponents[effectiveStyle] || null;
  const FaqsComponent = faqsComponents[effectiveStyle] || null;
  const StripperComponent = stripperComponents[effectiveStyle] || null;
  const SpotlightProductComponent = spotlightProductComponents[effectiveStyle] || null;
  const BrandsComponent = brandsComponents[effectiveStyle] || null;

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="w-full overflow-x-hidden">
      {HeroComponent && settings?.visibility?.showHeroSection && (
        <HeroComponent settings={settings} isCustomDomain={isCustomDomain} />
      )}

      {CategoriesComponent && settings?.visibility?.showCategories && (
        <CategoriesComponent settings={settings} isCustomDomain={isCustomDomain} />
      )}

      {FeaturesProductsComponent && settings?.visibility?.showFeaturedProducts && (
        <FeaturesProductsComponent storeSettings={settings} settings={settings} isCustomDomain={isCustomDomain} />
      )}

      {RecentProductsComponent && (
        <RecentProductsComponent storeSettings={settings} isCustomDomain={isCustomDomain} />
      )}

      {StripperComponent && settings?.visibility?.showStripper && (
        <StripperComponent settings={settings} isCustomDomain={isCustomDomain} />
      )}

      {BrandsComponent && settings?.visibility?.showBrands && (
        <BrandsComponent settings={settings} isCustomDomain={isCustomDomain} />
      )}

      {SpotlightProductComponent && settings?.visibility?.showSpotlightProduct && (
        <SpotlightProductComponent settings={settings} storeSettings={settings} />
      )}

      {ExploreComponent && settings?.visibility?.showExploreMore && (
        <ExploreComponent settings={settings} isCustomDomain={isCustomDomain} />
      )}

      {ImageGalleryComponent && <ImageGalleryComponent settings={settings} />}
      {ReviewsComponent && settings?.visibility?.showReviews && (
        <ReviewsComponent storeSettings={settings} isCustomDomain={isCustomDomain} />
      )}
      {FaqsComponent && <FaqsComponent settings={settings} isCustomDomain={isCustomDomain} />}
    </div>
  );
}