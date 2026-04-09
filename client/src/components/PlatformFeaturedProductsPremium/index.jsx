import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductBoxPremium from "../ProductBoxPremium";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PlatformFeaturedProductsPremium({
  storeSettings,
  isCustomDomain,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storeSettings) fetchFeaturedProducts();
  }, [storeSettings]);

  const fetchFeaturedProducts = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-featured-products?sellerID=${storeSettings?.sellerID}`,
      )
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data?.products);
        }
      })
      .catch((err) => console.error("Frontend GET error", err.message))
      .finally(() => setLoading(false));
  };

  return (
    <section className="relative main-container mt-20 font-[Inter] px-4 pt-8 ">
      <div className="w-full flex items-center justify-center flex-col mb-10 gap-3">
        <p className="text-lg text-blue-600 font-semibold">Bestsellers</p>
        <h1 className="text-4xl text-gray-900 text-center mb-2 font-semibold">
          Most-Loved Products
        </h1>
        <p className="text-sm">Discover the top-rated and most popular picks that everyone’s talking about.


</p>
      </div>

      {/* Slider OR Grid */}
      {products.length > 4 ? (
        <div className="relative   grid gap-3 lg:gap-6 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]  justify-center items-center">
          {products.map((item, idx) => (
            <ProductBoxPremium
              item={item}
              idx={idx}
              settings={storeSettings}
              isCustomDomain={isCustomDomain}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((item, idx) => (
            <ProductBoxPremium
              key={idx}
              item={item}
              idx={idx}
              settings={storeSettings}
              isCustomDomain={isCustomDomain}
            />
          ))}
        </div>
      )}

      <a
        href={`/brand/${storeSettings.brandSlug}/pages/products`}
        target="_blank"
        className="block relative overflow-hidden  mt-5 rounded-lg h-10 group border transition-colors duration-300 hover:bg-[#304FFE] border-[#304FFE] font-semibold  lg:w-80 mx-auto  "
      >
        <span className=" w-full -group-hover:top-10 absolute left-0 h-full flex items-center justify-center transition-all duration-75  bg-transparent  font-semibold  text-[#304FFE] text-center ">
          Shop All
        </span>
        <span className=" w-full h-full flex bg-transparent  items-center justify-center  absolute left-0 top-10 transition-all  duration-300 ease-in-out group-hover:top-0 font-semibold  text-white text-center ">
          Shop All
        </span>
      </a>
    </section>
  );
}
