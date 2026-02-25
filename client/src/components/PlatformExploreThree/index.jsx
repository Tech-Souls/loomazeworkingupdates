import React from "react";
import exploreImg from "../../assets/images/platformExplore.jpg";
import { FiArrowRight } from "react-icons/fi";

export default function PlatformExploreThree({ settings, isCustomDomain }) {
    return (
        <section className="px-4 sm:px-8 md:px-16 pb-10 sm:pb-16 md:pb-20">
            <div className=" rounded-[24px] overflow-hidden bg-white">
                <div className="relative w-full h-[400px] sm:h-[500px]">
                    <img
                        src={settings?.content?.exploreMore?.imageURL ? `${settings?.content?.exploreMore?.imageURL}` : exploreImg}
                        alt="brands"
                        loading="lazy"
                        className="w-full h-full object-cover rounded-[24px]" />
                </div>
                <div className="text-center mt-10 space-y-4 px-6 sm:px-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#222]">BRAND THAT YOU CAN TRUST</h1>
                    <p className="text-base sm:text-lg max-w-2xl mx-auto text-[#555]">Explore our handpicked selection of products you loved and enjoy the discount on each purchase.</p>
                    <a href={settings?.content?.exploreMore?.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`)} target="_blank" className="inline-flex items-center gap-2 bg-[var(--pr)] text-white px-6 py-3 font-medium rounded-[24px] transition-all duration-200 ease-in-out hover:bg-[var(--pr)]/10 hover:text-[var(--pr)] hover:border border-[var(--pr)] hover:gap-5" >
                        Explore More <FiArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
}