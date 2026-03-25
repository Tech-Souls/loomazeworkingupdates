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
    <button onClick={onClick} className="absolute top-1/2 right-3 z-10 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition-all duration-300">
        <ChevronRight size={28} />
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition-all duration-300">
        <ChevronLeft size={28} />
    </button>
);

export default function PlatformHeroThree({ settings, isCustomDomain }) {
    const sliderSettings = {
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
        { image: heroRayImg,   ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroWebImg,   ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroShoesImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
        { image: heroCamImg,   ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
    ];

    // ✅ Only treat DB slides as valid if they actually have a real image value
    const getValidDBSlides = (s) => {
        const dbSlides = s?.content?.heroSlider || []
        return dbSlides.filter(slide => slide?.image && slide.image !== "null")
    }

    const resolveSlides = (s) => {
        const valid = getValidDBSlides(s)
        return valid.length > 0 ? { slides: valid, usingDB: true } : { slides: dummy, usingDB: false }
    }

    const initial = resolveSlides(settings)
    const [slides, setSlides] = useState(initial.slides)
    const [usingDB, setUsingDB] = useState(initial.usingDB)

    useEffect(() => {
        const { slides: resolved, usingDB: isDB } = resolveSlides(settings)
        setSlides(resolved)
        setUsingDB(isDB)
    }, [settings])

    // For DB images prepend VITE_HOST if not already absolute
    const getImageSrc = (slide) => {
        if (!usingDB) return slide.image
        const img = slide.image || ""
        if (img.startsWith("http://") || img.startsWith("https://")) return img
        const host = (import.meta.env.VITE_HOST || "").replace(/\/$/, "")
        const path = img.startsWith("/") ? img : `/${img}`
        return `${host}${path}`
    }

    if (!slides.length) return null
console.log('🎠 HeroThree slides:', slides, 'usingDB:', usingDB, 'first img:', slides[0]?.image)
    return (
        <section className="relative w-full overflow-hidden hero-two-slider">
            <Slider {...sliderSettings}>
                {slides.map((slide, i) => (
                    <a
                        key={i}
                        href={slide.ctaLink || (isCustomDomain ? "/" : `/brand/${settings?.brandSlug}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <img
                            src={getImageSrc(slide)}
                            alt={`banner-${i + 1}`}
                            className="mx-auto h-[30vh] sm:h-[50vh] md:h-[70vh] lg:h-[80vh] w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.7,0,0.3,1)] hover:scale-110"
                        />
                        {(slide.title || slide.subtitle) && (
                            <div className="absolute w-full p-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-56 top-1/2 -translate-y-1/2 flex flex-col justify-center items-start">
                                {slide.title && <h2 className="text-[#202020] text-2xl md:text-4xl font-bold">{slide.title}</h2>}
                                {slide.subtitle && <p className="text-[#202020] w-full max-w-xs text-sm my-4">{slide.subtitle}</p>}
                                <button className="relative px-10 sm:px-16 py-2.5 sm:py-3 text-sm sm:text-base bg-[#202020] text-white rounded-full font-bold mt-4 z-30 transition-all duration-500 ease-out">
                                    Shop Now
                                </button>
                            </div>
                        )}
                    </a>
                ))}
            </Slider>
        </section>
    )
}