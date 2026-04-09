import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronRight, ChevronLeft } from "lucide-react";

function BrandReviewPremium({ storeSettings }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  const sliderRef = useRef(null);

  useEffect(() => {
    if (storeSettings) fetchRecentReviews();
  }, [storeSettings]);

  // ✅ Dummy Data
  const dummy = [
    {
      productImageURL:
        "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg",
      productTitle: "Wireless Headphones",
      rating: 5,
      comment: "Amazing audio quality and battery.",
      userID: { name: "Ali Raza", passion: "Tech Enthusiast" },
    },
    {
      productImageURL:
        "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
      productTitle: "Smart Watch",
      rating: 4,
      comment: "Very accurate tracking and sleek design.",
      userID: { name: "Sara Khan", passion: "Fitness Trainer" },
    },
    {
      productImageURL:
        "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg",
      productTitle: "Gaming Mouse",
      rating: 5,
      comment: "Super fast response time for gaming.",
      userID: { name: "Usman Tariq", passion: "Pro Streamer" },
    },
    {
      productImageURL:
        "https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg",
      productTitle: "BT Speaker",
      rating: 4,
      comment: "Loud sound in a very portable size.",
      userID: { name: "Hina Malik", passion: "Traveler" },
    },
    {
      productImageURL:
        "https://cdn.pixabay.com/photo/2016/11/29/09/32/power-bank-1869237_1280.jpg",
      productTitle: "Power Bank",
      rating: 5,
      comment: "Reliable and fast charging.",
      userID: { name: "Bilal Ahmed", passion: "Seller" },
    },
  ];

  const fetchRecentReviews = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-recent-reviews?brandSlug=${storeSettings?.brandSlug}`
      )
      .then((res) => {
        if (res.data?.reviews?.length > 0) {
          setProducts(res.data.reviews);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const reviews = products.length > 0 ? products : dummy;

  // ✅ Detect cards per view (responsive)
  useEffect(() => {
    const calculateCards = () => {
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.offsetWidth;
        const cardWidth = 308;
        const count = Math.floor(containerWidth / cardWidth);
        setCardsPerView(count || 1);
      }
    };

    calculateCards();
    window.addEventListener("resize", calculateCards);

    return () => window.removeEventListener("resize", calculateCards);
  }, []);

  // ✅ Total dots (slides)
  const totalDots = Math.max(reviews.length - cardsPerView + 1, 1);

  // ✅ Scroll
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const cardWidth = 308;
      const scrollAmount = direction === "right" ? cardWidth : -cardWidth;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // ✅ Active dot sync
  const handleOnScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const cardWidth = 308;
      let index = Math.round(scrollLeft / cardWidth);

      if (index > totalDots - 1) index = totalDots - 1;
      setActiveIndex(index);
    }
  };

  const maxIndex = totalDots - 1;

  return (
    <div className="w-full overflow-hidden font-[Inter] bg-gray-300 mb-20 py-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <p className="text-blue-500 font-semibold">Reviews</p>
        <h2 className="text-4xl font-semibold">Customer Feedback</h2>
        <p>What do people think about us?</p>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        onScroll={handleOnScroll}
        className="flex gap-5 overflow-x-auto px-5 scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {reviews.map((item, i) => (
          <div
            key={i}
            className="w-72 bg-white shrink-0 rounded-3xl p-5 snap-center shadow-md flex flex-col"
          >
            <div className="flex gap-2 h-28">
              <img
                src={item.productImageURL}
                className="w-[40%] rounded-xl object-cover"
              />
              <div>
                <p className="text-xs">{item.productTitle}</p>
                <p className="font-semibold">
                  ${item.productPrice || "0.00"}
                </p>
              </div>
            </div>

            <div className="flex gap-1 my-2">
              {[...Array(5)].map((_, index) => (
                <span key={index}>
                  {index < item.rating ? "★" : "☆"}
                </span>
              ))}
            </div>

            <div className="h-40">
              <h3 className="font-bold">
                {item.reviewTitle || "Verified Review"}
              </h3>
              <p className="text-sm text-gray-600">
                {item.comment}
              </p>
            </div>

            <div className="border-t pt-3 mt-auto">
              <p className="font-semibold">{item.userID?.name}</p>
              <p className="text-xs text-gray-400">
                {item.userID?.passion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center mt-10">
        <div className="flex items-center gap-6">

          {/* Left */}
          <button
            disabled={activeIndex === 0}
            onClick={() => handleScroll("left")}
            className="p-3 bg-white rounded-xl shadow disabled:opacity-40"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {[...Array(totalDots)].map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all ${
                  activeIndex === idx
                    ? "w-8 h-2 bg-black"
                    : "w-2 h-2 bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Right */}
          <button
            disabled={activeIndex === maxIndex}
            onClick={() => handleScroll("right")}
            className="p-3 bg-white rounded-xl shadow disabled:opacity-40"
          >
            <ChevronRight size={20} />
          </button>

        </div>
      </div>
    </div>
  );
}

export default BrandReviewPremium;