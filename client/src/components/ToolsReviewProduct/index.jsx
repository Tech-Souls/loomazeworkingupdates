import React, { useRef , useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from 'axios'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./carousel.css";
import { FaLess } from "react-icons/fa";

function ToolsReviewProduct({storeSettings}) {
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const dummy = [
    {
      id: 1,
      title: "EXCEPTIONAL SUPPORT AND CLEAN CODE",
      description:
        "I was surprised by how fast the support team responded to my question. Even as someone with basic knowledge, i found the process straightforward and efficient.",
      user: "Luc M.",
      rating: 5,
    },
    {
      id: 2,
      title: "AMAZING CUSTOMIZATION OPTIONS",
      description:
        "The flexibility of this theme is incredible. I was able to set up my entire store in under an hour without touching a single line of code. Highly recommended!",
      user: "Sarah J.",
      rating: 5,
    },
    {
      id: 3,
      title: "FAST LOADING AND SEO FRIENDLY",
      description:
        "Our site speed improved significantly after switching to this platform. The clean architecture makes a huge difference for our Google rankings.",
      user: "David R.",
      rating: 5,
    },
    {
      id: 4,
      title: "BEST VALUE FOR MONEY",
      description:
        "I've tried many themes before, but this one stands out. The premium features included for this price point are unbeatable. Great job by the dev team!",
      user: "Elena P.",
      rating: 5,
    },
    {
      id: 5,
      title: "USER-FRIENDLY DASHBOARD",
      description:
        "Managing products and orders has never been easier. The interface is intuitive and the mobile responsiveness is top-notch. My customers love it.",
      user: "Marcus K.",
      rating: 5,
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
          setProducts(res.data?.reviews);
      })
      .catch((err) => console.error("Frontend GET error", err.message))
      .finally(() => setLoading(false));
  };
    useEffect(() => {
      if (storeSettings) fetchRecentReviews();
      if(products.length ==0 ){
        setProducts(dummy)
      }
    }, [storeSettings]);

  return (
    <section className="w-full lg:h-80 font-[roboto-condensed] p-5 my-15 relative">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        className="w-full h-full"
      >
        { products.map((item, idx) => (
          <SwiperSlide key={idx} className="flex items-center justify-center">
            <div className="w-full h-full flex bg-gray-300 items-center justify-center py-5 rounded-lg">
              <div className="w-full h-full flex items-center gap-4 lg:justify-between flex-col">
                <div className="flex gap-1">
                  {/* Jitni rating hai, utni baar loop chalega */}
                  {[...Array(item.rating)].map((_, index) => (
                    <svg
                      key={index}
                      className="wokiee-review-star"
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26ZM15.1358 10.1279L13.3242 4.56764C13.2224 4.25523 12.7776 4.25523 12.6758 4.56764L10.8642 10.1279C10.8187 10.2676 10.6877 10.3623 10.54 10.3623H4.67474C4.34494 10.3623 4.2075 10.7813 4.47397 10.9744L9.22119 14.414C9.34018 14.5002 9.38997 14.6526 9.34461 14.7918L7.53184 20.3556C7.43014 20.6678 7.79 20.9268 8.05681 20.7335L12.7992 17.2974C12.9189 17.2107 13.0811 17.2107 13.2008 17.2974L17.9432 20.7335C18.21 20.9268 18.5699 20.6678 18.4682 20.3556L16.6554 14.7918C16.61 14.6526 16.6598 14.5002 16.7788 14.414L21.526 10.9744C21.7925 10.7813 21.6551 10.3623 21.3252 10.3623H15.46C15.3123 10.3623 15.1813 10.2676 15.1358 10.1279Z"
                        fill="#FFAB00"
                      />
                    </svg>
                  ))}
                </div>
                <h1 className="text-5xl text-gray-800 text-center font-[bebas-neue] ">
                  {item.title}
                </h1>
                <p className="text-xl text-gray-800 text-center w-[90%]">
                  {item.description}
                </p>
                <h6 className="text-lg font-bold">{item.user}</h6>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        onClick={() => swiperRef.current?.swiper.slidePrev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#E53935] hover:bg-[#c92c24] text-white rounded-full flex items-center justify-center transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => swiperRef.current?.swiper.slideNext()}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#E53935] hover:bg-[#c92c24] text-white rounded-full flex items-center justify-center transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}
export default ToolsReviewProduct;
