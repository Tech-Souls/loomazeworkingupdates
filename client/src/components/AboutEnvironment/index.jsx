import React from "react";
import Slider from "react-slick";
import team1Img from "../../assets/images/team-img-1.webp";
import team2Img from "../../assets/images/team-img-2.webp";
import team3Img from "../../assets/images/team-img-4.webp";
import team4Img from "../../assets/images/team-img-5.webp";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AboutEnvironment() {
  const teamImages = [
    team1Img,
    team2Img,
    team3Img,
    team4Img,
    team1Img,
    team2Img,
    team3Img,
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-16 w-full">
      <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <h2 className="text-3xl font-semibold mb-4">
          Inside loomaze - Inclusive And Diverse
        </h2>
        <p className="text-lg text-[var(--text)]">
          We believe in fostering a healthy work environment where candidates are empowered to freely express their ideas/thoughts, engage with others, feel valued, and be heard. Our team prioritizes building an inclusive culture of recognition - where candidates are appreciated frequently and in real-time. Our workforce brings diverse cultural values to the organization reinforcing a collaborative, creative, and open ecosystem that aligns with people’s beliefs and values.
        </p>
      </div>
<Slider {...settings} className="w-full justify-center align-middle text-center">
  {teamImages.map((img, idx) => (
    <div key={idx} className="px-3 flex justify-center"> 
      <div className="overflow-hidden rounded-xl shadow-lg w-full">
        <img
          src={img}
          alt={`Team ${idx + 1}`}
          className="w-full h-64 md:h-72 lg:h-80 object-cover object-center transform hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  ))}
</Slider>

    </section>
  );
}
