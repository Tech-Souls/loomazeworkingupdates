import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronRight , ChevronLeft } from "lucide-react";

function BrandReviewPremium({ storeSettings }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (storeSettings) fetchRecentReviews();
  }, [storeSettings]);


  

 const dummy = [
  {
    productImageURL: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg",
    productTitle: "Wireless Bluetooth Headphones",
    rating: 4.6, // Backend field name: rating
    comment: "The audio quality is amazing and the battery lasts all day.", // Backend field name: comment
    productSlug: "wireless-bluetooth-headphones",
    brandSlug: "sony",
    productID: "prod_001",
    // userID yahan object ki tarah aayega jab backend populate karega
    userID: { name: "Ali Raza", passion: "Electronics Store Owner" } 
  },
  {
    productImageURL: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
    productTitle: "Smart Fitness Watch",
    rating: 4.5,
    comment: "Tracks steps, heart rate, and sleep very accurately.",
    productSlug: "smart-fitness-watch",
    brandSlug: "apple",
    productID: "prod_002",
    userID: { name: "Sara Khan", passion: "Fitness Trainer" }
  },
  {
    productImageURL: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg",
    productTitle: "RGB Gaming Mouse",
    rating: 4.7,
    comment: "Very responsive with beautiful RGB lighting effects.",
    productSlug: "rgb-gaming-mouse",
    brandSlug: "logitech",
    productID: "prod_003",
    userID: { name: "Usman Tariq", passion: "Gaming Streamer" }
  },
  {
    productImageURL: "https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg",
    productTitle: "Portable Bluetooth Speaker",
    rating: 4.4,
    comment: "Small size but very loud and clear audio.",
    productSlug: "portable-speaker",
    brandSlug: "jbl",
    productID: "prod_004",
    userID: { name: "Hina Malik", passion: "Travel Blogger" }
  },
  {
    productImageURL: "https://cdn.pixabay.com/photo/2016/11/29/09/32/power-bank-1869237_1280.jpg",
    productTitle: "20000mAh Fast Charging Power Bank",
    rating: 4.3,
    comment: "Charges my phone multiple times and supports fast charging.",
    productSlug: "fast-power-bank",
    brandSlug: "anker",
    productID: "prod_005",
    userID: { name: "Bilal Ahmed", passion: "Mobile Accessories Seller" }
  }
];

  const fetchRecentReviews = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-recent-reviews?brandSlug=${storeSettings?.brandSlug}`,
      )
      .then((res) => {
        if (res.status === 200 && res.data?.reviews?.length > 0)
          setProducts(res.data?.reviews);
      })
      .catch((err) => console.error("Frontend GET error", err.message))
      .finally(() => setLoading(false));
  };

  const handleScroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === "right" ? 320 : -320;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const reviews = products.length > 0 ? products : dummy;

 return (
  <div className="w-full overflow-hidden bg-gray-300 scrollbar-hide mb-20 py-10 ">
    <div className="w-full flex flex-col gap-5 mb-5 items-center justify-center">
      <p className="text-blue-500">Reviews</p>
      <p className="text-3xl capitalize font-semibold">Customer Feedback</p>
      <p>What do people think about us?</p>
    </div>
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => handleScroll("left")}
        className="absolute left-0 top-1/2 flex items-center justify-center z-10 -translate-y-1/2 rounded-full bg-white/90 w-10 h-10 shadow-lg hover:bg-black hover:text-white transition-colors duration-150 text-lg"
      >
        <ChevronLeft />
      </button>

      <div
        ref={sliderRef}
        className="gap-5 overflow-x-auto px-5 h-full w-full flex scroll-smooth scrollbar-hide snap-x snap-mandatory"
      >
        {reviews.map((item, i) => {
          return (
            <div key={i} className="w-72 max-h-115 bg-white cursor-pointer flex flex-col gap-2 shrink-0 rounded-2xl p-5 snap-center">
              <div className="w-full h-30 flex items-center gap-2 ">
                <img
                  className="w-[40%] rounded-lg hover:scale-105 transition-all duration-150 h-full object-cover"
                  src={item.productImageURL} // ✅ Matched
                  alt={item.productTitle}
                />
                <div className="w-[50%] flex flex-col items-start justify-center h-full ">
                  <p className="text-sm font-light">{item.productTitle}</p>
                  {/* Agar price backend se nahi aa rahi to temporary 0 ya hide kar dein */}
                  <p className="font-semibold">${item.productPrice || "0.00"}</p>
                </div>
              </div>

              {/* Stars Logic */}
              <div className="w-full h-10 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <span
                      key={index}
                      className={`text-xl ${
                        item.rating >= ratingValue // ✅ Changed from 'ratings' to 'rating'
                          ? "text-yellow-500 scale-110"
                          : "text-gray-300"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26ZM15.1358 10.1279L13.3242 4.56764C13.2224 4.25523 12.7776 4.25523 12.6758 4.56764L10.8642 10.1279C10.8187 10.2676 10.6877 10.3623 10.54 10.3623H4.67474C4.34494 10.3623 4.2075 10.7813 4.47397 10.9744L9.22119 14.414C9.34018 14.5002 9.38997 14.6526 9.34461 14.7918L7.53184 20.3556C7.43014 20.6678 7.79 20.9268 8.05681 20.7335L12.7992 17.2974C12.9189 17.2107 13.0811 17.2107 13.2008 17.2974L17.9432 20.7335C18.21 20.9268 18.5699 20.6678 18.4682 20.3556L16.6554 14.7918C16.61 14.6526 16.6598 14.5002 16.7788 14.414L21.526 10.9744C21.7925 10.7813 21.6551 10.3623 21.3252 10.3623H15.46C15.3123 10.3623 15.1813 10.2676 15.1358 10.1279Z" fill="#FFAB00"></path>
</svg>
                    </span>
                  );
                })}
              </div>

              {/* Main Content */}
              <div className="w-full h-50 ">
                {/* Agar reviewTitle nahi hai to comment ka slice dikhayein */}
                <h3 className="font-bold">{item.reviewTitle || "Verified Review"}</h3>
                <p className="text-gray-600 line-clamp-3">{item.comment}</  p> {/* ✅ Changed from 'reviewDescription' to 'comment' */}
              </div>

              {/* User Info */}
              <div className="w-full h-20 border-t pt-2">
                {/* userID object ke andar se name nikalein */}
                <h2 className="font-semibold">{item.userID?.name || "Customer"}</h2> 
                <p className="text-xs text-gray-400">{item.userID?.passion || "Verified Buyer"}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => handleScroll("right")}
        className="absolute flex items-center justify-center right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 w-10 h-10 shadow-lg hover:bg-black hover:text-white transition-colors duration-150 text-lg"
      >
        <ChevronRight />
      </button>
    </div>
  </div>
);
}

export default BrandReviewPremium;


