import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import heroWebImg from "../../assets/images/hero-img.webp";
import heroRayImg from "../../assets/images/heroImg-rayban.webp";
import heroShoesImg from "../../assets/images/heroImg-shoes.webp";
import heroCamImg from "../../assets/images/heroImg-camera.webp";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PlatformHero({ settings, isCustomDomain }) {

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
            <div className="flex justify-center text-center align-middle">
                <ul className="relative mt-3 sm:absolute sm:mt-0 sm:left-1/2 sm:-translate-x-1/2 sm:bottom-6 md:bottom-8 flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1 rounded-full shadow-lg bg-transparent px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 sm:mb-4 md:mb-6">
                    {dots}
                </ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-gray-800 rounded-full transition-all duration-300"></div>
        ),
    };

    const dummy = [
        { image: heroRayImg,   ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroWebImg,   ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroShoesImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroCamImg,   ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
    ];

    // ✅ Only use DB slides if they have real non-null images
    const getValidDBSlides = (s) => {
        const dbSlides = s?.content?.heroSlider || []
        return dbSlides.filter(slide => slide?.image && slide.image !== "null")
    }

    const resolveSlides = (s) => {
        const valid = getValidDBSlides(s)
        return valid.length > 0
            ? { slides: valid, usingDB: true }
            : { slides: dummy, usingDB: false }
    }

    const initial = resolveSlides(settings)
    const [slides, setSlides] = useState(initial.slides)
    const [usingDB, setUsingDB] = useState(initial.usingDB)

    useEffect(() => {
        const { slides: resolved, usingDB: isDB } = resolveSlides(settings)
        setSlides(resolved)
        setUsingDB(isDB)
    }, [settings])

    // ✅ For DB images prepend VITE_HOST if not already absolute
    const getImageSrc = (slide) => {
        if (!usingDB) return slide.image  // local imported asset
        const img = slide.image || ""
        if (img.startsWith("http://") || img.startsWith("https://")) return img
        const host = (import.meta.env.VITE_HOST || "").replace(/\/$/, "")
        const path = img.startsWith("/") ? img : `/${img}`
        return `${host}${path}`
    }

    if (!slides.length) return null

    return (
        <section className="relative w-full bg-gray-100 overflow-hidden">
            <div className="mx-auto hero-slider relative">
                <Slider {...sliderSettings}>
                    {slides.map((slide, i) => (
                        <a
                            key={i}
                            href={slide.ctaLink || (isCustomDomain ? "/" : `/brand/${settings?.brandSlug}`)}
                            className="relative block hero-slider-media cursor-pointer"
                        >
                            <img
                                src={getImageSrc(slide)}
                                alt={`banner-${i + 1}`}
                                className="mx-auto h-[30vh] sm:h-[50vh] md:h-[70vh] lg:h-[80vh] w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.7,0,0.3,1)] hover:scale-110 aspect-[10/3.33]"
                            />
                            {(slide.title || slide.subtitle) && (
                                <div className="w-full p-4 absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-56 top-1/2 -translate-y-1/2 flex flex-col justify-center items-start">
                                    {slide.title && (
                                        <h2 className="text-white text-2xl md:text-4xl font-bold">{slide.title}</h2>
                                    )}
                                    {slide.subtitle && (
                                        <p className="text-white max-w-xs text-sm my-4">{slide.subtitle}</p>
                                    )}
                                    <button className="relative font-bold mt-4 z-30">
                                        <span className="block px-10 sm:px-16 py-2 sm:py-3 bg-white text-black hover:text-[#202020] transition-all duration-500 ease-out">
                                            Shop Now
                                        </span>
                                        <span className="absolute w-full h-full top-1.5 left-1.5 border border-white -z-2"></span>
                                    </button>
                                </div>
                            )}
                        </a>
                    ))}
                </Slider>
            </div>
            <style>{`
                .slick-dots li.slick-active div {
                    background-color: var(--pr);
                    transform: scale(1.2);
                }
            `}</style>
        </section>
    )
}