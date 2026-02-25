import React, { useEffect, useState } from "react";
import heroWebImg from "../../assets/images/hero-img.webp";

export default function PlatformHeroJewellery({ settings, isCustomDomain }) {
    const dummy = [
        { image: heroWebImg, ctaLink: isCustomDomain ? `/` : `/brand/${settings?.brandSlug}` },
    ];

    const [slide, setSlide] = useState(dummy[0]);

    useEffect(() => {
        if (settings?.content?.heroSlider?.length > 0) {
            const hero = settings.content.heroSlider[0];
            setSlide({
                ...hero,
                image: `${hero.image}`,
            });
        } else {
            setSlide({
                ...dummy[0],
                image: heroWebImg,
            });
        }
    }, [settings]);

    return (
        <section
            className="relative w-full h-[30vh] sm:h-[50vh] md:h-[70vh] lg:h-[80vh] flex items-center overflow-hidden"
            style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <a href={slide.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`)} target="_blank" className="absolute inset-0 z-10"></a>

            <div className="w-full md:max-w-3xl text-center relative z-20 text-[#202020]">
                {slide.title && <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>}
                {slide.subtitle && <p className="w-full max-w-xs mx-auto text-sm my-4">{slide.subtitle}</p>}
                {(slide.title || slide.subtitle) &&
                    <button className="relative font-bold mt-4 z-30"
                        // onClick={() => window.open(slide.ctaLink || (isCustomDomain ? "/" : `/brand/${settings.brandSlug}`), "_blank", "noopener,noreferrer")}
                    >
                        <span className="block px-10 sm:px-16 py-2 sm:py-3 bg-[#202020] hover:bg-white text-white hover:text-[#202020] border border-[#202020] transition-all duration-500 ease-out">Shop Now</span>
                        <span className="absolute w-full h-full top-1.5 left-1.5 border border-[#202020] -z-2"></span>
                    </button>
                }
            </div>
        </section>
    );
}