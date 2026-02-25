import React from "react";
import diamondStudyImg from "../../assets/images/diamond-case-study.webp";
import liquorStudyImg from "../../assets/images/liquor-case-study.webp";
import voyijStudyImg from "../../assets/images/voyij-case-study.webp";

export default function AboutBrands() {
  const caseStudies = [
    {
      img: diamondStudyImg,
      title: "World's First B2B Diamond Trading Marketplace",
      desc: "From understanding the variables critical for a diamond trading business to engineering a customized platform tailored to the industry, we delivered UNI Diamonds marketplace. It lets buyers/sellers search, compare, value, bid, and buy/sell diamonds.",
      link: "/case-study/uni-diamonds-b2b-diamond-trading-marketplace.html",
    },
    {
      img: voyijStudyImg,
      title: "Tour & activities marketplace offering unique experiences in Alaska",
      desc: "We developed Voyij - a unique encapsulating online marketplace for Greg & Olivia to sell tours, activities, and souvenirs in Alaska. Voyij connects travelers to local/trusted owners offering lifetime experiences.",
      link: "/case-study/voyij-online-tours-activity-retail-booking-marketplace-alaska.html",
    },
    {
      img: liquorStudyImg,
      title: "Crafting a liquor marketplace for a Fortune 500 Firm",
      desc: "A global brewery leader with a presence in over 100 countries collaborated with our team to start an online liquor marketplace that elevates their consumers’ digital experience.",
      link: "/case-study/b2b-liquor-selling-eCommerce-marketplace-africa.html",
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Left column */}
          <div className="xl:col-span-4">
            <div className="xl:sticky xl:top-24">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Bigger Brands Trust loomaze
              </h2>
              <p className="text-base md:text-lg leading-relaxed mb-6 text-[var(--text)]">
                Top business leaders and brands around the world choose loomaze
                to transform their marketplace idea into reality. We provide
                live software demonstration, complete marketplace setup,
                intelligent digital growth consultation, and complete technical
                support to promote your brand. We are transforming businesses –
                one client, at a time.
              </p>
              <div className="hidden xl:block">
                <h6 className="font-semibold mb-3 text-lg">
                  Learn more details about loomaze platform to build your
                  eCommerce marketplace
                </h6>
                <a
                  href="#"
                  className="inline-block bg-[#E95026] text-white px-5 py-2 rounded-md font-medium shadow-md transition-all duration-300 hover:opacity-90 hover:scale-105"
                >
                  Request a Free Demo
                </a>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="xl:col-span-8 bg-[#f3f3f3] p-5 md:p-8 rounded-lg">
            {caseStudies.map((study, i) => (
              <div
                key={i}
                className={`pb-8 md:pb-10 ${
                  i !== caseStudies.length - 1 ? "mb-8 md:mb-10 border-b border-gray-300" : ""
                }`}
              >
                <img
                  src={study.img}
                  alt={study.title}
                  className="w-full h-auto  shadow-sm mb-4"
                />
                <h5 className="text-lg md:text-xl font-semibold mb-3 mt-3 text-[var(--text)]">
                  {study.title}
                </h5>
                <p className="mb-3 text-[var(--text)] text-sm md:text-base leading-relaxed">
                  {study.desc}
                </p>
                <a
                  href={study.link}
                  className="text-[var(--primary)] font-medium hover:underline"
                >
                  View Case Study
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA button on small screens */}
        <div className="mt-8 text-center xl:hidden">
          <a
            href="#"
            className="inline-block bg-[#E95026] text-white px-6 py-2 rounded-md font-medium shadow-md transition-all duration-300 hover:opacity-90 hover:scale-105"
          >
            Request a Free Demo
          </a>
        </div>
      </div>
    </section>
  );
}
