import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import heroWebImg from "../../assets/images/hero-img.webp";
import heroRayImg from "../../assets/images/heroImg-rayban.webp";
import heroShoesImg from "../../assets/images/heroImg-shoes.webp";
import heroCamImg from "../../assets/images/heroImg-camera.webp";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PlatformHeroFashion({ settings, isCustomDomain }) {
    const sliderSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 900,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: false,
        appendDots: (dots) => (
            <div className="flex justify-center text-center align-middle   ">
                <ul
                    className=" 
        
      relative mt-3
      sm:absolute sm:mt-0
      sm:left-1/2 sm:-translate-x-1/2
      sm:bottom-6 md:bottom-8
      flex items-center justify-center
      gap-0.5 sm:gap-1 md:gap-1
      rounded-full shadow-lg
      bg-transparent
      px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2
      sm:mb-4 md:mb-6

          "
                >
                    {dots}
                </ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3
      bg-gray-800 rounded-full transition-all duration-300"></div>
        ),
    };

    const dummy = [
        { image: heroRayImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroWebImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroShoesImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroCamImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
    ];

    const [slides, setSlides] = useState(dummy)

    useEffect(() => {
        if (settings?.content?.heroSlider?.length > 0) {
            setSlides(settings.content.heroSlider);
        } else {
            setSlides(dummy);
        }
    }, [settings]);

    return (
        <section className="relative w-full overflow-hidden">
            <div className=" mx-auto hero-slider relative">
                <Slider {...sliderSettings}>
                    {slides.map((slide, i) => {
                        const heroSliderDataExists = settings?.content?.heroSlider?.length > 0 ? true : false
                        return (
                            <a key={i} href={slide.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`)} target="_blank" className="relative block hero-slider-media cursor-pointer">
                                <img
                                    src={!heroSliderDataExists ? slide.image : `${slide.image}`}
                                    alt={`banner-${i + 1}`}
                                    loading="lazy"
                                    className="mx-auto h-[70vh] lg:h-[80vh] w-full object-cover object-top-left md:object-center aspect-[10/3.33]"
                                />

                                {(slide.title || slide.subtitle) &&
                                    <div className="w-full p-4 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
                                        {slide.title && <h2 className="text-white text-5xl font-bold">{slide.title}</h2>}
                                        {slide.subtitle && <p className="text-white max-w-xs text-sm text-center leading-loose my-8">{slide.subtitle}</p>}
                                        {(slide.title || slide.subtitle) &&
                                            <button className="group relative font-bold mt-4 z-30 overflow-hidden"
                                                // onClick={() => window.open(slide.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`), "_blank", "noopener,noreferrer")}
                                            >
                                                <span className="relative block px-10 sm:px-16 py-2 sm:py-3 bg-white text-[#202020] group-hover:text-white transition-all duration-500 ease-out z-0">
                                                    Shop Now
                                                    <span className="absolute top-0 left-0 w-0 h-full bg-[#202020] transition-all duration-200 ease-linear -z-1 group-hover:w-full group-hover:rounded-none"></span>
                                                </span>
                                            </button>
                                        }
                                    </div>
                                }
                            </a>
                        )
                    })}
                </Slider>
            </div>
            <style>{`
        .slick-dots li.slick-active div {
          background-color: var(--pr);
          transform: scale(1.2);
        }
      `}</style>
        </section>
    );
}