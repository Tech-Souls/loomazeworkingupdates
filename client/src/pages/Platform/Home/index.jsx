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
import PlatformHeroTopFashion from '../../../components/PlatformHeroTopFashion'
import PlatformCategoriesFashion from '../../../components/PlatformCategoriesFashion'
import PlatformFeaturedProductsFashion from '../../../components/PlatformFeaturedProductsFashion'
import PlatformRecentProductsFashion from '../../../components/PlatformRecentProductsFashion'
import BrandReviewFour from '../../../components/BrandReviewFour'
import BrandFaqsFour from '../../../components/BrandFaqsFour'
import PlatformCategoriesPremuim from '../../../components/PlatformCategoriesLuxury'
import PlatformCategoriesLuxury from '../../../components/PlatformCategoriesLuxury'

export default function Home({ settings, isCustomDomain }) {
    const style = settings?.layout?.homePageStyle

    const heroTopComponents = {
        fashion: PlatformHeroTopFashion
    };

    const heroComponents = {
        style1: PlatformHero,
        style2: PlatformHeroTwo,
        style3: PlatformHeroThree,
        jewellery: PlatformHeroJewellery,
        fashion: PlatformHeroFashion
    };

    const heroDoubleComponents = {
        jewellery: PlatformHeroDouble,
    };

    const categoriesComponents = {
        style1: PlatformCategories,
        style2: PlatformCategoriesTwo,
        style3: PlatformCategoriesThree,
        jewellery: PlatformCategoriesJewellery,
        fashion: PlatformCategoriesFashion,
        premuim: PlatformCategoriesLuxury,
    };

    const featuresProductsComponents = {
        style1: PlatformFeaturedProducts,
        style2: PlatformFeaturedProductsTwo,
        style3: PlatformFeaturedProductsThree,
        jewellery: PlatformFeaturedProductsJewellery,
        fashion: PlatformFeaturedProductsFashion,
    };

    const recentProductsComponents = {
        style1: PlatformRecentProducts,
        style2: PlatformRecentProductsTwo,
        style3: PlatformRecentProductsThree,
        jewellery: PlatformRecentProductsJewellery,
        fashion: PlatformRecentProductsFashion,
    };

    const exploreComponents = {
        style1: PlatformExplore,
        style2: PlatformExploreTwo,
        style3: PlatformExploreThree,
        jewellery: PlatformExploreDouble,
        fashion: PlatformExploreDouble,
    };

    const imageGalleryComponents = {
        style1: PlatformImageGallery,
        style2: PlatformImageGalleryTwo,
        style3: PlatformImageGalleryTwo,
        jewellery: PlatformImageGallery,
        fashion: PlatformImageGallery,
    };

    const reviewsComponents = {
        style1: BrandReview,
        style2: BrandReviewTwo,
        style3: BrandReviewThree,
        jewellery: BrandReviewFour,
        fashion: BrandReviewFour,
    };

    const faqsComponents = {
        style1: BrandFaqs,
        style2: BrandFaqsThree,
        style3: BrandFaqsThree,
        jewellery: BrandFaqsFour,
        fashion: BrandFaqsFour,
    };

    const HeroTopComponent = heroTopComponents[style] || null;
    const HeroComponent = heroComponents[style] || null;
    const HeroDoubleComponent = heroDoubleComponents[style] || null;
    const CategoriesComponent = categoriesComponents[style] || null;
    const FeaturesProductsComponent = featuresProductsComponents[style] || null;
    const RecentProductsComponent = recentProductsComponents[style] || null;
    const ExploreComponent = exploreComponents[style] || null;
    const ImageGalleryComponent = imageGalleryComponents[style] || null;
    const ReviewsComponent = reviewsComponents[style] || null;
    const FaqsComponent = faqsComponents[style] || null;

    return (
        <div className='w-full overflow-x:hidden'>
            {HeroTopComponent && <HeroTopComponent settings={settings} />}
            {(HeroComponent && settings?.visibility?.showHeroSection) && <HeroComponent settings={settings} isCustomDomain={isCustomDomain} />}
            {(HeroDoubleComponent && settings?.visibility?.showHeroSection) && <HeroDoubleComponent settings={settings} isCustomDomain={isCustomDomain} />}
            {(CategoriesComponent && settings?.visibility?.showCategories) && <CategoriesComponent settings={settings} isCustomDomain={isCustomDomain} />}
            {(FeaturesProductsComponent && settings?.visibility?.showFeaturedProducts) && <FeaturesProductsComponent storeSettings={settings} isCustomDomain={isCustomDomain} />}
            {RecentProductsComponent && <RecentProductsComponent storeSettings={settings} isCustomDomain={isCustomDomain} />}
            {(ExploreComponent && settings?.visibility?.showExploreMore) && <ExploreComponent settings={settings} isCustomDomain={isCustomDomain} />}
            {ImageGalleryComponent && <ImageGalleryComponent settings={settings} />}
            {(ReviewsComponent && settings?.visibility?.showReviews) && <ReviewsComponent storeSettings={settings} isCustomDomain={isCustomDomain} />}
            {FaqsComponent && <FaqsComponent settings={settings} isCustomDomain={isCustomDomain} />}
        </div>
    )
}