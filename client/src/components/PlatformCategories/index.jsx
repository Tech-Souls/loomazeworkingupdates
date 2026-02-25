import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function PlatformCategories({ settings, isCustomDomain }) {
  const cats = [
    {
      _id: "cat1",
      name: "men",
      imageURL:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat2",
      name: "women",
      imageURL:
        "https://images.unsplash.com/photo-1520975698519-59c3e2b22b36?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat3",
      name: "kids",
      imageURL:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat4",
      name: "shoes",
      imageURL:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat5",
      name: "accessories",
      imageURL:
        "https://images.unsplash.com/photo-1512499617640-c2f999098c01?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat6",
      name: "watches",
      imageURL:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    },
  ];

//   const [categories, setCategories] = useState(cats || []);
//   const [loading, setLoading] = useState(true);
const [categories, setCategories] = useState(cats);
const [loading, setLoading] = useState(false);


  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (settings) fetchPlatformHomeCategories();
  }, [settings]);

//   const fetchPlatformHomeCategories = () => {
//     setLoading(true);
//     axios
//       .get(
//         `${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`,
//       )
//       .then((res) => {
//         if (res.status === 200) {
//           setCategories(res.data?.categories);
//         }
//       })
//       .catch((err) => console.error("Frontend GET error", err.message))
//       .finally(() => setLoading(false));
//       if(!categories){
//         setCategories(cats);
        
//       }  // Fallback to dummy data if no categories are returned
//   };


const fetchPlatformHomeCategories = async () => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`
    );

    if (res.status === 200 && res.data?.categories?.length > 0) {
      setCategories(res.data.categories);
    }
    // else → KEEP demo categories
  } catch (err) {
    console.error("Frontend GET error", err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="section-categories py-10 sm:py-14">
      <div className="main-container mx-auto px-4 relative">
        <div className="flex justify-between items-center mb-6 sm:mb-10 gap-4">
          <h2 className="head font-bold text-xl sm:text-2xl md:text-3xl text-[var(--text)]">
            Shop by Category
          </h2>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && categories.length === 0 && (
          <p className="text-red-500">No category found!</p>
        )}

        {!loading && categories.length > 0 && (
          <>
            {categories.length > 4 ? (
              /* ---------- SWIPER MODE (replaces slick) ---------- */
              <div className="relative">
                {/* Prev Btn */}
                <button
                  ref={prevRef}
                  className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 shadow-md p-2 hover:bg-gray-100"
                >
                  <ChevronLeft size={18} className="text-gray-700" />
                </button>

                {/* Next Btn */}
                <button
                  ref={nextRef}
                  className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 shadow-md p-2 hover:bg-gray-100"
                >
                  <ChevronRight size={18} className="text-gray-700" />
                </button>

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
                      <div className="px-2">
                        <a
                          href={
                            isCustomDomain
                              ? `/products/${cat.name}`
                              : `/brand/${settings?.brandSlug}/pages/products/${cat.name}`
                          }
                          target="_blank"
                          className="block group cursor-pointer"
                        >
                          <div className="w-full aspect-square overflow-hidden">
                            <img
                              src={`${cat.imageURL}`}
                              alt={cat.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] group-hover:scale-110"
                            />
                          </div>
                          {settings.layout.showCategoriesText && (
                            <h3 className="head font-bold p-3 text-center text-[var(--text)] capitalize">
                              {cat.name}
                            </h3>
                          )}
                        </a>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              /* ---------- GRID MODE (unchanged) ---------- */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {categories.map((cat) => (
                  <a
                    key={cat._id}
                    href={
                      isCustomDomain
                        ? `/products/${cat.name}`
                        : `/brand/${settings?.brandSlug}/pages/products/${cat.name}`
                    }
                    target="_blank"
                    className="block group cursor-pointer"
                  >
                    <div className="w-full aspect-square overflow-hidden">
                      <img
                        src={`${cat.imageURL}`}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] group-hover:scale-110"
                      />
                    </div>
                    {settings.layout.showCategoriesText && (
                      <h3 className="head font-bold p-3 text-center text-[var(--text)] capitalize">
                        {cat.name}
                      </h3>
                    )}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
