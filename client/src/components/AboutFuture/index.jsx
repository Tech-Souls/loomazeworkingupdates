import React from "react";
import lifetimeImg from "../../assets/images/lifetime.svg";
import feesImg from "../../assets/images/fees.svg";
import payImg from "../../assets/images/pay.svg";
import installmentImg from "../../assets/images/installment.svg";

export default function AboutFuture() {
  const features = [
    { img: lifetimeImg, title: "Lifetime Ownership", size: { h: 75, w: 75 } },
    { img: feesImg, title: "No Recurring Fees", size: { h: 72, w: 75 } },
    { img: payImg, title: "Flexible Payments", size: { h: 74, w: 78 } },
    { img: installmentImg, title: "Free Installation", size: { h: 64, w: 74 } },
  ];

  return (
    <section className="bg-transparent py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)]">
            Our Commitment Towards A Better Tomorrow
          </h2>
          <p className="text-lg text-[var(--text)] mt-4">
            We are aligned with the purpose to craft a better tomorrow for our
            employees, partners, and clients through digital transformation on a
            global scale. Our innovative solutions are directed towards ensuring
            sustainable business growth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-3"
            >
              <img
                src={feature.img}
                alt={feature.title}
                height={feature.size.h}
                width={feature.size.w}
                loading="lazy"
                className="mx-auto"
              />
              <div className="text-lg font-semibold text-[var(--text)]">
                {feature.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

