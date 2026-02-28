import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function PlatformCategoriesLuxury({ settings, isCustomDomain }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (settings?.sellerID) {
      fetchPlatformHomeCategories();
    }
  }, [settings]);

  const fetchPlatformHomeCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`
      );

      if (res.status === 200) {
        setCategories(res.data?.categories || []);
      }
    } catch (err) {
      console.error("Frontend GET error:", err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const generateLink = (catName) => {
    return isCustomDomain
      ? `/products/${catName}`
      : `/brand/${settings?.brandSlug}/products/${catName}`;
  };

  return (
    <section className="section-categories">
      {loading && (
        <div className="flex justify-center py-10">
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="flex justify-center py-10">
          <p className="text-red-400 text-sm">No category found!</p>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <>
          {categories.length > 3 ? (
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                ref={prevRef}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition"
              >
                <ChevronLeft size={22} className="text-gray-800" />
              </button>

              <button
                ref={nextRef}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition"
              >
                <ChevronRight size={22} className="text-gray-800" />
              </button>

              <Swiper
                modules={[Navigation]}
                speed={500}
                spaceBetween={0}
                loop={true}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  599: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {categories.map((cat) => (
                  <SwiperSlide key={cat._id}>
                    <a
                      href={generateLink(cat.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group cursor-pointer relative overflow-hidden"
                    >
                      <div className="w-full aspect-[3/4] overflow-hidden">
                        <img
                          src={cat.imageURL}
                          alt={cat.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {settings?.layout?.showCategoriesText && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-6">
                          <h3 className="text-white font-bold text-lg capitalize">
                            {cat.name}
                          </h3>
                          <span className="text-white/80 text-xs uppercase tracking-widest">
                            Shop Now →
                          </span>
                        </div>
                      )}
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={generateLink(cat.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group cursor-pointer relative overflow-hidden"
                >
                  <div className="w-full aspect-[3/4] overflow-hidden">
                    <img
                      src={cat.imageURL}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {settings?.layout?.showCategoriesText && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-6">
                      <h3 className="text-white font-bold text-lg capitalize">
                        {cat.name}
                      </h3>
                      <span className="text-white/80 text-xs uppercase tracking-widest">
                        Shop Now →
                      </span>
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}