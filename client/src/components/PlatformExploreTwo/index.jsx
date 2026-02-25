import React from "react";
import exploreImg from "../../assets/images/platformExplore.jpg";
import { FiArrowRight } from "react-icons/fi";
import { Sparkle } from "lucide-react";

export default function PlatformExploreTwo({ settings, isCustomDomain }) {
    return (
        <section className="px-5 sm:px-8 md:px-16 pb-10 sm:pb-16 md:pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[var(--pr)]/10 rounded-[24px] shadow-md overflow-hidden">
                <div className="relative h-[350px] md:h-[500px]">
                    <img
                        src={settings?.content?.exploreMore?.imageURL ? `${settings?.content?.exploreMore?.imageURL}` : exploreImg}
                        alt="brands"
                        loading="lazy"
                        className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center items-center text-center px-6 sm:px-10 md:px-14 py-10 space-y-6">
                    <div className="inline-flex items-center bg-[var(--pr)]/10 text-[var(--pr)] text-sm font-medium px-4 py-2.5 rounded-full gap-2">
                        <Sparkle size={18} /> <span>  Exclusive Discount</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#222]">
                        {settings?.content?.exploreMore?.title || "Brand That You Can Trust"}
                    </h1>
                    <p className="text-[#555] text-base sm:text-lg max-w-md">
                        {settings?.content?.exploreMore?.subtitle || "Explore our handpicked selection of products you loved and enjoy the best discounts here on your each purchase."}
                    </p>
                    <a href={settings?.content?.exploreMore?.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`)} target="_blank" className="inline-flex items-center gap-2 bg-[var(--pr)] text-white px-6 py-3 font-medium rounded-[24px] transition-all duration-200 ease-in-out hover:bg-[var(--pr)]/10 hover:text-[var(--pr)] hover:border border-[var(--pr)] hover:gap-5">
                        Explore More <FiArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
}