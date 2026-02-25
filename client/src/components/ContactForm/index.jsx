import React from "react";

export default function ContactForm() {
  return (
    <section className="relative section-bg py-16">
      <div className="absolute top-0 left-0 w-full h-[45vh] bg-[#E95026] -z-10"></div>
      <div className="relative max-w-[700px] mx-auto mb-12 px-4">
        <div className="text-center text-white mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[calc(95% + 1.3vw)]">
            Champion the eCommerce Marketplace Arena with loomaze
          </h2>
          <p className="mt-2 text-sm sm:text-md">
            Please fill the below form. Our experts will guide your next steps to launch an online multi-vendor marketplace.
          </p>
        </div>
        <div className="bg-white mx-w-[700px] shadow-[0.15vw_0.3vw_2.5vw_0_rgba(0,0,0,0.15)] rounded-lg p-[calc(1rem+1.5vw)]">
          <form className="space-y-5 sm:space-y-6 form--contact">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[#1b1b1b] text-base font-medium mb-1">
                Name <span className="text-[var(--text)]">(required)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Smith"
                className="w-full h-[42px] sm:h-[40px] bg-white border-b  rounded-none appearance-none p-0 text-black text-sm font-normal leading-[100%] transition-all duration-200 ease-in-out outline-none focus:border-b-2 focus:border-black hover:border-b-2 hover:border-black"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[#1b1b1b] text-base font-medium mb-1">
                Email <span className="text-[var(--text)]">(required)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="james.smith@company.com"
                className="w-full h-[42px] sm:h-[40px] bg-white border-b  rounded-none appearance-none p-0 text-black text-sm font-normal leading-[100%] transition-all duration-200 ease-in-out outline-none focus:border-b-2 focus:border-black hover:border-b-2 hover:border-black"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-[#1b1b1b] text-base font-medium mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+1 555 444 3333"
                className="w-full h-[42px] sm:h-[40px] bg-white border-b  rounded-none appearance-none p-0 text-black text-sm font-normal leading-[100%] transition-all duration-200 ease-in-out outline-none focus:border-b-2 focus:border-black hover:border-b-2 hover:border-black"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-[#1b1b1b] text-base font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder=""
                className="w-full h-[42px] sm:h-[40px] bg-white border-b  rounded-none appearance-none p-0 text-black text-sm font-normal leading-[100%] transition-all duration-200 ease-in-out outline-none focus:border-b-2 focus:border-black hover:border-b-2 hover:border-black"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-[#1b1b1b] text-base font-medium mb-1">
                Message <span className="text-[var(--text)]">(required)</span>
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Please describe your ecommerce marketplace project requirements"
                rows="4"
                className="w-full h-[42px] sm:h-[80px] bg-white border-b  rounded-none appearance-none p-0 text-black text-sm font-normal leading-[100%] transition-all duration-200 ease-in-out outline-none focus:border-b-2 focus:border-black hover:border-b-2 hover:border-black"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#E95026] text-white py-3 rounded font-semibold hover:bg-[#d03451] transition duration-300 text-sm sm:text-base"
            >
              Submit Details
            </button>

            <p className="text-center text-[var(--text)] mt-2 text-xs font-medium sm:text-sm">
              Get started with your BIG eCommerce idea
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
