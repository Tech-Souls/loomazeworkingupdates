
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroWebImg from "../../assets/images/hero-img.webp";
import heroRayImg from "../../assets/images/heroImg-rayban.webp";
import heroShoesImg from "../../assets/images/heroImg-shoes.webp";
import heroCamImg from "../../assets/images/heroImg-camera.webp";

export default function PlatformHeroPremium({ settings, isCustomDomain }) {
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

  const [slides, setSlides] = useState(dummy);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    if (settings?.content?.heroSlider?.length > 0) {
      setSlides(settings.content.heroSlider);
      console.log("setting is" + slides);
    } else {
      setSlides(dummy);
    }
  }, [settings]);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  });

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[index];
  const heroSliderDataExists =
    settings?.content?.heroSlider?.length > 0 ? true : false;

  useEffect(() => {
    const src = !heroSliderDataExists ? slide.image : `${slide.image}`;
    // Extension nikalne ke liye logic
    const checkVideo = src.match(/\.(mp4|webm|ogg)$|video/i);
    setIsVideo(!!checkVideo);
  }, [index, settings]);

  return (
    <section className="relative w-full p-5 overflow-hidden">
      <div className="relative w-full lg:h-[85vh] h-[60vh] rounded-xl overflow-hidden perspective">
        {/* Slide Animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.a
            key={index}
            href={
              slide.ctaLink ||
              (isCustomDomain ? "/" : `/brand/${settings?.brandSlug}`)
            }
            target="_blank"
            custom={direction}
            initial={{ rotateY: direction > 0 ? 90 : -90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: direction > 0 ? -90 : 90 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 block w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              transformOrigin: "center center",
            }}
          >
            {isVideo ? (
              <video
                loading="lazy"
                autoPlay
                loop
                muted
                className="w-full h-full object-cover  absolute z-10"
                src={!heroSliderDataExists ? slide.image : `${slide.image}`}
              ></video>
            ) : (
              <img
                loading="lazy"
                src={!heroSliderDataExists ? slide.image : `${slide.image}`}
                alt="banner"
                className="w-full h-full lg:object-center object-[80%_90%] object-cover"
              />
            )}

            {/* {/* <img
              src={!heroSliderDataExists ? slide.image : `${slide.image}`}
              alt="banner"
              className="w-full h-full lg:object-center object-[80%_90%] object-cover"
            /> */}
            {/* <video autoPlay loop muted className="w-full h-full object-cover absolute z-10" src={!heroSliderDataExists ? slide.image : `${slide.image}`}></video> */}

            {(slide.title || slide.subtitle) && (
              <div className="absolute w-full p-4 left-1/2 -translate-x-1/2 sm:left-56 sm:translate-x-0 top-1/2 -translate-y-1/2">
                {slide.title && (
                  <h2 className="text-white text-2xl md:text-4xl font-bold">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-white max-w-xs text-sm my-4">
                    {slide.subtitle}
                  </p>
                )}
                <button
                  // onClick={() => window.open(slide.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`), "_blank", "noopener,noreferrer")}
                  className="px-10 py-3 bg-black text-white rounded-full font-bold mt-4"
                >
                  Shop Now
                </button>
              </div>
            )}
          </motion.a>
        </AnimatePresence>

        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white text-black hover:bg-black hover:text-white transition duration-500 rounded-full p-2"
        >
          <ChevronLeft size={35} />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white text-black hover:bg-black hover:text-white transition duration-500 rounded-full p-2"
        >
          <ChevronRight size={35} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 w-full flex justify-center gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
