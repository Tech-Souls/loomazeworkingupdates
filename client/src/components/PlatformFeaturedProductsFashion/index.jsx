import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductBoxFashion from "../ProductBoxFashion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PlatformFeaturedProductsFashion({ storeSettings, isCustomDomain }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        if (storeSettings) fetchFeaturedProducts();
    }, [storeSettings]);

    const fetchFeaturedProducts = () => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_HOST}/platform/home/fetch-featured-products?sellerID=${storeSettings?.sellerID}`)
            .then((res) => {
                if (res.status === 200) setProducts(res.data?.products);
            })
            .catch((err) => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };

    return (
        <section className="relative main-container px-10 pt-8 pb-20">
            <div className="mb-10">
                <h1 className="text-2xl text-center mb-2 font-bold">
                    Featured Products
                </h1>
                <a
                    href={`/brand/${storeSettings.brandSlug}/pages/products`}
                    target="_blank"
                    className="block text-sm text-center text-[#333] font-bold underline"
                >
                    View All
                </a>
            </div>

            {/* Slider */}
            {products.length > 4 ? (
                <div className="relative ">
                    {/* Prev Button */}
                    <button
                        ref={prevRef}
                        className="absolute left-2 lg:-left-12 top-1/2 -translate-y-1/2 bg-[var(--pr)] text-white p-2 md:p-3 shadow-lg z-20"
                    >
                        <ChevronLeft className="w-3 h-3 md:w-5 md:h-5" />
                    </button>

                

                    {/* Next Button */}
                    <button
                        ref={nextRef}
                        className="absolute right-2  lg:-right-12 top-1/2 -translate-y-1/2 bg-[var(--pr)] text-white p-2 md:p-3 shadow-lg z-20"
                    >
                        <ChevronRight className="w-3  h-3 md:w-5 md:h-5" />
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        speed={600}
                        slidesPerView={2}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }}
                        breakpoints={{
                            1024: { slidesPerView: 4 },
                            599: { slidesPerView: 3 },
                        }}
                    >
                        {products.map((item, idx) => (
                            <SwiperSlide key={idx} className="px-1 sm:px-2">
                                <ProductBoxFashion
                                    item={item}
                                    idx={idx}
                                    settings={storeSettings}
                                    isCustomDomain={isCustomDomain}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {products.map((item, idx) => (
                        <ProductBoxFashion
                            key={idx}
                            item={item}
                            idx={idx}
                            settings={storeSettings}
                            isCustomDomain={isCustomDomain}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}