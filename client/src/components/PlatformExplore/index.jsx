import React from "react";
import exploreImg from "../../assets/images/platformExplore.jpg";
import { FiArrowRight } from "react-icons/fi";

export default function PlatformExplore({ settings, isCustomDomain }) {
    return (
        <section className="bg-[#f3f3f3] px-5 sm:px-8 md:px-16 py-10 sm:py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-10 md:gap-20">
                <div className="space-y-0 sm:space-y-6 text-center md:text-left order-1 md:order-none md:col-span-2">
                    <h1 className="head text-3xl sm:text-4xl md:text-5xl font-bold text-[#222]">
                        {settings?.content?.exploreMore?.title || "Brand That You Can Trust"}
                    </h1>
                    <div className="hidden md:block space-y-8">
                        <p className="text-[#555] text-base sm:text-lg max-w-md">
                            {settings?.content?.exploreMore?.subtitle || "Explore our handpicked selection of products you loved and enjoy the best discounts here on your each purchase."}
                        </p>
                        <a href={settings?.content?.exploreMore?.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`)} target="_blank" className="inline-flex text-sm items-center gap-2 bg-[var(--pr)] text-white px-6 py-3 font-medium rounded-none transition-all duration-200 ease-out hover:bg-[var(--pr)]/70" >
                            Explore More <FiArrowRight />
                        </a>
                    </div>
                </div>

                <div className="relative order-2 md:order-none md:col-span-3">
                    <img
                        src={settings?.content?.exploreMore?.imageURL ? `${settings?.content?.exploreMore?.imageURL}` : exploreImg}
                        alt="brands"
                        loading="lazy"
                        className="w-full h-[300px] sm:h-[400px] md:h-[480px] object-cover object-center"
                    />
                    <div className="block md:hidden mt-4 space-y-4 text-center">
                        <p className="text-[var(--text)] text-base">
                            Explore our handpicked selection of products you loved and enjoy the best discounts here on your each purchase.
                        </p>
                        <a
                            href={settings?.content?.exploreMore?.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`)}
                            target="_blank"
                            className="inline-flex items-center justify-center bg-[var(--pr)] text-white px-6 py-3 font-medium rounded-none transition-all duration-200 ease-out hover:bg-[var(--pr)]/70"
                        >
                            Explore More <FiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}