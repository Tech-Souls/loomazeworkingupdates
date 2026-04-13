import React, { useEffect, useState, useRef } from "react";

export default function AboutNumbers() {
  const counters = [
    { number: 100, label: "Countries" },
    { number: 500, label: "Projects" },
    { number: 200, label: "Experts" },
    { number: 10, label: "Years" },
  ];

  const [counts, setCounts] = useState(counters.map(() => 0));
  const [hasCounted, setHasCounted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasCounted) {
            setHasCounted(true);

            const duration = 2000; // total counting duration in ms
            const intervals = counters.map((counter, idx) => {
              const stepTime = Math.max(Math.floor(duration / counter.number), 1); // time per increment
              return setInterval(() => {
                setCounts((prev) => {
                  const newCounts = [...prev];
                  if (newCounts[idx] < counter.number) {
                    newCounts[idx] += 1; 
                  } else {
                    newCounts[idx] = counter.number; 
                  }
                  return newCounts;
                });
              }, stepTime);
            });

        
            setTimeout(() => intervals.forEach(clearInterval), duration + 50);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasCounted]);

  return (
    <section ref={sectionRef} className="bg-[#151f20] py-12">
      <div className="max-w-[1140px] mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-white text-2xl font-extrabold mb-10">
          loomaze In Numbers
        </h2>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {counters.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h3 className="text-[#0291C1] text-6xl font-extrabold mb-2">
                {counts[idx].toLocaleString()}+
              </h3>
              <p className="text-white text-base">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
