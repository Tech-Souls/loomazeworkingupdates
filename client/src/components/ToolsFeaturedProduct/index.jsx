import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./carousel.css";
import ToolsProductBox from "../ToolsProductBox";

function ToolsFeaturedProduct({ settings, isCustomDomain , storeSettings})  {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef(null);
  

useEffect(() => {
        if (storeSettings) {
            fetchFeaturedProducts();
        }
    }, [storeSettings]);
    console.log(settings, "store settings in featured products")

    const fetchFeaturedProducts = () => {
        setLoading(true);
        axios
            .get(
                `${import.meta.env.VITE_HOST}/platform/home/fetch-featured-products?sellerID=${storeSettings?.sellerID}`
            )
            .then((res) => {
                if (res.status === 200) {
                    setProducts(res.data?.products);
                }
            })
            .catch((err) => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };

  return (
    <section className="w-full relative font-[roboto-condensed] flex flex-col mt-15
    \ items-start gap-5  min-h-[80vh] px-5">
      <div className="w-full flex items-center  justify-center flex-col gap-5">
        <h1 className="text-[#E53935] text-2xl font-bold text-center">
          Popular Products
        </h1>
        <h1 className="text-slate-900 font-[bebas-neue] text-6xl  font-normal text-center">
      Customer Favorites
        </h1>
        <p className="text-lg text-gray-600 text-center">
        Explore our most sought-after products, chosen by customers for their quality, reliability, and performance.


        </p>
      </div>
      
    <div className="w-full  px-2 relative">
      <Swiper
        ref={swiperRef}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={12}
        breakpoints={{
          320: { slidesPerView: 1, slidesPerGroup: 1 },
          640: { slidesPerView: 2, slidesPerGroup: 2 },
          768: { slidesPerView: 3, slidesPerGroup: 3 },
          1024: { slidesPerView: 4, slidesPerGroup: 4 },
          1280: { slidesPerView: 5, slidesPerGroup: 5 },
        }}
        className="w-full"
      >
        {products.map((item, idx) => (
          <SwiperSlide key={idx} className="flex justify-center">
            <ToolsProductBox
              item={item}
              idx={idx}
              settings={settings}
              isCustomDomain={isCustomDomain}
            />
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
    </div>

    </section>
  );
}
       
export default ToolsFeaturedProduct;
