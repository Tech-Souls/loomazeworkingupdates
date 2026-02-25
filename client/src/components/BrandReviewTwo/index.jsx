import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, User2Icon } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const ReviewCard = ({ userID, comment, rating, createdAt }) => {
    const numericRating = Math.min(Math.max(Number(rating) || 0, 0), 5);

    return (
        <div className="flex flex-col gap-3 p-6 bg-[#f6f6f6] rounded-2xl shadow-md mx-2 transform transition duration-300 hover:scale-102 hover:shadow-xl">
            <div className="flex flex-1 justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
                        <User2Icon className="text-[var(--text)] font-bold" size={18} />
                        {userID.username}
                    </div>
                    <div className="flex gap-1 mt-2 text-[#f5d058]">
                        {[...Array(5)].map((_, index) => {
                            const starNumber = index + 1;
                            return (
                                <Star
                                    key={index}
                                    className={`w-5 h-5 ${starNumber <= numericRating
                                        ? "fill-current text-[#f5d058]"
                                        : "text-gray-300"
                                        }`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="text-xs text-gray-700">
                        {dayjs(createdAt).format("DD-MM-YYYY")}
                    </p>
                </div>
            </div>
            <p className="text-center text-[var(--text)] text-xs sm:text-sm flex-1 flex items-center">
                {comment}
            </p>
        </div>
    );
};

export default function BrandReview({ storeSettings }) {
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
        <div className="w-full main-container pt-12 sm:pt-18 md:pt-26 relative">
            <div className="text-center mb-10">
                <h1 className="head font-extrabold text-4xl text-[var(--text)]">
                    What Our User
                    <span className="text-[var(--pr)]">
                        <strong> Say?</strong>
                    </span>
                </h1>
            </div>

            {reviews.length > 0 ? (
                <div className="relative px-8 sm:px-4">
                    {/* Prev Button */}
                    <button
                        ref={prevRef}
                        className="absolute left-2 lg:-left-12 top-1/2 -translate-y-1/2 bg-[var(--pr)] text-white p-2 md:p-3 shadow-lg z-[9999] hover:bg-[var(--pr)]/70 transition-all duration-300 ease-linear rounded-full hover:border border-gray-700"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>

                    {/* Next Button */}
                    <button
                        ref={nextRef}
                        className="absolute right-2 lg:-right-12 top-1/2 -translate-y-1/2 bg-[var(--pr)] text-white p-2 md:p-3 shadow-lg z-[9999] hover:bg-[var(--pr)]/70 transition-all duration-300 ease-linear rounded-full hover:border border-gray-700"
                    >
                        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        loop={true}
                        speed={600}
                        slidesPerView={1}
                        autoplay={{ delay: 1500 }}
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
        </div>
    );
}