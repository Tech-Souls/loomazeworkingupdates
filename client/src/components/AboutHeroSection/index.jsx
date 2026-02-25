import React from "react";
import AboutBannerImg from "../../assets/images/about-banner-shape.webp";
import BannerImg from "../../assets/images/about-banner-bottom.webp";

export default function AboutHeroSection() {
  return (
    <section
      className="hero-banner relative w-full bg-[#151f20] bg-no-repeat bg-cover flex items-center pt-[clamp(5rem,9vw,9rem)]"
      style={{ backgroundImage: `url(${AboutBannerImg})` }}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          About Us
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Helping Ideas Thrive in the Digital Age
        </p>

        <div className="banner__img mt-12 w-full flex justify-center relative z-10">
          <img
            src={BannerImg}
            alt="loomaze About Banner"
            className="w-full max-w-4xl object-cover"
          />
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0 h-[175px] bg-white z-0"></div>
    </section>
  );
}
