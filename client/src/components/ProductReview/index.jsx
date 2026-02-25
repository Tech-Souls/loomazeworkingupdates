import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import verifiedImg from "../../assets/images/review-verified.svg";
import axios from "axios";

const RatingSummary = ({ rating }) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="flex items-center space-x-1">
            {[...Array(totalStars)].map((_, i) => {
                if (i < filledStars) {
                    return <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
                }
                if (i === filledStars && hasHalfStar) {
                    return (
                        <Star
                            key={i}
                            className="w-5 h-5 text-yellow-500 fill-yellow-300 opacity-70"
                        />
                    );
                }
                return <Star key={i} className="w-5 h-5 text-gray-300" />;
            })}
        </div>
    );
};

export default function ProductReview({ productID }) {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        if (!productID) return
        fetchReviews()
    }, [productID])

    const fetchReviews = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_HOST}/platform/product/fetch-reviews?productID=${productID}`
            );
            if (res.status === 200) {
                const data = res.data.reviews || [];
                setReviews(data);
                if (data.length > 0) {
                    const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
                    setAvgRating(avg.toFixed(1));
                }
            }
        } catch (err) {
            console.error("Failed to fetch reviews:", err.message);
        }
    };

    return (
        <section className="py-12">
            <div className="main-container space-y-10">
                <div className="flex justify-between items-center bg-[#f3f3f3] p-4 px-6">
                    <h3 className="font-extrabold text-lg">Reviews</h3>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold mb-1">
                            {avgRating || "0.0"} / 5.0
                        </span>
                        <RatingSummary rating={avgRating} />
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                        No reviews yet for this product.
                    </p>
                ) : (
                    reviews.slice(0, visibleCount).map((review, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-300 p-4 sm:p-6 rounded-none"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-8">
                                    <div className="border-0 rounded-full bg-gray-400 flex w-10 h-10 items-center justify-center text-white">
                                        {review?.userID?.username?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {review?.userID?.username || "Anonymous"}
                                        </h3>
                                        <RatingSummary rating={review.rating} />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="flex items-center">
                                        <img src={verifiedImg} alt="Verified" className="w-4 h-4" />
                                        <span className="text-green-500 text-sm ml-1">
                                            Verified
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-sm">
                                        {new Date(review.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600">{review.comment}</p>
                        </div>
                    ))
                )}

                {reviews.length > visibleCount && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + 3)}
                            className="bg-[#f3f3f3] text-black px-6 py-2 shadow hover:bg-[#f3f3f3]/70"
                        >
                            Show More
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}