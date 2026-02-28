import React, { useEffect, useRef, useState } from "react";
import { Star, User2Icon, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const demoReviews = [
    { userID: { username: "JohnDoe" }, comment: "Amazing product! Really loved the quality and fast delivery.", rating: 5, createdAt: "2026-02-08T12:30:00Z" },
    { userID: { username: "JaneSmith" }, comment: "Good service, but the packaging could be improved slightly.", rating: 4, createdAt: "2026-02-07T09:15:00Z" },
    { userID: { username: "AlexR" }, comment: "Average experience. Product is okay, but shipping was delayed.", rating: 3, createdAt: "2026-02-06T14:45:00Z" },
    { userID: { username: "LisaM" }, comment: "Not satisfied with the product quality. Would not recommend.", rating: 2, createdAt: "2026-02-05T10:00:00Z" },
    { userID: { username: "MikeB" }, comment: "Terrible experience! Package arrived damaged and very late.", rating: 1, createdAt: "2026-02-04T08:20:00Z" },
];

const StarRating = ({ rating, size = 16 }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
            <Star key={i} size={size}
                className={i <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
            />
        ))}
    </div>
);

const RatingBar = ({ star, count, total }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="w-3 text-gray-500 text-right">{star}</span>
            <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-8 text-xs text-gray-400 text-right">{count}</span>
        </div>
    );
};

const ReviewCard = ({ userID, comment, rating, createdAt }) => (
    <div className="flex flex-col gap-3 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 mx-2 h-full">
        <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--pr)] to-[var(--sec,#999)] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {userID?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">{userID?.username}</p>
                    <p className="text-xs text-gray-400">{dayjs(createdAt).format("DD MMM YYYY")}</p>
                </div>
            </div>
            <StarRating rating={Math.min(Math.max(Number(rating) || 0, 0), 5)} size={13} />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{comment}</p>
    </div>
);

export default function BrandReview({ storeSettings }) {
    const [reviews, setReviews] = useState(demoReviews);
    const [loading, setLoading] = useState(false);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        if (storeSettings) fetchRecentReviews();
    }, [storeSettings]);

    const fetchRecentReviews = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-recent-reviews?brandSlug=${storeSettings?.brandSlug}`)
            .then(res => { if (res.status === 200 && res.data?.reviews?.length > 0) setReviews(res.data.reviews); })
            .catch(err => console.error("Reviews fetch error", err.message))
            .finally(() => setLoading(false));
    };

    // ── Stats ─────────────────────────────────────────────────────────────────
    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / total).toFixed(1) : "0.0";
    const countByStar = [5,4,3,2,1].map(star => ({
        star,
        count: reviews.filter(r => Math.round(Number(r.rating)) === star).length
    }));

    return (
        <section className="w-full py-14 sm:py-20 px-4 sm:px-8 bg-[#fafafa]">
            <div className="max-w-6xl mx-auto">

                {/* Section Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-10">
                    Customer <span className="text-[var(--pr)]">Reviews</span>
                </h2>

                {/* Top Summary Row */}
                <div className="flex flex-col sm:flex-row gap-8 mb-12 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">

                    {/* Average Score */}
                    <div className="flex flex-col items-center justify-center min-w-[120px]">
                        <p className="text-6xl font-extrabold text-gray-900 leading-none">{avgRating}</p>
                        <StarRating rating={Math.round(Number(avgRating))} size={20} />
                        <p className="text-sm text-gray-400 mt-1">{total} ratings</p>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-px bg-gray-100" />

                    {/* Rating Bars */}
                    <div className="flex flex-col gap-2 flex-1 justify-center">
                        {countByStar.map(({ star, count }) => (
                            <RatingBar key={star} star={star} count={count} total={total} />
                        ))}
                    </div>
                </div>

                {/* Reviews Slider */}
                {reviews.length > 0 ? (
                    <div className="relative">
                        {/* Nav Buttons */}
                        <button ref={prevRef}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-[var(--pr)] hover:text-white hover:border-[var(--pr)] transition-all duration-200">
                            <ChevronLeft size={18} />
                        </button>
                        <button ref={nextRef}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-[var(--pr)] hover:text-white hover:border-[var(--pr)] transition-all duration-200">
                            <ChevronRight size={18} />
                        </button>

                        <Swiper
                            modules={[Navigation, Autoplay]}
                            loop={true}
                            speed={600}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                            onInit={swiper => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                                swiper.navigation.init();
                                swiper.navigation.update();
                            }}
                            breakpoints={{
                                1024: { slidesPerView: 3, spaceBetween: 16 },
                                640:  { slidesPerView: 2, spaceBetween: 12 },
                                0:    { slidesPerView: 1, spaceBetween: 10 },
                            }}
                        >
                            {reviews.map((r, i) => (
                                <SwiperSlide key={i} className="h-auto">
                                    <ReviewCard {...r} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    !loading && <p className="text-center text-gray-400 mt-6">No reviews yet</p>
                )}
            </div>
        </section>
    );
}