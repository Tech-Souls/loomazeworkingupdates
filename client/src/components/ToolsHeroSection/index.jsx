import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

// Assets
import heroWebImg from "../../assets/images/hero-img.webp";
import heroRayImg from "../../assets/images/heroImg-rayban.webp";
import heroShoesImg from "../../assets/images/heroImg-shoes.webp";
import heroCamImg from "../../assets/images/heroImg-camera.webp";

function ToolsHeroSection({ settings, isCustomDomain }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setshowCategories] = useState(false);

  const dummy = [
    { image: heroRayImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
    { image: heroWebImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
    { image: heroShoesImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
    { image: heroCamImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
  ];

  const cats = [
    { _id: "cat1", name: "men" },
    { _id: "cat2", name: "women" },
    { _id: "cat3", name: "kids" },
    { _id: "cat4", name: "shoes" },
    { _id: "cat5", name: "accessories" },
    { _id: "cat6", name: "watches" },
  ];

  useEffect(() => {
    if (settings) fetchCategories();
  }, [settings]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`
      );
      if (res.status === 200 && res.data?.categories?.length > 0) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Frontend GET error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const [slides, setSlides] = useState(dummy);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (settings?.content?.heroSlider?.length > 0) {
      setSlides(settings.content.heroSlider);
    } else {
      setSlides(dummy);
    }
  }, [settings]);

  useEffect(() => {
    if (categories.length === 0) {
      setCategories(cats);
    }
  }, [categories]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [index, slides.length]);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      zIndex: 0,
    }),
  };

  // Sirf return statement mein ye changes karein:

return (
  <section className="w-full relative flex flex-col md:flex-row gap-5 h-auto px-5 lg:h-[80vh]">
    
    {/* ✅ SIDEBAR (DESKTOP) */}
    <aside className="hidden md:flex w-70 h-fit relative font-[roboto-condensed] bg-gray-300 rounded-xl flex-col shrink-0 overflow-hidden transition-all duration-500">
      
      {/* Header */}
      <div className="w-full relative flex items-center rounded-t-xl z-10 justify-between p-5 text-white text-lg font-semibold h-12 bg-[#E53935] shrink-0">
        <p className="text-xl">Shop by</p>
        <Menu size={"20px"} />
      </div>

      {/* Categories - Desktop functionality intact */}
      <div
        className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
          showCategories ? "max-h-[1000px]" : "max-h-0 md:max-h-none"
        }`}
      >
        {categories.map((cat, i) => (
          <a
            key={cat._id || i}
            target="_blank"
            href={isCustomDomain ? `/products/${cat.name}` : `/brand/${settings?.brandSlug}/pages/products/${cat.name}`}
            className="block group cursor-pointer"
          >
            <div className="w-full h-12 font-bold text-lg p-5 text-gray-600 flex items-center gap-3 px-5 border-b border-gray-400 hover:text-[#E53935] transition-colors">
              <span className="uppercase">{cat.name}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Toggle Button */}
      <div className="w-full bg-gray-300 border-t border-gray-400">
        <button
          onClick={() => setshowCategories(!showCategories)}
          className="w-full py-3 text-red-600 font-bold text-lg hover:bg-gray-400/20 transition-all flex items-center cursor-pointer justify-start px-5 gap-2 group"
        >
          <span className="flex items-center gap-2 group-hover:underline group-hover:underline-offset-4 group-hover:decoration-red-600">
            {showCategories ? (
              <>Show Less <ChevronUp size={20} /></>
            ) : (
              <>Show All <ChevronDown size={20} /></>
            )}
          </span>
        </button>
      </div>
    </aside>

    {/* ✅ SLIDER - Fixed for iPad Height */}
    <div className="flex-1 relative w-full aspect-[16/9] md:aspect-[16/7] lg:h-full lg:aspect-auto">
      <div className="w-full h-full rounded-xl overflow-hidden relative bg-gray-200">

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <a href={slides[index]?.ctaLink} className="w-full h-full block">
              <img
                src={slides[index]?.image}
                alt="Hero Slide"
                className="w-full h-full object-cover"
              />
            </a>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/70 p-2 shadow-lg hover:bg-white text-white hover:text-black transition-all"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/70 p-2 shadow-lg hover:bg-white text-white hover:text-black transition-all"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                i === index ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </div>

  </section>
);
}

export default ToolsHeroSection;