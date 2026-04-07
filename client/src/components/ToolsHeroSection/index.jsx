import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

import heroWebImg from "../../assets/images/hero-img.webp";
import heroRayImg from "../../assets/images/heroImg-rayban.webp";
import heroShoesImg from "../../assets/images/heroImg-shoes.webp";
import heroCamImg from "../../assets/images/heroImg-camera.webp";

function ToolsHeroSection({ settings, isCustomDomain }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const dummy = [
    {
      image: heroRayImg,
      ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}`,
    },
    {
      image: heroWebImg,
      ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}`,
    },
    {
      image: heroShoesImg,
      ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}`,
    },
    {
      image: heroCamImg,
      ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}`,
    },
  ];
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

  useEffect(() => {
    if (settings) fetchCategories();
  }, [settings]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`,
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

  const [slides, setSlides] = useState(dummy);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState('right');
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
  }, [settings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('right');
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setDirection('right');
    setIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection('left');
    setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full relative flex mb-10 gap-5  h-[80vh] px-5">
      <aside className="w-70 h-full shrink-0 rounded-t-xl overflow-hidden">
        <div
          className="w-full flex items-center justify-between p-5 text-white text-lg
         font-semibold  h-15 bg-[#E53935]"
        >
          <p>Shop by</p>
          <Menu />
        </div>
        <div className="w-full pb-5 h-full bg-gray-300 ">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="w-full h-12 font-bold text-lg p-5  text-gray-600 flex items-center gap-3 px-5 border-b hover:text-[#E53935] cursor-pointer"
            >
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </aside>

          <div className="w-full h-full p-2">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
            <AnimatePresence>
                <motion.a
                  href={slides[index]?.ctaLink}
                  className="w-full h-full rounded-xl overflow-hidden relative"
                  key={index}
                  initial={{ x: direction === 'right' ? 300 : -300, }}
                  animate={{ x: 0,  }}
                  exit={{ x: direction === 'right' ? -300 : 300, }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={slides[index]?.image}
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                </motion.a>
              </AnimatePresence>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2  -translate-y-1/2 rounded-full bg-black/90 p-2 shadow-lg hover:bg-white text-white hover:text-black transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/90 p-2 shadow-lg hover:bg-white text-white hover:text-black transition-colors"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === index ? "bg-white" : "bg-white/50"
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
