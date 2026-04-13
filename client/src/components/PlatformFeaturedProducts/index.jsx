import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductBox from "../ProductBox";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

const NextArrow = () => (
    <button
        className="platform-featured-next absolute right-2 lg:-right-12 top-1/2 -translate-y-1/2 bg-[var(--pr)] text-white p-2 md:p-3 shadow-lg z-20"
    >
        <ChevronRight className="w-3 h-3 md:w-5 md:h-5" size={28} />
    </button>
);

const PrevArrow = () => (
    <button
        className="platform-featured-prev absolute left-2 lg:-left-12 top-1/2 -translate-y-1/2 bg-[var(--pr)] text-white p-2 md:p-3 shadow-lg z-20"
    >
        <ChevronLeft className="w-3 h-3 md:w-5 md:h-5" size={28} />
    </button>
);

export default function PlatformFeaturedProducts({ storeSettings, isCustomDomain }) {
    const demoProducts = [
  {
    _id: "p1",
    slug: "wireless-headphones",
    title: "Wireless Bluetooth Headphones",
    name: "Wireless Bluetooth Headphones",
    mainImageURL:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    price: 4999,
    comparedPrice: 6999,
    hasMultipleVariants: false,
    hasOptions: false
  },
  {
    _id: "p2",
    slug: "smart-watch",
    title: "Smart Fitness Watch",
    name: "Smart Fitness Watch",
    mainImageURL:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    price: 8999,
    comparedPrice: 10999,
    hasMultipleVariants: true,
    hasOptions: true
  },
  {
    _id: "p3",
    slug: "running-shoes",
    title: "Lightweight Running Shoes",
    name: "Lightweight Running Shoes",
    mainImageURL:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    price: 7499,
    comparedPrice: 7499,
    hasMultipleVariants: true,
    hasOptions: false
  },
  {
    _id: "p4",
    slug: "leather-backpack",
    title: "Premium Leather Backpack",
    name: "Premium Leather Backpack",
    mainImageURL:
      "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=80",
    price: 12999,
    comparedPrice: 15999,
    hasMultipleVariants: false,
    hasOptions: false
  },
  {
    _id: "p5",
    slug: "minimal-lamp",
    title: "Minimal Desk Lamp",
    name: "Minimal Desk Lamp",
    mainImageURL:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
    price: 3599,
    comparedPrice: 4999,
    hasMultipleVariants: false,
    hasOptions: true
  }
];

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (storeSettings) fetchFeaturedProducts();
    }, [storeSettings]);

    const fetchFeaturedProducts = () => {
        setLoading(true);
        axios
            .get(
                `${import.meta.env.VITE_HOST}/platform/home/fetch-featured-products?sellerID=${storeSettings?.sellerID}`
            )
            .then((res) => {
                console.log("Fetched featured products:", res.data);
                if (res.status === 200 && res.data.products.length > 0) {
                    setProducts(res.data.products);
                }
            } )
            .catch((err) => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };

    return (
        <section className="relative main-container px-4 pt-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h1 className=" head text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text)]">
                    Featured Product
                </h1>
                <a
                    href={`/brand/${storeSettings?.brandSlug}/pages/products`}
                    target="_blank"
                    className="text-sm sm:text-[16px] text-[var(--pr)] font-bold hover:underline"
                >
                    View All →
                </a>
            </div>

            {products?.length > 4 ? (
                <div className="relative">

                    {/* Swiper Arrows */}
                    <PrevArrow />
                    <NextArrow />

                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            nextEl: ".platform-featured-next",
                            prevEl: ".platform-featured-prev",
                        }}
                        speed={600}
                        slidesPerView={2}
                        breakpoints={{
                            1024: { slidesPerView: 4 },
                            599: { slidesPerView: 3 },
                        }}
                    >
                        {products?.map((item, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="px-1 sm:px-2">
                                    <ProductBox
                                        item={item}
                                        idx={idx}
                                        settings={storeSettings}
                                        isCustomDomain={isCustomDomain}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                /* Grid UI unchanged */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {products?.map((item, idx) => (
                        <ProductBox
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