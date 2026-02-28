import React from 'react'
import PlatformHero from '../../../components/PlatformHero'
import PlatformCategories from '../../../components/PlatformCategories'
import PlatformFeaturedProducts from '../../../components/PlatformFeaturedProducts'
import PlatformRecentProducts from '../../../components/PlatformRecentProducts'
import PlatformExplore from '../../../components/PlatformExplore'
import BrandFaqs from '../../../components/BrandFaqs'
import BrandReview from '../../../components/BrandReview'
import PlatformHeroTwo from '../../../components/PlatformHeroTwo'
import PlatformCategoriesTwo from '../../../components/PlatformCategoriesTwo'
import PlatformFeaturedProductsTwo from '../../../components/PlatformFeaturedProductsTwo'
import PlatformExploreTwo from '../../../components/PlatformExploreTwo'
import BrandReviewTwo from '../../../components/BrandReviewTwo'
import PlatformRecentProductsTwo from '../../../components/PlatformRecentProductsTwo'
import PlatformHeroThree from '../../../components/PlatformHeroThree'
import PlatformCategoriesThree from '../../../components/PlatformCategoriesThree'
import PlatformFeaturedProductsThree from '../../../components/PlatformFeaturedProductsThree'
import PlatformExploreThree from '../../../components/PlatformExploreThree'
import PlatformRecentProductsThree from '../../../components/PlatformRecentProductsThree'
import BrandReviewThree from '../../../components/BrandReviewThree'
import BrandFaqsThree from '../../../components/BrandFaqsThree'
import PlatformHeroJewellery from '../../../components/PlatformHeroJewellery'
import PlatformHeroDouble from '../../../components/PlatformHeroDouble'
import PlatformCategoriesJewellery from '../../../components/PlatformCategoriesJewellery'
import PlatformFeaturedProductsJewellery from '../../../components/PlatformFeaturedProductsJewellery'
import PlatformRecentProductsJewellery from '../../../components/PlatformRecentProductsJewellery'
import PlatformExploreDouble from '../../../components/PlatformExploreDouble'
import PlatformImageGallery from '../../../components/PlatformImageGallery'
import PlatformImageGalleryTwo from '../../../components/PlatformImageGalleryTwo'
import PlatformHeroFashion from '../../../components/PlatformHeroFashion'
import PlatformCategoriesFashion from '../../../components/PlatformCategoriesFashion'
import PlatformFeaturedProductsFashion from '../../../components/PlatformFeaturedProductsFashion'
import PlatformRecentProductsFashion from '../../../components/PlatformRecentProductsFashion'
import BrandReviewFour from '../../../components/BrandReviewFour'
import BrandFaqsFour from '../../../components/BrandFaqsFour'
import PlatformCategoriesLuxury from '../../../components/PlatformCategoriesLuxury'
import PlatformFeaturedProductsLuxury from '../../../components/PlatformFeaturedProductsLuxury'
import PlatformRecentProductsLuxury from "../../../components/PlatformRecentProductsLuxury"
import PlatformImageGalleryFour from '../../../components/PlatformImageGalleryFour'
import BrandReviewsFive from '../../../components/BrandReviewsFive'
import BrandFaqsFive from '../../../components/BrandFaqsFive'

export default function Home({ settings, isCustomDomain }) {
    const style = settings?.layout?.homePageStyle

    const knownStyles = ['style1', 'style2', 'style3', 'jewellery', 'fashion', 'luxury']
    const effectiveStyle = knownStyles.includes(style) ? style : 'style1'

    // ─── Component maps ──────────────────────────────────────────────────────

    // ✅ ONE hero per theme — no heroTopComponents, no heroDoubleComponents
    // jewellery uses PlatformHeroDouble as its single hero (not PlatformHeroJewellery + PlatformHeroDouble)
    // fashion uses PlatformHeroFashion as its single hero (PlatformHeroTopFashion removed — was duplicate)
    // luxury has NO hero here — video hero lives inside PlatformHeader
    const heroComponents = {
        style1:    PlatformHero,
        style2:    PlatformHeroTwo,
        style3:    PlatformHeroThree,
        jewellery: PlatformHeroDouble,   // ✅ was showing PlatformHeroJewellery + PlatformHeroDouble (2 sliders)
        fashion:   PlatformHeroFashion,  // ✅ was showing PlatformHeroTopFashion + PlatformHeroFashion (2 sliders)
    }

    const categoriesComponents = {
        style1:    PlatformCategories,
        style2:    PlatformCategoriesTwo,
        style3:    PlatformCategoriesThree,
        jewellery: PlatformCategoriesJewellery,
        fashion:   PlatformCategoriesFashion,
        luxury:    PlatformCategoriesLuxury,
    }

    const featuresProductsComponents = {
        style1:    PlatformFeaturedProducts,
        style2:    PlatformFeaturedProductsTwo,
        style3:    PlatformFeaturedProductsThree,
        jewellery: PlatformFeaturedProductsJewellery,
        fashion:   PlatformFeaturedProductsFashion,
        luxury:    PlatformFeaturedProductsLuxury,
    }

    const recentProductsComponents = {
        style1:    PlatformRecentProducts,
        style2:    PlatformRecentProductsTwo,
        style3:    PlatformRecentProductsThree,
        jewellery: PlatformRecentProductsJewellery,
        fashion:   PlatformRecentProductsFashion,
        luxury:    PlatformRecentProductsLuxury,
    }

    const exploreComponents = {
        style1:    PlatformExplore,
        style2:    PlatformExploreTwo,
        style3:    PlatformExploreThree,
        jewellery: PlatformExploreDouble,
        fashion:   PlatformExploreDouble,
    }

    const imageGalleryComponents = {
        style1:    PlatformImageGallery,
        style2:    PlatformImageGalleryTwo,
        style3:    PlatformImageGalleryTwo,
        jewellery: PlatformImageGallery,
        fashion:   PlatformImageGallery,
        luxury:    PlatformImageGalleryFour,
    }

    const reviewsComponents = {
        style1:    BrandReview,
        style2:    BrandReviewTwo,
        style3:    BrandReviewThree,
        jewellery: BrandReviewFour,
        fashion:   BrandReviewFour,
        luxury:    BrandReviewsFive,
    }

    const faqsComponents = {
        style1:    BrandFaqs,
        style2:    BrandFaqsThree,
        style3:    BrandFaqsThree,
        jewellery: BrandFaqsFour,
        fashion:   BrandFaqsFour,
        luxury:    BrandFaqsFive,
    }

    // ─── Resolve components ──────────────────────────────────────────────────
    const HeroComponent             = heroComponents[effectiveStyle]             || null
    const CategoriesComponent       = categoriesComponents[effectiveStyle]       || null
    const FeaturesProductsComponent = featuresProductsComponents[effectiveStyle] || null
    const RecentProductsComponent   = recentProductsComponents[effectiveStyle]   || null
    const ExploreComponent          = exploreComponents[effectiveStyle]          || null
    const ImageGalleryComponent     = imageGalleryComponents[effectiveStyle]     || null
    const ReviewsComponent          = reviewsComponents[effectiveStyle]          || null
    const FaqsComponent             = faqsComponents[effectiveStyle]             || null

    return (
        <div className='w-full overflow-x-hidden'>
            {(HeroComponent && settings?.visibility?.showHeroSection) && (
                <HeroComponent settings={settings} isCustomDomain={isCustomDomain} />
            )}
            {(CategoriesComponent && settings?.visibility?.showCategories) && (
                <CategoriesComponent settings={settings} isCustomDomain={isCustomDomain} />
            )}
            {(FeaturesProductsComponent && settings?.visibility?.showFeaturedProducts) && (
                <FeaturesProductsComponent storeSettings={settings} isCustomDomain={isCustomDomain} />
            )}
            {RecentProductsComponent && (
                <RecentProductsComponent storeSettings={settings} isCustomDomain={isCustomDomain} />
            )}
            {(ExploreComponent && settings?.visibility?.showExploreMore) && (
                <ExploreComponent settings={settings} isCustomDomain={isCustomDomain} />
            )}
            {ImageGalleryComponent && (
                <ImageGalleryComponent settings={settings} />
            )}
            {(ReviewsComponent && settings?.visibility?.showReviews) && (
                <ReviewsComponent storeSettings={settings} isCustomDomain={isCustomDomain} />
            )}
            {FaqsComponent && (
                <FaqsComponent settings={settings} isCustomDomain={isCustomDomain} />
            )}
        </div>
    )
}