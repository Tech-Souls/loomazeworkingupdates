import React, { useEffect, useState } from "react";
import axios from "axios";

function BrandReviewPremium({ storeSettings }) {
  console.log("sabi kuch a raha ha ", storeSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storeSettings) fetchRecentReviews();
  }, [storeSettings]);

  const products = [
    {
      productImg:
        "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg",
      productTitle: "Wireless Bluetooth Headphones",
      productPrice: 79.99,
      ratings: 4.6,
      reviewTitle: "Excellent Sound",
      reviewDescription:
        "The audio quality is amazing and the battery lasts all day.",
      userName: "Ali Raza",
      userPassion: "Electronics Store Owner",
    },
    {
      productImg:
        "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
      productTitle: "Smart Fitness Watch",
      productPrice: 129.99,
      ratings: 4.5,
      reviewTitle: "Great for Health Tracking",
      reviewDescription: "Tracks steps, heart rate, and sleep very accurately.",
      userName: "Sara Khan",
      userPassion: "Fitness Trainer",
    },
    {
      productImg:
        "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg",
      productTitle: "RGB Gaming Mouse",
      productPrice: 39.99,
      ratings: 4.7,
      reviewTitle: "Perfect for Gaming",
      reviewDescription: "Very responsive with beautiful RGB lighting effects.",
      userName: "Usman Tariq",
      userPassion: "Gaming Streamer",
    },
    {
      productImg:
        "https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg",
      productTitle: "Portable Bluetooth Speaker",
      productPrice: 59.99,
      ratings: 4.4,
      reviewTitle: "Powerful Sound",
      reviewDescription: "Small size but very loud and clear audio.",
      userName: "Hina Malik",
      userPassion: "Travel Blogger",
    },
    {
      productImg:
        "https://cdn.pixabay.com/photo/2016/11/29/09/32/power-bank-1869237_1280.jpg",
      productTitle: "20000mAh Fast Charging Power Bank",
      productPrice: 49.99,
      ratings: 4.3,
      reviewTitle: "Very Useful",
      reviewDescription:
        "Charges my phone multiple times and supports fast charging.",
      userName: "Bilal Ahmed",
      userPassion: "Mobile Accessories Seller",
    },
  ];

  const fetchRecentReviews = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-recent-reviews?brandSlug=${storeSettings?.brandSlug}`,
      )
      .then((res) => {
        if (res.status === 200 && res.data?.reviews?.length > 0)
          setReviews(res.data?.reviews);
      })
      .catch((err) => console.error("Frontend GET error", err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full p-5 overflow-x-auto bg-gray-300 scrollbar-hide  ">
      <div className="w-full flex flex-col gap-5  mb-5 items-center justify-center">
        <p className="text-blue-500">Reviews</p>
        <p className="text-3xl capitalize font-semibold">coustomer Feedback</p>
        <p>what do people think about us? </p>
      </div>
      <div className="flex gap-5 h-full w-max">
        {products.map((item, i) => {
          return (
            <div className="w-72 max-h-115 bg-white   flex flex-col gap-2 shrink-0 rounded-2xl p-5 ">
              <div className="w-full h-30 flex items-center gap-2 ">
                <img
                  className="w-[40%] rounded-lg h-full object-cover"
                  src={item.productImg}
                  alt=""
                />
                <div className="w-[50%] flex flex-col items-start justify-center h-full ">
                  <p className="text-sm font-light">{item.productTitle}</p>

                  <p>{item.productPrice}</p>
                </div>
              </div>
              {/* reviews */}
              <div className="w-full h-10 flex justify-center items-center ">
                {item.ratings}
              </div>
              {/* main content */}
              <div className="w-full h-50 ">
                <h3>{item.reviewTitle}</h3>
                <p>{item.reviewDescription}</p>
              </div>

              {/* review writer information */}
              <div className="w-full h-20 ">
                <h2>{item.userName}</h2>
                <p>{item.userPassion}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BrandReviewPremium;
