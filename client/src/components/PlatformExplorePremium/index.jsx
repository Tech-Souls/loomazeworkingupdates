import React from "react";
import exploreImg from "../../assets/images/platformExplore.jpg";
import { FiArrowRight } from "react-icons/fi";

export default function PlatformExplorePremium({ settings, isCustomDomain }) {
    return (
        <section className="px-4 sm:px-8 py-2 md:px-16 pb-10 sm:pb-16 md:pb-20">
  <div className="rounded-[24px] group relative overflow-hidden bg-white cursor-pointer">

    {/* Image */}
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={
          settings?.content?.exploreMore?.imageURL
            ? `${settings?.content?.exploreMore?.imageURL}`
            : exploreImg
        }
        alt="brands"
        loading="lazy"
        className="w-full h-full object-cover rounded-[24px] 
        transition-transform duration-700 ease-out 
        group-hover:scale-110"
      />
    </div>

    {/* Smoke Gradient Overlay */}
    <div
      className="
      absolute inset-0 
      bg-gradient-to-t 
      from-black/80 
      via-black/50  
      to-transparent 
      opacity-0 
      group-hover:opacity-100 
      transition-all 
      duration-700 
      ease-in-out
      "
    ></div>

    {/* Content */}
    <div
            className="
           absolute bottom-0 w-full
px-6 sm:px-10 pb-10
text-center
translate-y-10 opacity-0
group-hover:translate-y-0
group-hover:opacity-100
transition-all duration-700 ease-in-out
      "
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        BRAND THAT YOU CAN TRUST
      </h1>

      <p className="text-base sm:text-lg text-center text-gray-200 mb-6">
        Explore our handpicked selection of products you loved and enjoy the
        discount on each purchase.
      </p>

      <a
        href={
          settings?.content?.exploreMore?.ctaLink ||
          (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`)
        }
        target="_blank"
        className="
        inline-flex items-center gap-2 
        bg-white text-black 
        px-6 py-3 font-medium 
        rounded-full
        transition-all duration-300
        hover:bg-[var(--pr)] hover:text-white
        hover:gap-4
        "
      >
        Explore More <FiArrowRight size={18} />
      </a>
    </div>

  </div>
</section>
    );
}