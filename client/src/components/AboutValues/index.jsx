import React from "react";
import missionImg from "../../assets/images/about-mission.webp";
import visionImg from '../../assets/images/about-vision.webp';

export default function AboutValues() {
  return (
    <section className="bg-[#f3f3f3] py-[clamp(1rem,4vw,4rem)]">
      {/* Section Header */}
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="flex flex-wrap xl:justify-between items-end gap-8 pb-[clamp(2rem,3.5vw,3.5rem)]">
          <div className="w-full xl:w-5/12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Shared Values
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700">
              We are committed to driving a societal change through our 3 shared
              values:
            </p>
          </div>

          <div className="w-full xl:w-6/12">
            <ul className="space-y-3 text-lg font-light text-gray-700">
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-[#b63b5d] before:text-xl">
                Fostering new & innovative ideas
              </li>
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-[#b63b5d] before:text-xl">
                Building solutions that deliver long-term efficacy to clients
              </li>
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-[#b63b5d] before:text-xl">
                Empowering leaders to run a sustainable business
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* About Card */}
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="flex flex-col xl:grid xl:grid-cols-12 relative pb-20">
          <div className="w-full xl:col-span-6 xl:order-2">
            <img
              src={missionImg}
              alt="Mission"
              loading="lazy"
              className="w-full h-auto max-w-[920px] mx-auto xl:absolute xl:bottom-0 xl:right-0 xl:w-[70%] clip-diagonal"
              height={540}
              width={920}
            />
          </div>

          {/* Mission Content */}
          <div className="w-full xl:col-span-6 xl:order-1 relative z-10 bg-gradient-to-br from-[#b63b5d] to-[#ce4a39] text-white p-[clamp(2rem,6vw,6rem)] shadow-xl mt-6 xl:mt-0">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Our Mission
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              To build innovative digital commerce solutions that reduce
              businesses’ time-to-market and empower them to achieve their
              market goals radically. We aim to deliver a custom-engineered
              platform that transcends client expectations and offers a
              competitive business advantage.
            </p>
          </div>
        </div>
      </div>
       <div className="max-w-[1140px] mx-auto px-4 m-7">
        <div className="flex flex-col xl:grid xl:grid-cols-12 relative pb-20">
          <div className="w-full xl:col-span-6 xl:order-2">
            <img
              src={visionImg}
              alt="Mission"
              loading="lazy"
              className="w-full h-auto max-w-[920px] mx-auto xl:absolute xl:bottom-0 xl:right-0 xl:w-[70%] clip-diagonal"
              height={540}
              width={920}
            />
          </div>

          {/* Mission Content */}
          <div className=" w-full xl:col-span-6 xl:order-1 relative z-10
              text-white shadow-xl mt-6 xl:mt-0
              p-[clamp(2rem,6vw,6rem)]
              bg-gradient-to-br from-[#4568dc] xl:to-[#b06ab3]">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Our Vision
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              To build innovative digital commerce solutions that reduce
              businesses’ time-to-market and empower them to achieve their
              market goals radically. We aim to deliver a custom-engineered
              platform that transcends client expectations and offers a
              competitive business advantage.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white text-black py-[clamp(1.4rem,2.75vw+1.4rem,5rem)] mt-4">
  <div className="max-w-[1800px] mx-auto px-[clamp(1rem,2.9rem+2.8vw,6rem)]">
    <div className="text-center xl:flex xl:items-center xl:justify-center xl:max-w-[65%] xl:text-left mx-auto gap-6">
      <h5 className="text-lg font-semibold">
        Let's work together on your dream eCommerce Marketplace Project
      </h5>
      <a
        href=" "
        className="inline-block bg-[#E95026] text-white px-6 py-3 rounded-md font-medium shadow-md transition-all duration-300 hover:opacity-90 hover:scale-105 "
      >
        Connect With Us
      </a>
    </div>
  </div>
</div>
    </section>
  )
}