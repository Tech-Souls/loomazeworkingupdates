import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroWebImg from "../../assets/images/hero-img.webp";
import heroRayImg from "../../assets/images/heroImg-rayban.webp";
import heroShoesImg from "../../assets/images/heroImg-shoes.webp";
import heroCamImg from "../../assets/images/heroImg-camera.webp";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-3 z-10 bg-black/20 hover:scale-105 transition-all duration-[400ms] hover:border  rounded-full -translate-y-1/2 p-2 text-white"
    onClick={onClick}
  >
    <ChevronRight size={35} />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-3 top-1/2 z-10 p-2 -translate-y-1/2 text-white bg-black/20 hover:scale-105 transition-all duration-[400ms] hover:border  rounded-full "
    onClick={onClick}
  >
    <ChevronLeft size={35} />
  </button>
);

export default function PlatformHeroPremium({ settings, isCustomDomain }) {
  const storeSettings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: false,
  };

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

  useEffect(() => {
    if (settings?.content?.heroSlider?.length > 0) {
      setSlides(settings.content.heroSlider);
    } else {
      setSlides(dummy);
    }
  }, [settings]);

  return (
    <section className="relative w-full  hero-two-slider lg:px-5 md:px-3 px-2  py-2 transition-transform duration-[400ms] hover:scale-x-102 overflow-hidden">
      <Slider
        {...storeSettings}
        className="[&_.slick-list]:overflow-hidden [&_.slick-list]:rounded-2xl "
      >
        {slides.map((slide, i) => {
          const heroSliderDataExists =
            settings?.content?.heroSlider?.length > 0 ? true : false;
          return (
            <a
              key={i}
              href={
                slide.ctaLink ||
                (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`)
              }
              target="_blank"
              className="block  overflow-hidden"
            >
              <img
                src={!heroSliderDataExists ? slide.image : `${slide.image}`}
                alt={`banner-${i + 1}`}
                loading="lazy"
                className="mx-auto h-[30vh] sm:h-[50vh] md:h-[70vh] lg:h-[95vh]
                         w-full object-cover transition-transform duration-[1000ms]
                         ease-[cubic-bezier(0.7,0,0.3,1)] hover:scale-105"
              />

              {(slide.title || slide.subtitle) && (
                <div className="absolute w-full p-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-56 top-1/2 -translate-y-1/2 flex flex-col justify-center items-start">
                  {slide.title && (
                    <h2 className="text-[#202020] text-2xl md:text-4xl font-bold">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-[#202020] w-full max-w-xs text-sm my-4">
                      {slide.subtitle}
                    </p>
                  )}
                  {(slide.title || slide.subtitle) && (
                    <button
                      className="relative px-10 sm:px-16 py-2.5 sm:py-3 text-sm sm:text-base bg-[#202020] text-white rounded-full font-bold mt-4 z-30 transition-all duration-500 ease-out"
                      // onClick={() => window.open(slide.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`), "_blank", "noopener,noreferrer")}
                    >
                      Shop Now
                    </button>
                  )}
                </div>
              )}
            </a>
          );
        })}
      </Slider>
    </section>
  );
}
