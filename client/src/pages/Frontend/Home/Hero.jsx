import React, { useState, useEffect, useRef } from "react";
import heroImg from "@/assets/images/image.png";

function Counter({ target, label }) {
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const end = parseFloat(target);
    const duration = 2000;
    const stepTime = 20;
    const step = Math.max(0.1, end / (duration / stepTime));

    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(Number.isInteger(end) ? Math.floor(current) : current.toFixed(1));
    }, stepTime);

    return () => clearInterval(timer);
  }, [start, target]);

  return (
    <div ref={ref} className="text-center transition-all duration-700 hover:scale-110">
      <span className="block text-4xl md:text-5xl font-bold text-[#E95026]">
        {count}+
      </span>
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
  );
}

export default function HeroSection() {
  const words = ["Most User-Friendly", "Turnkey", "Agile", "Scalable"];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1000);
      return;
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  useEffect(() => {
    setText(words[index].substring(0, subIndex));
  }, [subIndex, index]);

  return (
    <div className="w-full">

      {/* HERO */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-24 grid md:grid-cols-2 gap-10 items-center">
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              <span className="text-[#E95026]">{text}</span>
              <span className="text-[#E95026] animate-pulse">|</span>
              <div className="mt-2">eCommerce Marketplace Platform</div>
            </h1>

            <p className="mt-6 text-gray-600 max-w-xl">
              Designed for Startups and Enterprises, <span className="text-primary">loomaze</span> empowers you with faster GoToMarket times and optimized eCommerce operations.
            </p>

            <div className="mt-8">
              <p className="font-semibold mb-4">
                Unrivaled CX | Streamlined UI/UX | Fast deployment
              </p>
              <a
                href="/auth/seller/signup"
                className="inline-flex items-center justify-center bg-[#E95026] text-white px-8 py-3 rounded font-semibold transition hover:scale-105 hover:opacity-90"
              >
                Get Started
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <img src={heroImg} alt="Hero" className="w-full object-contain" />
          </div>

        </div>
      </section>

      {/* RATINGS */}
      {/* <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h5 className="font-semibold mb-8">
            Top Rated Choice on Trusted Review Websites
          </h5>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["SoftwareSuggest", "4.9"],
              ["Goodfirms", "4.8"],
              ["Capterra", "4.3"],
              ["G2", "4.6"],
            ].map(([name, rating]) => (
              <div key={name} className="bg-white p-4 rounded shadow">
                <p className="font-semibold">{name}</p>
                <p className="text-xl font-bold">{rating}</p>
                <p className="text-yellow-500">★★★★★</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}
