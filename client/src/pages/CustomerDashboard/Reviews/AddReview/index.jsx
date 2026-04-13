import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuthContext } from '../../../../contexts/AuthContext'
import Loader from '../../../../components/Loader'
import axios from 'axios'
import ButtonLoader from '../../../../components/ButtonLoader'

export default function AddReview({ isCustomDomain }) {
    const { user } = useAuthContext()
    const { brandSlug, orderID } = useParams()
    const [searchParams] = useSearchParams()
    const index = searchParams.get("index")

    const [product, setProduct] = useState({})
    const [currency, setCurrency] = useState("")
    const [rating, setRating] = useState(null)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user._id) return
        fetchOrder()
    }, [user])

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${import.meta.env.VITE_HOST}/user/reviews/add-review/fetch-order?userID=${user._id}&&orderID=${orderID}`)
            setProduct(res.data.order.products[index] || {})
            setCurrency(res.data.currency)
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const submitReview = async () => {
        try {
            if (!rating) window.toastify("Please select a rating star", "warning")

            const newReviewData = {
                userID: user._id,
                productID: product.productID,
                productImageURL: product.variantImageURL || product.mainImageURL,
                productTitle: product.title,
                productSlug: product.slug,
                brandSlug: product.brandSlug,
                rating,
                comment,
            }

            setSubmitting(true)
            const res = await axios.post(`${import.meta.env.VITE_HOST}/user/reviews/add-review?orderID=${orderID}&&index=${index}`, newReviewData)

            window.toastify(res.data.message, "success")
            setRating(null)
            setComment("")
            navigate(isCustomDomain ? `/customer/reviews` : `/brand/${brandSlug}/customer/reviews`)
        } catch (err) {
            console.error(err.message)
            window.toastify(err.response.data.message || "Something went wrong! Please try again.", "error")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <Loader />

    return (
        <div className='p-6'>
            <h2 className='head text-base sm:text-lg font-semibold'>Add Review</h2>
            <p className='text-sm bg-blue-50 text-blue-500 w-fit px-2 py-1 my-1 rounded-lg'>Add an honest review about the product</p>

            <div className='mt-4'>
                <h2 className='head text-sm sm:text-base'>Product Summary</h2>

                <div className='flex items-center gap-4 sm:gap-6 mt-4'>
                    <img src={`${product.variantImageURL || product.mainImageURL}`} alt={product.title} className='w-30 h-30 p-1 bg-gray-100 object-contain' />

                    <div>
                        <a
                            href={
                                isCustomDomain
                                    ? `/product/${product.slug}`
                                    : `/brand/${product.brandSlug}/product/${product.slug}`
                            }
                            target="_blank"
                            className="head text-sm sm:text-base text-gray-800 transition-all duration-200 ease-out hover:text-blue-500"
                        >
                            {product.title}
                        </a>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-800 mt-1">
                            {product.selectedOptions.map((opt, i) => (
                                <p key={i} className='bg-white px-1.5 py-0.5 border border-neutral-200 rounded'>{opt.optionName}: {opt.optionValue}</p>
                            ))}
                            <p className='bg-white px-1.5 py-0.5 border border-neutral-200 rounded'>Quantity: {product.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900 mt-1">
                            {currency} {product.price.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className='w-full max-w-3xl mt-6'>
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                onClick={() => setRating(star)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={star <= rating ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1}
                                className={`w-7 h-7 cursor-pointer transition-all duration-150 ${star <= rating ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"}`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.22 5.105a.563.563 0 00.475.345l5.519.403a.563.563 0 01.32.986l-4.21 3.663a.563.563 0 00-.182.557l1.254 5.385a.563.563 0 01-.835.61L12 18.354l-4.081 2.199a.563.563 0 01-.835-.61l1.254-5.385a.563.563 0 00-.182-.557L3.946 10.34a.563.563 0 01.32-.986l5.519-.403a.563.563 0 00.475-.345l2.22-5.105z"
                                />
                            </svg>
                        ))}
                    </div>

                    <ul className='text-sm text-gray-700 ml-4 list-disc'>
                        <li>Was the original product?</li>
                        <li>Was it brand new or re-packed?</li>
                        <li>Are you satisfied with our price?</li>
                    </ul>

                    <textarea name="comment" id="comment" rows={8} value={comment} placeholder='Enter your comment about the product' className='w-full p-3 mt-4 text-sm border border-gray-300 rounded-xl resize-none outline-[var(--secondary)]' onChange={e => setComment(e.target.value)}></textarea>

                    <button className='flex justify-center items-center w-full p-3 text-sm bg-[var(--userPr)]/70 rounded-lg hover:bg-[var(--userPr)] mt-3'
                        disabled={submitting}
                        onClick={submitReview}
                    >
                        {!submitting ? 'Submit Review' : <ButtonLoader />}
                    </button>
                </div>
            </div>
        </div>
    )
}