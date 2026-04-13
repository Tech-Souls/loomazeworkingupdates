import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import ViewChartModal from "../ViewChartModal";
import { Star } from "lucide-react";
import { BsShare } from "react-icons/bs";
import ButtonLoader from "../ButtonLoader";
import dayjs from "dayjs";
import axios from "axios";
import SaleCountdown from "../SaleCountdown";
import { addGuestCartItem } from "../../utils/guestCart";

const initialState = {
    productID: "", variantID: null, brandSlug: "", title: "", slug: "", mainImageURL: "", variantImageURL: null,
    quantity: 1, price: 0, comparedPrice: 0, stock: 0, selectedOptions: []
}

export default function ProductDetails({ settings, product }) {
    const { user, isAuthenticated, dispatch } = useAuthContext()
    const [state, setState] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [buyNowLoading, setBuyNowLoading] = useState(false)

    const [selectedVariant, setSelectedVariant] = useState(null)
    const [selectedOptionValues, setSelectedOptionValues] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewChart, setViewChart] = useState(false)

    const hasVariants = product?.variants && product.variants.length > 0
    const hasOptions = product?.options && product.options.length > 0

    const getImagesToShow = () => {
        if (selectedVariant?.imageURL) {
            return [`${selectedVariant.imageURL}`]
        }
        return product?.mainImageURL ? [`${product.mainImageURL}`] : []
    }

    const imagesToShow = getImagesToShow()

    // Check producy in favourites
    const isFavourite = user?.favourites?.includes(product._id)

    // Sale end time check
    const saleEndTime = settings?.sale?.saleEndTime;
    const isSaleActive = dayjs().isBefore(dayjs(saleEndTime));

    const customersViewing = Math.ceil(Math.random() * 100);

    // Shipping estimation
    const placeOrderDate = dayjs().format("DD MMM");
    const shippingDate = dayjs().add(settings?.shippingGap, "day").format("DD MMM");
    const deliveredDate = dayjs().add(settings?.deliveryGap, "day").format("DD MMM");

    useEffect(() => {
        if (!product) return

        // If product has exactly one variant, auto-select it
        if (hasVariants && product.variants.length === 1) {
            const singleVariant = product.variants[0]
            setSelectedVariant(singleVariant)

            // Set selected options
            const optionValues = {}
            product.options.forEach((opt, idx) => {
                optionValues[opt.name] = singleVariant.optionValues[idx]
            })
            setSelectedOptionValues(optionValues)
        }

        // Set initial state
        setState({
            productID: product.productID,
            variantID: null,
            brandSlug: product.brandSlug,
            title: product.title,
            slug: product.slug,
            mainImageURL: product.mainImageURL,
            variantImageURL: null,
            quantity: 1,
            price: product.price,
            comparedPrice: product.comparedPrice,
            stock: product.stock,
            selectedOptions: []
        })
    }, [product])

    // Update selected variant when option values change
    useEffect(() => {
        if (!hasVariants || !hasOptions) return

        // Check if all options are selected
        const allOptionsSelected = product.options.every(opt =>
            selectedOptionValues[opt.name] !== undefined
        )

        if (!allOptionsSelected) {
            setSelectedVariant(null)
            return
        }

        // Find matching variant
        const matchingVariant = product.variants.find(variant => {
            return product.options.every((opt, idx) => {
                return variant.optionValues[idx] === selectedOptionValues[opt.name]
            })
        })

        setSelectedVariant(matchingVariant || null)
    }, [selectedOptionValues, product, hasVariants, hasOptions])

    // Update state when variant changes
    useEffect(() => {
        if (!selectedVariant) {
            // Reset to base product
            setState(prev => ({
                ...prev,
                variantID: null,
                variantImageURL: null,
                price: product?.price,
                comparedPrice: product?.comparedPrice,
                stock: product?.stock,
                selectedOptions: []
            }))
            return
        }

        // Update state with variant data
        const selectedOptions = product.options.map((opt, idx) => ({
            optionName: opt.name,
            optionValue: selectedVariant.optionValues[idx]
        }))

        setState(prev => ({
            ...prev,
            variantID: selectedVariant.id,
            variantImageURL: selectedVariant.imageURL || product.mainImageURL,
            price: selectedVariant.price,
            stock: selectedVariant.stock,
            selectedOptions
        }))

        setCurrentIndex(0)
    }, [selectedVariant, product])

    const handleOptionChange = (optionName, optionValue) => {
        setSelectedOptionValues(prev => ({
            ...prev,
            [optionName]: optionValue
        }))
    }

    const handleAddToFavourites = async (e) => {
        e.preventDefault()
        if (!isAuthenticated || !user?._id) return window.toastify("Please login to continue!", "info")

        const productID = product._id

        try {
            let res
            if (isFavourite) {
                res = await axios.delete(`${import.meta.env.VITE_HOST}/user/favourites/remove`, { data: { userID: user._id, productID } })
                if (res.status === 200) {
                    window.toastify("Removed from favourites!", "success")
                    dispatch({
                        type: "UPDATE_FAVOURITES", payload: { favourites: user.favourites.filter(f => f !== productID) },
                    })
                }
            } else {
                res = await axios.post(`${import.meta.env.VITE_HOST}/user/favourites/add`, { userID: user._id, productID })
                if (res.status === 201) {
                    window.toastify("Added to favourites!", "success")
                    dispatch({ type: "UPDATE_FAVOURITES", payload: { favourites: [productID, ...(user.favourites || [])] }, })
                }
            }
        } catch (err) {
            window.toastify(err.response?.data?.message || "Error updating favourites", "error")
        }
    }

    // const handleAddToCart = () => {
    //     if (hasOptions && !selectedVariant) {
    //         const missingOptions = product.options.filter(
    //             opt => !selectedOptionValues[opt.name]
    //         )
    //         if (missingOptions.length > 0) {
    //             return window.toastify(
    //                 `Please select ${missingOptions[0].name}`,
    //                 "warning"
    //             )
    //         }
    //         return window.toastify("Please select all options", "warning")
    //     }

    //     // Check stock
    //     if (state.stock <= 0) {
    //         return window.toastify("Product is out of stock", "error")
    //     }

    //     if (!isAuthenticated || !user?._id) {
    //         const cart = addGuestCartItem(state)
    //         dispatch({ type: "UPDATE_GUEST_CART", payload: { cart } })
    //         return window.toastify("Added to cart", "success")
    //     }

    //     setLoading(true)
    //     axios.post(`${import.meta.env.VITE_HOST}/platform/product/add-to-cart?userID=${user._id}`, state)
    //         .then(res => {
    //             const { status, data } = res
    //             if (status === 201) {
    //                 window.toastify(data.message, "success")
    //                 dispatch({ type: "UPDATE_CART", payload: { cart: [state, ...(user.cart || [])] } });
    //             }
    //         })
    //         .catch(err => {
    //             window.toastify(err.response?.data?.message || "Error adding to cart", "error");
    //         })
    //         .finally(() => setLoading(false))
    // }

    // const handleBuyNow = () => {
    //     if (!isAuthenticated || !user?._id) return window.toastify("Please login to continue!", "info");

    //     // Validate variant selection
    //     if (hasOptions && !selectedVariant) {
    //         const missingOptions = product.options.filter(
    //             opt => !selectedOptionValues[opt.name]
    //         )
    //         if (missingOptions.length > 0) {
    //             return window.toastify(
    //                 `Please select ${missingOptions[0].name}`,
    //                 "warning"
    //             )
    //         }
    //         return window.toastify("Please select all options", "warning")
    //     }

    //     // Check stock
    //     if (state.stock <= 0) {
    //         return window.toastify("Product is out of stock", "error")
    //     }

    //     setBuyNowLoading(true)
    //     axios.post(`${import.meta.env.VITE_HOST}/platform/product/add-to-cart?userID=${user._id}`, state)
    //         .then(res => {
    //             const { status, data } = res
    //             if (status === 201) {
    //                 window.toastify(data.message, "success")
    //                 dispatch({ type: "UPDATE_CART", payload: { cart: [state, ...(user.cart || [])] } });
    //                 window.location.href = `/brand/${settings?.brandSlug}/cart`
    //             }
    //         })
    //         .catch(err => {
    //             window.toastify(err.response?.data?.message || "Error adding to cart", "error");
    //         })
    //         .finally(() => setBuyNowLoading(false))
    // }

    const validateSelection = () => {
        // Validate variant selection
        if (hasOptions && !selectedVariant) {
            const missingOptions = product.options.filter(
                opt => !selectedOptionValues[opt.name]
            )
            if (missingOptions.length > 0) {
                window.toastify(`Please select ${missingOptions[0].name}`, "warning")
                return false
            }
            window.toastify("Please select all options", "warning")
            return false
        }

        // Check stock
        if (state.stock <= 0) {
            window.toastify("Product is out of stock", "error")
            return false
        }

        return true
    }

    const handleAddToCart = () => {
        // Validate selection first
        if (!validateSelection()) return
        if (!isAuthenticated || !user?._id) return window.toastify("Please login to continue!", "info")

        // For guest users
        // if (!isAuthenticated || !user?._id) {
        //     const cart = addGuestCartItem(state);
        //     dispatch({ type: "UPDATE_GUEST_CART", payload: { cart } });
        //     window.toastify("Added to cart", "success");
        //     return;
        // }


        // For logged-in users
        setLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/platform/product/add-to-cart?userID=${user._id}`, state)
            .then(res => {
                const { status, data } = res
                if (status === 200 || status === 201) {
                    window.toastify(data.message, "success")
                    dispatch({ type: "UPDATE_CART", payload: { cart: [data, ...(user.cart || [])] } });
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Error adding to cart", "error");
            })
            .finally(() => setLoading(false))
    }

    const handleBuyNow = () => {
        // Validate selection first
        if (!validateSelection()) return

        // For guest users
        if (!isAuthenticated || !user?._id) {
            const cart = addGuestCartItem(state);
            dispatch({ type: "UPDATE_GUEST_CART", payload: { cart } });
            window.toastify("Added to cart", "success");
            window.location.href = `/brand/${settings?.brandSlug}/cart`;
            return;
        }

        // For logged-in users
        setBuyNowLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/platform/product/add-to-cart?userID=${user._id}`, state)
            .then(res => {
                const { status, data } = res
                if (status === 201) {
                    window.toastify(data.message, "success")
                    dispatch({ type: "UPDATE_CART", payload: { cart: [state, ...(user.cart || [])] } });
                    window.location.href = `/brand/${settings?.brandSlug}/cart`
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Error adding to cart", "error");
            })
            .finally(() => setBuyNowLoading(false))
    }

    return (
        <section className="py-10">
            <div className="main-container px-4 sm:px-8">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="flex justify-center">
                        <div className="relative flex-1">
                            {imagesToShow.length > 0 ? (
                                <>
                                    <img
                                        src={imagesToShow[currentIndex]}
                                        alt={`Product ${currentIndex + 1}`}
                                        className="rounded-none w-full h-full max-h-[600px] p-4 md:p-8 object-contain border border-gray-300"
                                    />
                                    <span className="absolute top-4 right-4 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                        {currentIndex + 1} / {imagesToShow.length}
                                    </span>

                                    {imagesToShow.length > 1 && (
                                        <div className="flex gap-2 mt-4 justify-center">
                                            {imagesToShow.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    onClick={() => setCurrentIndex(index)}
                                                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition 
                                                    ${currentIndex === index ? "border-blue-500 scale-110" : "border-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500">No images available</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{product?.title}</h3>

                        <div className="flex items-center gap-2">
                            <div className="flex gap-1 text-[#f5d058]">
                                {[...Array(5)].map((_, index) => {
                                    const starNumber = index + 1;
                                    return (
                                        <Star key={index} className={`w-4 h-4 ${starNumber <= product?.averageRating
                                            ? 'fill-current text-[#f5d058]'
                                            : 'text-gray-300'}`} />
                                    );
                                })}
                            </div>
                            <span className="font-semibold text-sm">{product?.averageRating?.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm">({product?.totalReviews} Reviews)</span>
                        </div>

                        <div className="flex justify-between mt-4">
                            <div>
                                <p className="font-semibold">
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-black">
                                        {settings?.content?.currency} {state.price?.toLocaleString()}
                                    </span>
                                </p>
                                {state.comparedPrice > state.price && (
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-xs sm:text-sm line-through text-red-400">
                                            {settings?.content?.currency} {state.comparedPrice?.toLocaleString()}
                                        </p>
                                        <p className="w-fit px-2 py-1 text-[10px] sm:text-xs bg-green-100 text-green-600 font-bold rounded-md">
                                            {Math.round(((state.comparedPrice - state.price) / state.comparedPrice) * 100)}% OFF
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-black mt-2">
                                    <span className="block text-gray-600 leading-tight">Availability</span>
                                    <strong className="font-extrabold">
                                        {state.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </strong>
                                    {state.stock > 0 && state.stock <= 10 && (
                                        <p className="text-xs text-gray-500 mt-1.5">
                                            Only {state.stock} left
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {(settings?.productPageVisibility?.showCountDown && product?.onSale && isSaleActive) &&
                            <div className="flex flex-col justify-center items-center p-5 sm:p-6 my-4 rounded-3xl"
                                style={{
                                    backgroundColor: settings?.sale?.saleBoxBgColor || "#000000",
                                    color: settings?.sale?.saleBoxTextColor || "#ffffff"
                                }}
                            >
                                <h2 className="text-lg text-center mb-3">{settings?.sale?.saleHeading}</h2>
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <SaleCountdown endTime={settings?.sale?.saleEndTime} />
                                </div>
                            </div>
                        }

                        {settings?.productPageVisibility?.showPeopleViewing &&
                            <div className="flex items-center gap-2 my-4">
                                <svg className="icon w-4" id="icon-eye" viewBox="0 0 511.626 511.626"><g><path d="M505.918,236.117c-26.651-43.587-62.485-78.609-107.497-105.065c-45.015-26.457-92.549-39.687-142.608-39.687 c-50.059,0-97.595,13.225-142.61,39.687C68.187,157.508,32.355,192.53,5.708,236.117C1.903,242.778,0,249.345,0,255.818 c0,6.473,1.903,13.04,5.708,19.699c26.647,43.589,62.479,78.614,107.495,105.064c45.015,26.46,92.551,39.68,142.61,39.68 c50.06,0,97.594-13.176,142.608-39.536c45.012-26.361,80.852-61.432,107.497-105.208c3.806-6.659,5.708-13.223,5.708-19.699 C511.626,249.345,509.724,242.778,505.918,236.117z M194.568,158.03c17.034-17.034,37.447-25.554,61.242-25.554 c3.805,0,7.043,1.336,9.709,3.999c2.662,2.664,4,5.901,4,9.707c0,3.809-1.338,7.044-3.994,9.704 c-2.662,2.667-5.902,3.999-9.708,3.999c-16.368,0-30.362,5.808-41.971,17.416c-11.613,11.615-17.416,25.603-17.416,41.971 c0,3.811-1.336,7.044-3.999,9.71c-2.667,2.668-5.901,3.999-9.707,3.999c-3.809,0-7.044-1.334-9.71-3.999 c-2.667-2.666-3.999-5.903-3.999-9.71C169.015,195.482,177.535,175.065,194.568,158.03z M379.867,349.04 c-38.164,23.12-79.514,34.687-124.054,34.687c-44.539,0-85.889-11.56-124.051-34.687s-69.901-54.2-95.215-93.222 c28.931-44.921,65.19-78.518,108.777-100.783c-11.61,19.792-17.417,41.207-17.417,64.236c0,35.216,12.517,65.329,37.544,90.362 s55.151,37.544,90.362,37.544c35.214,0,65.329-12.518,90.362-37.544s37.545-55.146,37.545-90.362 c0-23.029-5.808-44.447-17.419-64.236c43.585,22.265,79.846,55.865,108.776,100.783C449.767,294.84,418.031,325.913,379.867,349.04 z"></path> </g></svg>
                                <p className="text-sm">{customersViewing} customers are viewing this product</p>
                            </div>
                        }

                        {hasOptions && product.options.map((option, optionIdx) => (
                            <fieldset key={optionIdx} className="space-y-2">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-semibold">{option.name}</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {option.values.map((value, valueIdx) => {
                                        const isSelected = selectedOptionValues[option.name] === value

                                        return (
                                            <button
                                                key={valueIdx}
                                                className={`text-sm border px-4 py-2 transition-all duration-200 ease-linear
                                                    ${isSelected
                                                        ? "font-bold text-[var(--pr)] border-[var(--pr)]"
                                                        : "text-gray-900 border-gray-300"
                                                    }`}
                                                onClick={() => handleOptionChange(option.name, value)}
                                            >
                                                {value}
                                            </button>
                                        )
                                    })}
                                </div>
                            </fieldset>
                        ))}

                        {product?.sizeChart &&
                            <p className="flex items-center gap-2 text-xs cursor-pointer transition-all duration-200 ease-linear mt-4"
                                onClick={() => setViewChart(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                                    <path d="M5 9.97873C5 11.095 6.79086 12 9 12V9.97873C9 8.98454 9 8.48745 8.60252 8.18419C8.20504 7.88092 7.811 7.99435 7.02292 8.22121C5.81469 8.56902 5 9.2258 5 9.97873Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M16 8.5C16 10.433 12.866 12 9 12C5.13401 12 2 10.433 2 8.5C2 6.567 5.13401 5 9 5C12.866 5 16 6.567 16 8.5Z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M2 9V15.6667C2 17.5076 5.13401 19 9 19H20C20.9428 19 21.4142 19 21.7071 18.7071C22 18.4142 22 17.9428 22 17V14C22 13.0572 22 12.5858 21.7071 12.2929C21.4142 12 20.9428 12 20 12H9" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M18 19V17M14 19V17M10 19V17M6 18.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Size Guide
                            </p>
                        }

                        <div className="flex flex-col gap-2 sm:gap-2.5 mt-4 w-full">
                            <div className="flex flex-col lg:flex-row lg:items-end gap-2.5">
                                <div className="flex w-fit flex-col gap-2">
                                    <h4 className="font-bold">Quantity</h4>
                                    <div className="flex items-center border border-gray-400 rounded-none">
                                        <button className="px-3 text-xl text-gray-600 font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]"
                                            onClick={() => {
                                                setState(prev => ({
                                                    ...prev, quantity: prev.quantity > 1
                                                        ? prev.quantity - 1 : 1
                                                }))
                                            }}
                                        >
                                            &minus;
                                        </button>
                                        <input id="quantity" type="number" value={state?.quantity} readOnly className="w-10 text-center px-0! py-2.5! border-none! rounded-none!" />
                                        <button className="px-3 text-xl text-gray-600 font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]"
                                            onClick={() => {
                                                setState(prev => ({
                                                    ...prev, quantity: product.stock && prev.quantity < product.stock
                                                        ? prev.quantity + 1
                                                        : prev.quantity
                                                }))
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-1 items-center gap-2.5">
                                    <button className="flex-1 bg-[#000] text-white text-sm font-bold px-6 py-3 border border-[#202020] rounded-none transition-all duration-200 ease-linear hover:bg-white hover:text-[#202020] hover:border-[#202020]"
                                        disabled={loading}
                                        onClick={handleAddToCart}
                                    >
                                        {!loading ?
                                            'ADD TO CART'
                                            :
                                            <span className="flex justify-center items-center gap-2">Adding to Cart... <ButtonLoader /></span>
                                        }
                                    </button>

                                    <button className={`flex justify-center items-center border border-gray-400 w-12 h-12 rounded-full
                                        ${isFavourite ? "bg-[#000] text-white hover:opacity-90" : "hover:bg-gray-200"}`}
                                        onClick={handleAddToFavourites}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                                            <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </button>

                                    <button className="flex justify-center items-center border border-gray-400 w-12 h-12 rounded-full hover:bg-gray-200"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href)
                                                .then(() => {
                                                    window.toastify("Link copied!", "success");
                                                })
                                                .catch(() => {
                                                    window.toastify("Failed to copy!", "error");
                                                });
                                        }}
                                    >
                                        <BsShare />
                                    </button>
                                </div>
                            </div>
                            <button className="flex-1 bg-white text-[#202020] text-sm font-bold border border-gray-400 px-6 py-3 rounded-none transition-all duration-200 ease-linear hover:bg-[#000] hover:text-white hover:border-[#000]"
                                disabled={buyNowLoading}
                                onClick={handleBuyNow}
                            >
                                {!buyNowLoading ?
                                    <span>{settings?.paymentModes?.cod ? "BUY WITH CASH ON DELIVERY" : "BUY IT NOW"}</span>
                                    :
                                    <span className="flex justify-center items-center gap-2">Please wait... <ButtonLoader /></span>
                                }
                            </button>
                        </div>

                        {settings?.productPageVisibility?.showDeliveryDateEstimate &&
                            <div className="flex justify-between items-center mt-8">
                                <div className="flex flex-col items-center justify-center text-xs">
                                    <div className="w-8 h-8 rounded-full mb-2">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="1.3"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" stroke="#202020" strokeWidth="1.3"></path> <path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z" stroke="#202020" strokeWidth="1.3"></path> <path d="M11 10.8L12.1429 12L15 9" stroke="#202020" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 3L2.26121 3.09184C3.5628 3.54945 4.2136 3.77826 4.58584 4.32298C4.95808 4.86771 4.95808 5.59126 4.95808 7.03836V9.76C4.95808 12.7016 5.02132 13.6723 5.88772 14.5862C6.75412 15.5 8.14857 15.5 10.9375 15.5H12M16.2404 15.5C17.8014 15.5 18.5819 15.5 19.1336 15.0504C19.6853 14.6008 19.8429 13.8364 20.158 12.3075L20.6578 9.88275C21.0049 8.14369 21.1784 7.27417 20.7345 6.69708C20.2906 6.12 18.7738 6.12 17.0888 6.12H11.0235M4.95808 6.12H7" stroke="#202020" strokeWidth="1.3" strokeLinecap="round"></path> </g></svg>
                                    </div>
                                    <p>Place Order</p>
                                    <p>{placeOrderDate}</p>
                                </div>

                                <div className="flex-1 h-px bg-black mx-2"></div>

                                <div className="flex flex-col items-center justify-center text-xs">
                                    <div className="w-8 h-8 rounded-full mb-2 text-[#202020]">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="shipping-fast" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M280 192c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240zm352 192h-24V275.9c0-16.8-6.8-33.3-18.8-45.2l-83.9-83.9c-11.8-12-28.3-18.8-45.2-18.8H416V78.6c0-25.7-22.2-46.6-49.4-46.6H113.4C86.2 32 64 52.9 64 78.6V96H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H96V78.6c0-8.1 7.8-14.6 17.4-14.6h253.2c9.6 0 17.4 6.5 17.4 14.6V384H207.6C193 364.7 170 352 144 352c-18.1 0-34.6 6.2-48 16.4V288H64v144c0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16h195.2c-1.1 5.2-1.6 10.5-1.6 16 0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H632c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm-488 96c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm272-320h44.1c8.4 0 16.7 3.4 22.6 9.4l83.9 83.9c.8.8 1.1 1.9 1.8 2.8H416V160zm80 320c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-96h-16.4C545 364.7 522 352 496 352s-49 12.7-63.6 32H416v-96h160v96zM256 248v-16c0-4.4-3.6-8-8-8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8z"></path></svg>
                                    </div>
                                    <p>Shipping</p>
                                    <p>{shippingDate} - {dayjs(shippingDate).add(1, "day").format("DD MMM")}</p>
                                </div>

                                <div className="flex-1 h-px bg-black mx-2"></div>

                                <div className="flex flex-col items-center justify-center text-xs">
                                    <div className="w-6 h-6 rounded-full mb-2">
                                        <svg fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.192"></g><g id="SVGRepo_iconCarrier"> <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM22.386 10.146l-9.388 9.446-4.228-4.227c-0.39-0.39-1.024-0.39-1.415 0s-0.391 1.023 0 1.414l4.95 4.95c0.39 0.39 1.024 0.39 1.415 0 0.045-0.045 0.084-0.094 0.119-0.145l9.962-10.024c0.39-0.39 0.39-1.024 0-1.415s-1.024-0.39-1.415 0z"></path> </g></svg>
                                    </div>
                                    <p>Delivered</p>
                                    <p>{deliveredDate} - {dayjs(deliveredDate).add(1, "day").format("DD MMM")}</p>
                                </div>
                            </div>
                        }

                        {settings?.productPageVisibility?.showStoreServices &&
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-4 mt-8">
                                <div className="flex justify-center items-center gap-3 bg-[#fff] h-20 shad border border-gray-200">
                                    <div className="w-6 h-6 rounded-full text-[#202020]">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="shipping-fast" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M280 192c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240zm352 192h-24V275.9c0-16.8-6.8-33.3-18.8-45.2l-83.9-83.9c-11.8-12-28.3-18.8-45.2-18.8H416V78.6c0-25.7-22.2-46.6-49.4-46.6H113.4C86.2 32 64 52.9 64 78.6V96H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H96V78.6c0-8.1 7.8-14.6 17.4-14.6h253.2c9.6 0 17.4 6.5 17.4 14.6V384H207.6C193 364.7 170 352 144 352c-18.1 0-34.6 6.2-48 16.4V288H64v144c0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16h195.2c-1.1 5.2-1.6 10.5-1.6 16 0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H632c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm-488 96c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm272-320h44.1c8.4 0 16.7 3.4 22.6 9.4l83.9 83.9c.8.8 1.1 1.9 1.8 2.8H416V160zm80 320c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-96h-16.4C545 364.7 522 352 496 352s-49 12.7-63.6 32H416v-96h160v96zM256 248v-16c0-4.4-3.6-8-8-8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8z"></path></svg>
                                    </div>
                                    <h2 className="text-sm">Fast Delivery</h2>
                                </div>
                                <div className="flex justify-center items-center gap-3 bg-[#fff] h-20 shad border border-gray-200">
                                    <div className="w-6 h-6 rounded-full text-[#202020]">
                                        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#202020"><g id="SVGRepo_bgCarrier" strokeWidth="1"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 0h48v48H0z" fill="none"></path> <g id="Shopicon"> <path d="M10,22v2c0,7.72,6.28,14,14,14s14-6.28,14-14s-6.28-14-14-14h-6.662l3.474-4.298l-3.11-2.515L10.577,12l7.125,8.813 l3.11-2.515L17.338,14H24c5.514,0,10,4.486,10,10s-4.486,10-10,10s-10-4.486-10-10v-2H10z"></path> </g> </g></svg>
                                    </div>
                                    <h2 className="text-sm">Easy Returns</h2>
                                </div>
                                <div className="flex justify-center items-center gap-3 bg-[#fff] h-20 shad border border-gray-200">
                                    <div className="w-5 h-5 rounded-full text-[#202020]">
                                        <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.92 7.96997C18.9781 7.58275 19.0048 7.19156 19 6.80005C17.8347 5.58901 16.437 4.62559 14.8905 3.96753C13.344 3.30947 11.6806 2.97021 10 2.97021C8.31935 2.97021 6.65602 3.30947 5.10956 3.96753C3.5631 4.62559 2.16532 5.58901 1 6.80005C1 20.86 10 22.97 10 22.97C10.6656 22.6883 11.3077 22.3539 11.92 21.97" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M23 13.97H13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M21 10.9199H15C13.8954 10.9199 13 11.8154 13 12.9199V17.9199C13 19.0245 13.8954 19.9199 15 19.9199H21C22.1046 19.9199 23 19.0245 23 17.9199V12.9199C23 11.8154 22.1046 10.9199 21 10.9199Z" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    </div>
                                    <h2 className="text-sm">Secure Payments</h2>
                                </div>
                                <div className="flex justify-center items-center gap-3 bg-[#fff] h-20 shad border border-gray-200">
                                    <div className="w-5 h-5 rounded-full text-[#202020]">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.9844 10C21.9473 8.68893 21.8226 7.85305 21.4026 7.13974C20.8052 6.12523 19.7294 5.56066 17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42229 3.38197L6.42229 4.43152C4.27063 5.56066 3.19479 6.12523 2.5974 7.13974C2 8.15425 2 9.41667 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27063 18.4393 6.42229 19.5685L8.42229 20.618C10.1779 21.5393 11.0557 22 12 22C12.9443 22 13.8221 21.5393 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C21.8226 16.1469 21.9473 15.3111 21.9844 14" stroke="#202020" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5" stroke="#202020" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                                    </div>
                                    <h2 className="text-sm">Reliable Products</h2>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                {product?.description &&
                    <div className="mt-10">
                        <h1 className="mb-3 font-extrabold text-[var(--text)]">Description</h1>
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                }
            </div>

            {viewChart && (
                <ViewChartModal
                    chart={product?.sizeChart}
                    onClose={() => setViewChart(false)}
                />
            )}
        </section>
    );
}