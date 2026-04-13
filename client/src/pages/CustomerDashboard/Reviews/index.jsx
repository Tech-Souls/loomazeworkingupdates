import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";
import { FaStar } from "react-icons/fa";
import Loader from "../../../components/Loader";
import dayjs from "dayjs";
import axios from "axios";

export default function Reviews({ isCustomDomain }) {
    const { user } = useAuthContext()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user._id) return
        fetchReviews()
    }, [user])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${import.meta.env.VITE_HOST}/user/reviews/all?userID=${user._id}`)
            setReviews(res.data.reviews || [])
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />

    return (
        <div className="p-6">
            <p className="w-fit mb-6 px-4 py-2 text-xs sm:text-sm font-medium bg-[var(--userPr)] text-white rounded-full">Review History</p>

            <div className="space-y-4">
                {reviews.length > 0 ?
                    reviews.map((review) => (
                        <div
                            key={review._id}
                            className="rounded-xl p-6 border border-gray-200 shad">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`${review.productImageURL}`}
                                        alt={review.productTitle}
                                        className="w-14 h-14 p-1 rounded-md object-contain bg-[var(--userPr)]/30" />
                                    <div>
                                        <a
                                            href={
                                                isCustomDomain
                                                    ? `/product/${review.productSlug}`
                                                    : `/brand/${review.brandSlug}/product/${review.productSlug}`
                                            }
                                            target="_blank"
                                            className="head text-sm sm:text-base text-gray-800 transition-all duration-200 ease-out hover:text-blue-500"
                                        >
                                            {review.productTitle}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <p className="text-xs sm:text-sm text-gray-700">
                                        Reviewed on: <span className="font-bold">{dayjs(review.createdAt).format("DD-MM-YYYY")}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center mt-3">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`} />
                                ))}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mt-4">{review.comment}</p>
                        </div>
                    ))
                    :
                    <p className="text-sm text-center bg-amber-100 text-amber-600 p-2 rounded-lg">No review added yet!</p>
                }
            </div>
        </div>
    );
}