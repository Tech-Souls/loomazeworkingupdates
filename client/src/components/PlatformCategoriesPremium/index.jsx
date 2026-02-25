import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PlatformCategoriesPremium({
  settings,
  isCustomDomain,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (settings) fetchPlatformHomeCategories();
  }, [settings]);

  const fetchPlatformHomeCategories = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`,
      )
      .then((res) => {
        if (res.status === 200) {
          setCategories(res.data?.categories);
        }
      })
      .catch((err) => console.error("Frontend GET error", err.message))
      .finally(() => setLoading(false));
  };

  return (
    <section className="section-categories py-10 sm:py-14">
      <div className="main-container mx-auto px-4 relative">
        <div className="flex justify-center text-center items-center mb-8 sm:mb-10 md:mb-15 gap-4">
          <h2 className="head  text-[var(--text)] font-bold text-xl sm:text-2xl md:text-3xl">
            Shop by Category
          </h2>
        </div>

        {!loading && categories.length === 0 && (
          <p className="text-red-500">No category found!</p>
        )}

        {!loading && categories.length > 4 ? (
          <div className="relative">
            {/* ---------- CUSTOM ARROWS (same UI) ---------- */}
            <button
              ref={prevRef}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>

            <button
              ref={nextRef}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>

            {/* ---------- SWIPER REPLACING SLICK ---------- */}
            <Swiper
              modules={[Navigation]}
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
              loop={true}
              breakpoints={{
                1024: { slidesPerView: 4 },
                599: { slidesPerView: 3 },
              }}
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat._id}>
                  <div className="px-4 ">
                    <a
                      href={
                        isCustomDomain
                          ? `/products/${cat.name}`
                          : `/brand/${settings?.brandSlug}/products/${cat.name}`
                      }
                      target="_blank"
                      className="block cursor-pointer"
                    >
                     <div className="group overflow-hidden hover:shadow-lg shadow-gray-600 transition-scale duration-200 relative h-[30vh] lg:h-[60vh] rounded-lg">
  <img
    src={`${cat.imageURL}`}
    alt={cat.name}
    loading="lazy"
    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] group-hover:scale-105"
  />

  {settings.layout.showCategoriesText && (
    <h3 className="text-sm transition-all h-10 duration-300 w-full left-0 font-bold py-2 text-center text-gray-900 bg-gray-200 capitalize bottom-0 absolute sm:text-base md:text-xl group-hover:rounded-t-3xl">
      {cat.name}
    </h3>
  )}
</div>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          /* ---------- GRID MODE (unchanged UI) ---------- */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-20">
            {categories.map((cat) => (
              <a
                key={cat._id}
                href={
                  isCustomDomain
                    ? `/products/${cat.name}`
                    : `/brand/${settings?.brandSlug}/products/${cat.name}`
                }
                target="_blank"
                className="block group cursor-pointer"
              >
                <div className="border-2 border-dashed p-1 rounded-full border-gray-300">
                  <div className="w-full aspect-square  relative overflow-hidden rounded-full">
                    <img
                      src={`${cat.imageURL}`}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] group-hover:scale-110"
                    />
                  </div>
                  {settings.layout.showCategoriesText && (
                    <h3 className="font-bold p-6 text-center left-0 absolute bottom-0 z-10 text-gray-900 capitalize text-xl">
                      {cat.name}
                    </h3>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
