import React from "react";
import exploreImg from "../../assets/images/platformExplore.jpg";

export default function PlatformExploreDouble({ settings, isCustomDomain }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 pb-10 sm:pb-16 md:pb-20">
            <div className="relative flex justify-center items-center sm:items-end group overflow-hidden aspect-4/4 sm:aspect-4/3 px-4">
                <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${settings?.content?.exploreMore?.imageURL ? settings.content.exploreMore.imageURL : exploreImg})`, }}
                ></div>

                <div className="relative z-10 flex flex-col justify-center items-center pb-0 sm:pb-10 md:pb-20">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#202020]">
                        {settings?.content?.exploreMore?.title || "Brand That You Can Trust"}
                    </h3>

                    <p className="text-[#202020] text-sm sm:text-base text-center max-w-md my-4">
                        {settings?.content?.exploreMore?.subtitle || "Explore our handpicked selection of products you loved."}
                    </p>

                    <button
                        className="relative font-bold mt-4"
                        onClick={() => window.open(settings?.content?.exploreMore?.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`), "_blank", "noopener,noreferrer")}
                    >
                        <span className="block px-10 sm:px-12 py-2 sm:py-3 bg-[#202020] hover:bg-white text-white hover:text-[#202020] border border-[#202020] transition-all duration-500 ease-out">
                            Shop Now
                        </span>
                        <span className="absolute w-full h-full top-1.5 left-1.5 border border-[#202020] -z-2"></span>
                    </button>
                </div>
            </div>


            <div className="relative flex justify-center items-center sm:items-end group overflow-hidden aspect-4/4 sm:aspect-4/3 px-4">
                <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${settings?.content?.exploreMore2?.imageURL ? settings.content.exploreMore2.imageURL : exploreImg})`, }}
                ></div>

                <div className="relative z-10 flex flex-col justify-center items-center pb-0 sm:pb-10 md:pb-20">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#202020]">
                        {settings?.content?.exploreMore2?.title || "Brand That You Can Trust"}
                    </h3>

                    <p className="text-[#202020] text-sm sm:text-base text-center max-w-md my-4">
                        {settings?.content?.exploreMore2?.subtitle || "Explore our handpicked selection of products you loved."}
                    </p>

                    <button
                        className="relative font-bold mt-4"
                        onClick={() => window.open(settings?.content?.exploreMore2?.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`), "_blank", "noopener,noreferrer")}
                    >
                        <span className="block px-10 sm:px-12 py-2 sm:py-3 bg-[#202020] hover:bg-white text-white hover:text-[#202020] border border-[#202020] transition-all duration-500 ease-out">
                            Shop Now
                        </span>
                        <span className="absolute w-full h-full top-1.5 left-1.5 border border-[#202020] -z-2"></span>
                    </button>
                </div>
            </div>
        </section>
    );
}