import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const ReviewCard = ({ userID, createdAt, comment, rating }) => (
    <div className="flex flex-col justify-between p-6 bg-gray-100 mx-3 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-1 mb-3">
            {[...Array(rating)].map((_, i) => (
                <div
                    key={i}
                    className="text-[#ffaa41] w-5 h-5 flex items-center justify-center"
                >
                    <Star className="w-5 h-5 fill-[#ffaa41]" />
                </div>
            ))}
        </div>

        <p className="text-gray-700 text-sm sm:text-base mb-4">{comment}</p>

        <div>
            <h3 className="text-gray-900">{userID.username}</h3>
            <p className="text-gray-700 text-xs">{dayjs(createdAt).format("DD-MM-YYYY")}</p>
        </div>
    </div>
);

export default function BrandReviewFour({ storeSettings }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        if (storeSettings) fetchRecentReviews();
    }, [storeSettings]);

    const fetchRecentReviews = () => {
        setLoading(true);
        axios
            .get(
                `${import.meta.env.VITE_HOST}/platform/home/fetch-recent-reviews?brandSlug=${storeSettings?.brandSlug}`
            )
            .then((res) => {
                if (res.status === 200) setReviews(res.data?.reviews);
            })
            .catch((err) => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };

    return (
        <section className="w-full main-container pt-12 sm:pt-16 md:pt-20 lg:pt-24 relative">
            <div className="text-center mb-12">
                <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-gray-900">
                    WHAT OUR USERS SAY?
                </h2>
            </div>

            {reviews.length > 0 ? (
                <div className="relative px-0 sm:px-6">
                    {/* Prev Button */}
                    <button
                        ref={prevRef}
                        className="absolute right-16 -bottom-12 md:-bottom-14 bg-white border border-gray-300 text-gray-800 p-3 rounded-full shadow-sm hover:bg-[var(--pr)] hover:text-white transition-all duration-300 z-10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Next Button */}
                    <button
                        ref={nextRef}
                        className="absolute right-2 -bottom-12 md:-bottom-14 bg-white border border-gray-300 text-gray-800 p-3 rounded-full shadow-sm hover:bg-[var(--pr)] hover:text-white transition-all duration-300 z-10"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        loop={true}
                        speed={600}
                        slidesPerView={1}
                        autoplay={{ delay: 2000 }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }}
                        breakpoints={{
                            1024: { slidesPerView: 3 },
                            599: { slidesPerView: 2 },
                        }}
                    >
                        {reviews.map((r, idx) => (
                            <SwiperSlide key={idx}>
                                <ReviewCard {...r} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                !loading && <p className="text-center text-red-500">No reviews yet</p>
            )}
        </section>
    );
}