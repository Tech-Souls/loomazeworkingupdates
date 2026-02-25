import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../contexts/AuthContext'
import { FaShieldAlt, FaTrash } from 'react-icons/fa'
import Loader from '../../../components/Loader'
import axios from 'axios'
import Checkout from '../../../components/Checkout'
import { updateGuestCartItemQuantity } from '../../../utils/guestCart'

export default function Cart({ settings, isCustomDomain }) {
    const { user, isAuthenticated, guestCart, dispatch } = useAuthContext()
    const [cart, setCart] = useState([])
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [updatingCart, setUpdatingCart] = useState(false)
    const [showCheckoutModal, setShowCheckoutModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Guest shipping details state
    const [guestShippingDetails, setGuestShippingDetails] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        province: "",
        city: "",
        place: "",
        address: ""
    })

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
    const [selectedGateway, setSelectedGateway] = useState(null)
    const [transactionID, setTransactionID] = useState(null)
    const [transactionSS, setTransactionSS] = useState(null)
    const [transactionSSPreview, setTransactionSSPreview] = useState(null)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [showGuestShippingForm, setShowGuestShippingForm] = useState(false)

    useEffect(() => {
        if (isAuthenticated && user._id) {
            // For logged-in users
            setCart(user?.cart || [])
        } else {
            // For guest users
            setCart(guestCart || [])
        }
    }, [user._id, isAuthenticated, guestCart])

    useEffect(() => {
        if (cart.length === 0 && appliedCoupon) {
            setAppliedCoupon(null);
            setDiscount(0);
        }
    }, [cart]);

    const handleUpdateQuantity = async (item, action) => {
        setUpdatingCart(true)

        const { productID, variantID } = item;

        if (isAuthenticated && user._id) {
            // For logged-in users
            const updatedCart = cart.map(cartItem => {
                if (
                    cartItem.productID === productID &&
                    cartItem.variantID === variantID
                ) {
                    let newQuantity = cartItem.quantity;

                    if (action === "increment") {
                        if (cartItem.quantity < cartItem.stock) {
                            newQuantity = cartItem.quantity + 1;
                        } else {
                            window.toastify(`Only ${cartItem.stock} item(s) available in stock`, "info");
                        }
                    } else if (action === "decrement") {
                        newQuantity = Math.max(1, cartItem.quantity - 1);
                    }

                    return { ...cartItem, quantity: newQuantity };
                }
                return cartItem;
            })

            setCart(updatedCart);

            try {
                const res = await axios.patch(`${import.meta.env.VITE_HOST}/platform/cart/update-quantity`, {
                    userID: user?._id, productID, variantID, action,
                });

                if (res.status === 200) {
                    dispatch({ type: "UPDATE_CART", payload: { cart: res.data.cart } });
                }
            } catch (err) {
                console.error("Quantity update failed:", err.message);
            } finally {
                setUpdatingCart(false)
            }
        } else {
            // For guest users
            const itemId = `${productID}_${variantID || 'base'}`;
            const currentItem = cart.find(item =>
                `${item.productID}_${item.variantID || 'base'}` === itemId
            );

            if (!currentItem) {
                setUpdatingCart(false);
                return;
            }

            let newQuantity = currentItem.quantity;

            if (action === "increment") {
                if (currentItem.quantity < currentItem.stock) {
                    newQuantity = currentItem.quantity + 1;
                } else {
                    window.toastify(`Only ${currentItem.stock} item(s) available in stock`, "info");
                    setUpdatingCart(false);
                    return;
                }
            } else if (action === "decrement") {
                newQuantity = Math.max(1, currentItem.quantity - 1);
            }

            // Update guest cart in localStorage and state
            const updatedCart = updateGuestCartItemQuantity(itemId, newQuantity);
            setCart(updatedCart);
            dispatch({ type: "UPDATE_GUEST_CART", payload: { cart: updatedCart } });
            setUpdatingCart(false);
        }
    };

    const handleRemoveFromCart = (item) => {
        const { productID, variantID } = item;

        if (isAuthenticated && user._id) {
            // For logged-in users
            const updatedCart = cart.filter(
                cartItem =>
                    !(
                        cartItem.productID === productID &&
                        cartItem.variantID === variantID
                    )
            );
            setCart(updatedCart)

            setLoading(true);
            axios.delete(`${import.meta.env.VITE_HOST}/platform/cart/remove-from-cart`, {
                params: { userID: user?._id, productID, variantID },
            })
                .then(res => {
                    const { status, data } = res
                    if (status === 203) {
                        window.toastify(data.message, "success")
                        dispatch({ type: "UPDATE_CART", payload: { cart: updatedCart } });
                    }
                })
                .catch(err => console.error('Frontend DELETE error', err.message))
                .finally(() => setLoading(false))
        } else {
            // For guest users
            const itemId = `${productID}_${variantID || 'base'}`;
            const updatedCart = updateGuestCartItemQuantity(itemId, 0);
            setCart(updatedCart);
            dispatch({ type: "UPDATE_GUEST_CART", payload: { cart: updatedCart } });
            window.toastify("Item removed from cart", "success");
        }
    }

    const getCartItemKey = (item) => `${item.productID}-${item.variantID || 'no-variant'}`

    const renderVariantOptions = (item) => {
        if (!item.selectedOptions || item.selectedOptions.length === 0) return null;

        return (
            <div className='flex items-center gap-2 mt-1 flex-wrap'>
                {item.selectedOptions.map((option, idx) => (
                    <p key={idx} className='text-[10px] text-gray-900 bg-gray-100 px-1 py-0.5 rounded border border-gray-200'>
                        <span className='font-bold'>{option.optionName}:</span> {option.optionValue}
                    </p>
                ))}
            </div>
        )
    }

    // Calculation 
    const amount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const totalWeight = cart.reduce((acc, item) => {
        if (!item.weight) return acc;

        let weightKg = 0;
        const unit = item.weightUnit?.toLowerCase() || "kg";

        switch (unit) {
            case "g":
                weightKg = item.weight / 1000;
                break;
            case "lb":
                weightKg = item.weight * 0.453592;
                break;
            default:
                weightKg = item.weight;
        }

        return acc + weightKg * item.quantity;
    }, 0);

    let deliveryCharges = 0

    if (settings.deliveryCharges?.amount) {
        deliveryCharges = cart.length * settings.deliveryCharges.amount
    }

    if (settings.deliveryCharges?.byWeight) {
        deliveryCharges = totalWeight * settings.deliveryCharges.byWeight
    }

    if (settings.deliveryCharges?.freeDeliveryAbove && amount >= settings.deliveryCharges?.freeDeliveryAbove) {
        deliveryCharges = 0
    }

    const netPayable = amount + deliveryCharges - discount;

    // Apply Coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return window.toastify("Enter a coupon code", "info");

        try {
            const res = await axios.post(`${import.meta.env.VITE_HOST}/platform/coupons/verify-coupon`, {
                sellerID: settings?.sellerID,
                code: couponCode.trim(), amount
            });

            const { coupon } = res.data;

            if (coupon.minOrderValue && amount < coupon.minOrderValue) {
                return window.toastify(`Minimum order value is ${settings.content.currency}${coupon.minOrderValue.toLocaleString()} to use this coupon`, "info");
            }

            setAppliedCoupon(coupon);

            let discountAmount = 0;
            if (coupon.type === "percentage") {
                discountAmount = (amount * coupon.value) / 100;
            } else if (coupon.type === "fixed") {
                discountAmount = coupon.value * cart.length;
            }

            if (discountAmount > amount) discountAmount = amount;

            setDiscount(discountAmount);
            window.toastify(`Coupon applied! You saved ${settings.content.currency} ${discountAmount.toLocaleString()}`, "success");
        } catch (err) {
            console.error("Apply coupon error:", err);
            window.toastify(err.response?.data?.message || "Invalid coupon", "error");
            setAppliedCoupon(null);
            setDiscount(0);
        }
    };

    const handleCheckout = () => {
        if (cart.length === 0) return

        if (isAuthenticated) {
            // For logged-in users
            if ([user.phoneNumber, user.address, user.city, user.place, user.province].some(v => !v?.trim())) {
                return window.toastify("Please complete your shipping details in your profile!", "warning");
            }
            setShowCheckoutModal(true)
        } else {
            // For guest users - always show shipping form modal
            setShowGuestShippingForm(true);
        }
    }

    const handleGuestShippingSubmit = (e) => {
        e.preventDefault();

        const { fullName, email, phoneNumber, province, city, place, address } = guestShippingDetails;

        if (!fullName.trim() || !email.trim() || !phoneNumber.trim() ||
            !province.trim() || !city.trim() || !place.trim() || !address.trim()) {
            return window.toastify("Please fill all required fields!", "warning");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return window.toastify("Please enter a valid email address", "warning");
        }

        setShowGuestShippingForm(false);
        window.toastify("Shipping details saved!", "success");
        setShowCheckoutModal(true);
    }

    const handleTransactionSSChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return window.toastify("File too large (max 5MB)", "error")
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            window.toastify("Only PNG, JPEG, and WEBP images are allowed", "error");
            e.target.value = "";
            setTransactionSS(null);
            setTransactionSSPreview(null);
            return;
        }

        setTransactionSS(file);

        const reader = new FileReader();
        reader.onloadend = () => setTransactionSSPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handlePlaceOrder = () => {
        if (placingOrder) return;

        if (!selectedPaymentMethod.trim()) {
            return window.toastify("Please select a payment method!", "warning");
        }

        if (selectedPaymentMethod === "online" && !transactionID) {
            return window.toastify("Please enter transaction id!", "warning");
        }

        if (selectedPaymentMethod === "online" && !transactionSS) {
            return window.toastify("Please upload payment proof!", "warning");
        }

        let shippingDetails = {};

        if (isAuthenticated) {
            shippingDetails = {
                fullName: user.username,
                email: user.email,
                province: user.province || "",
                city: user.city || "",
                place: user.place || "",
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
                userID: user._id
            }
        } else {
            shippingDetails = {
                ...guestShippingDetails,
                userID: null
            }
        }

        const formData = new FormData()

        formData.append("userID", shippingDetails.userID || "guest")
        formData.append("isGuestOrder", !isAuthenticated.toString())
        formData.append("sellerID", settings.sellerID)
        formData.append("totalAmount", amount)
        if (appliedCoupon) {
            formData.append("coupon", appliedCoupon.code)
            formData.append("discountAmount", discount)
        }
        formData.append("deliveryCharges", deliveryCharges)
        formData.append("finalAmount", netPayable)
        formData.append("shippingDetails", JSON.stringify(shippingDetails))
        formData.append("products", JSON.stringify(cart))
        formData.append("paymentMethod", selectedPaymentMethod)
        if (selectedPaymentMethod === "online") {
            formData.append("gateway", selectedGateway)
            formData.append("transactionID", transactionID)
            formData.append("transactionSS", transactionSS)
        }
        formData.append("paymentStatus", selectedPaymentMethod === "cod" ? "pending" : "processing")
        formData.append("isGuestOrder", !isAuthenticated)

        setPlacingOrder(true);
        axios.post(`${import.meta.env.VITE_HOST}/platform/order/place-order`, formData)
            .then(res => {
                if (res.status === 201) {
                    const { orderID } = res.data;

                    if (isAuthenticated) {
                        dispatch({ type: "UPDATE_CART", payload: { cart: [] } });
                    } else {
                        // Clear guest cart
                        dispatch({ type: "UPDATE_GUEST_CART", payload: { cart: [] } });
                        localStorage.removeItem("guest_cart");
                    }

                    setCart([]);

                    setShowCheckoutModal(false);
                    setTransactionSSPreview(null);
                    setTransactionSS(null);
                    setSelectedPaymentMethod("");
                    setSelectedGateway(null);
                    setTransactionID(null);
                    setCouponCode("");
                    setAppliedCoupon(null);
                    setDiscount(0);
                    setGuestShippingDetails({
                        fullName: "",
                        email: "",
                        phoneNumber: "",
                        province: "",
                        city: "",
                        place: "",
                        address: ""
                    });

                    window.toastify("Order placed successfully!", "success");
                }
            })
            .catch(err => {
                console.error("Order placement error:", err);
                window.toastify(err.response?.data?.message || "Order placement failed!", "error");
            })
            .finally(() => setPlacingOrder(false));
    }

    if (loading) return <Loader />

    return (
        <div>
            <section className="relative py-12">
                <div className="main-container grid grid-cols-1 lg:grid-cols-3 gap-8 items-start p-4">
                    {/* Cart */}
                    <div className="lg:col-span-2 bg-white p-6 border border-gray-200 rounded-3xl">
                        <h1 className="head text-xl font-bold border-b border-gray-200 mb-6 pb-4 text-[var(--text)]">
                            Your Shopping Bag
                            {!isAuthenticated && <span className="text-sm font-normal text-gray-500 ml-2">(Guest)</span>}
                        </h1>

                        {!isAuthenticated && cart.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    You are shopping as a guest. You can checkout without creating an account.
                                    <button
                                        className="ml-2 text-blue-600 underline font-semibold hover:text-blue-800"
                                        onClick={() => navigate(`/brand/${settings?.brandSlug}/auth?redirect=/cart`)}
                                    >
                                        Login
                                    </button> if you have an account.
                                </p>
                            </div>
                        )}

                        <ul>
                            {
                                cart.length > 0 ?
                                    cart.map((item) => {
                                        const imageUrl = item.variantImageURL || item.mainImageURL;
                                        return (
                                            <li key={getCartItemKey(item)} className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-200 py-4">
                                                <a href={`/brand/${settings?.brandSlug}/product/${item.slug}`} target='_blank' rel="noreferrer">
                                                    <img src={`${imageUrl}`} alt={item.title} className="w-24 h-24 p-4 object-contain bg-gray-100 cursor-pointer rounded-full" />
                                                </a>

                                                <div className="flex-1">
                                                    <a
                                                        href={`/brand/${settings?.brandSlug}/product/${item.slug}`}
                                                        target='_blank'
                                                        rel="noreferrer"
                                                        className="w-fit transition-all duration-200 ease-linear cursor-pointer hover:text-[var(--pr)]"
                                                    >
                                                        {item.title}
                                                    </a>

                                                    {/* Display variant options */}
                                                    {renderVariantOptions(item)}

                                                    <div className='flex items-center gap-2'>
                                                        <p className="text-sm font-semibold mt-2">
                                                            {settings?.content?.currency} {item.price.toLocaleString()}
                                                        </p>
                                                        <div className='flex gap-6 mt-2'>
                                                            {item.comparedPrice > item.price && (
                                                                <p className="text-xs text-gray-500 line-through">
                                                                    {settings?.content?.currency} {item.comparedPrice.toLocaleString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex flex-col gap-4 md:items-end items-center'>
                                                    <button className='text-sm mr-2 hover:opacity-70' onClick={() => handleRemoveFromCart(item)}>
                                                        <FaTrash className='text-red-500' />
                                                    </button>
                                                    <div className="flex items-center gap-4">
                                                        <button className="h-7 w-7 items-center flex justify-center border border-gray-300 rounded-full transition-all duration-100 ease-linear hover:bg-[#000] hover:text-white hover:border-none"
                                                            disabled={updatingCart}
                                                            onClick={() => handleUpdateQuantity(item, "decrement")}
                                                        >
                                                            -
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button className="h-7 w-7 items-center flex justify-center border border-gray-300 rounded-full transition-all duration-100 ease-linear hover:bg-[#000] hover:text-white hover:border-none"
                                                            disabled={updatingCart}
                                                            onClick={() => handleUpdateQuantity(item, "increment")}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                    :
                                    <div className='flex flex-col justify-center items-center'>
                                        <p>No item found in your cart</p>
                                        <button className='text-sm bg-black text-white rounded-lg px-4 py-2 mt-4 hover:bg-black/80' onClick={() => navigate(`/brand/${settings?.brandSlug}/pages/products`)}>Continue Shopping</button>
                                    </div>
                            }
                        </ul>
                    </div>

                    <div className='w-full lg:max-w-[400px] flex flex-col gap-6'>
                        {/* Only show Shipping Information section for logged-in users */}
                        {isAuthenticated && (
                            <div className="border border-gray-200 p-6 rounded-3xl flex flex-col">
                                <h1 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
                                    Shipping Details
                                </h1>
                                <div className="space-y-1 mt-4">
                                    {(!user.phoneNumber || !user.address) && (
                                        <p className='flex justify-center items-center gap-1 text-xs p-1 bg-amber-100 text-amber-600 rounded-md mb-4'>
                                            ⓘ Please complete your shipping details to checkout
                                        </p>
                                    )}

                                    <p className="text-gray-800 text-sm"><span className='font-bold'>Username:</span> {user?.username}</p>
                                    <p className="text-gray-800 text-sm"><span className='font-bold'>Email:</span> {user?.email}</p>
                                    <p className="text-gray-800 text-sm">
                                        <span className='font-bold'>Contact:</span>{" "}
                                        {user?.phoneNumber || (
                                            <button className="text-sm text-blue-600 underline" onClick={() => navigate(`${isCustomDomain ? '/customer/address' : `/brand/${settings?.brandSlug}/customer/address`}`)}>
                                                Add phone number
                                            </button>
                                        )}
                                    </p>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        <span className='font-bold'>Address:</span>{" "}
                                        {user.address ? (
                                            `${user.address}, ${user.place}, ${user.city}, ${user.province}`
                                        ) : (
                                                <button className="text-sm text-blue-600 underline" onClick={() => navigate(`${isCustomDomain ? '/customer/address' : `/brand/${settings?.brandSlug}/customer/address`}`)}>
                                                Add address details
                                            </button>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Checkout */}
                        <div className="border border-gray-200 p-6 rounded-3xl flex flex-col">
                            <h1 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
                                Summary
                            </h1>

                            {/* Coupon */}
                            <div>
                                <div className="mt-5 flex justify-between items-center">
                                    <h5 className="text-sm font-medium text-gray-800">Promotional coupons</h5>
                                    <a href={`/brand/${settings?.brandSlug}/coupons`} target='_blank' rel="noreferrer" className="underline text-sm text-gray-800 cursor-pointer hover:text-gray-600">
                                        View
                                    </a>
                                </div>
                                <div className="flex mt-3 border border-gray-300 rounded-md">
                                    <input type="text" placeholder="Enter coupon code" value={couponCode} className="flex-1 px-3 py-2 text-sm outline-none" onChange={(e) => setCouponCode(e.target.value)} />
                                    <button className="px-5 py-2 text-sm font-semibold text-gray-800 border-l border-gray-300 hover:bg-gray-100"
                                        onClick={handleApplyCoupon}
                                    >
                                        Apply
                                    </button>
                                </div>

                                {appliedCoupon && (
                                    <div className="mt-2 flex justify-between items-center text-green-600 text-sm">
                                        <span>
                                            {appliedCoupon.code} ({appliedCoupon.type === "percentage"
                                                ? `${appliedCoupon.value}%`
                                                : `${settings.content.currency}${appliedCoupon.value}`
                                            }) applied
                                        </span>
                                        <button
                                            className="text-red-500 text-xs underline"
                                            onClick={() => {
                                                setAppliedCoupon(null);
                                                setDiscount(0);
                                                setCouponCode("");
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Calculated Amounts */}
                            <div>
                                <div className="mt-6 flex justify-between items-center">
                                    <h5 className="text-sm text-gray-600">Amount</h5>
                                    <span className="font-semibold text-gray-800">
                                        {settings.content.currency} {amount.toLocaleString()}
                                    </span>
                                </div>
                                {
                                    totalWeight > 0 && <div className="mt-3 flex justify-between items-center">
                                        <h5 className="text-sm text-gray-600">Total Weight</h5>
                                        <span className="font-semibold text-gray-800">{totalWeight.toFixed(2)} kg</span>
                                    </div>
                                }
                                <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
                                    <h5 className="text-sm text-green-500">Delivery Charges</h5>
                                    <span className="font-semibold text-green-500">
                                        {settings.content.currency} {deliveryCharges.toLocaleString()}
                                    </span>
                                </div>
                                {
                                    discount > 0 &&
                                    <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
                                        <h5 className="text-sm text-green-600">Discount</h5>
                                        <span className="font-semibold text-green-600">
                                            -{settings.content.currency} {discount.toLocaleString()}
                                        </span>
                                    </div>
                                }
                                <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
                                    <h5 className="text-sm text-gray-600">Net Payable</h5>
                                    <span className="font-semibold text-gray-800">
                                        {settings.content.currency} {netPayable.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="bg-black text-white font-semibold py-3 w-full rounded-md mt-6 hover:opacity-80 transition-all ease-linear disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                            >
                                {isAuthenticated ? "Checkout" : "Guest Checkout"}
                            </button>
                            <button className="text-center underline text-gray-800 hover:text-[var(--pr)] text-sm font-bold mt-4" onClick={() => navigate(`/brand/${settings?.brandSlug}/products`)}>
                                Continue Shopping
                            </button>
                            {!isAuthenticated && (
                                <p className="text-xs text-gray-500 mt-4 text-center">
                                    By continuing as guest, you agree to our terms and conditions
                                </p>
                            )}
                            <p className="flex items-start gap-2 text-sm text-gray-500 mt-6">
                                <FaShieldAlt className="text-lg flex-shrink-0" />
                                Safe and secure payments easy returns 100% authentic products
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guest Shipping Form Modal */}
            {showGuestShippingForm && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Shipping Details</h2>
                                <button
                                    onClick={() => setShowGuestShippingForm(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    &times;
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-6">
                                Please provide your shipping details to proceed with checkout.
                            </p>

                            <form onSubmit={handleGuestShippingSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestShippingDetails.fullName}
                                            onChange={(e) => setGuestShippingDetails(prev => ({ ...prev, fullName: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your full name"
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={guestShippingDetails.email}
                                            onChange={(e) => setGuestShippingDetails(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={guestShippingDetails.phoneNumber}
                                            onChange={(e) => setGuestShippingDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Province *
                                            </label>
                                            <input
                                                type="text"
                                                value={guestShippingDetails.province}
                                                onChange={(e) => setGuestShippingDetails(prev => ({ ...prev, province: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Province"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                value={guestShippingDetails.city}
                                                onChange={(e) => setGuestShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="City"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Area/Place *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestShippingDetails.place}
                                            onChange={(e) => setGuestShippingDetails(prev => ({ ...prev, place: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your area/place"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Complete Address *
                                        </label>
                                        <textarea
                                            value={guestShippingDetails.address}
                                            onChange={(e) => setGuestShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-3 py-2 resize-none border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="House #, Street, Landmark, etc."
                                            rows="3"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setShowGuestShippingForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:opacity-90 transition-opacity"
                                    >
                                        Continue to Checkout
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {(showCheckoutModal && (isAuthenticated || guestShippingDetails.fullName)) && (
                <Checkout
                    user={isAuthenticated ? user : guestShippingDetails}
                    isGuest={!isAuthenticated}
                    settings={settings}
                    cart={cart}
                    amount={amount}
                    deliveryCharges={deliveryCharges}
                    totalWeight={totalWeight}
                    netPayable={netPayable}
                    appliedCoupon={appliedCoupon}
                    discount={discount}
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    selectedGateway={selectedGateway}
                    setSelectedGateway={setSelectedGateway}
                    transactionID={transactionID}
                    setTransactionID={setTransactionID}
                    handleTransactionSSChange={handleTransactionSSChange}
                    transactionSSPreview={transactionSSPreview}
                    showCheckoutModal={showCheckoutModal}
                    setShowCheckoutModal={setShowCheckoutModal}
                    handlePlaceOrder={handlePlaceOrder}
                    placingOrder={placingOrder}
                />
            )}
        </div>
    )
}

// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuthContext } from '../../../contexts/AuthContext'
// import { FaInfo, FaMapMarkerAlt, FaShieldAlt, FaTrash } from 'react-icons/fa'
// import Loader from '../../../components/Loader'
// import axios from 'axios'
// import Checkout from '../../../components/Checkout'

// export default function Cart({ settings }) {
//     const { user, isAuthenticated, dispatch } = useAuthContext()
//     const [cart, setCart] = useState([])
//     const [couponCode, setCouponCode] = useState("");
//     const [appliedCoupon, setAppliedCoupon] = useState(null);
//     const [discount, setDiscount] = useState(0);
//     const [updatingCart, setUpdatingCart] = useState(false)
//     const [showCheckoutModal, setShowCheckoutModal] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const navigate = useNavigate()

//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
//     const [selectedGateway, setSelectedGateway] = useState(null)
//     const [transactionID, setTransactionID] = useState(null)
//     const [transactionSS, setTransactionSS] = useState(null)
//     const [transactionSSPreview, setTransactionSSPreview] = useState(null)
//     const [placingOrder, setPlacingOrder] = useState(false)

//     useEffect(() => {
//         if (!user._id) return
//         setCart(user?.cart || [])
//     }, [user._id, isAuthenticated])

//     useEffect(() => {
//         if (cart.length === 0 && appliedCoupon) {
//             setAppliedCoupon(null);
//             setDiscount(0);
//         }
//     }, [cart]);

//     const handleUpdateQuantity = async (item, action) => {
//         setUpdatingCart(true)

//         const { productID, variantID } = item;

//         const updatedCart = cart.map(cartItem => {
//             if (
//                 cartItem.productID === productID &&
//                 cartItem.variantID === variantID
//             ) {
//                 let newQuantity = cartItem.quantity;

//                 if (action === "increment") {
//                     if (cartItem.quantity < cartItem.stock) {
//                         newQuantity = cartItem.quantity + 1;
//                     } else {
//                         window.toastify(`Only ${cartItem.stock} item(s) available in stock`, "info");
//                     }
//                 } else if (action === "decrement") {
//                     newQuantity = Math.max(1, cartItem.quantity - 1);
//                 }

//                 return { ...cartItem, quantity: newQuantity };
//             }
//             return cartItem;
//         })

//         setCart(updatedCart);

//         try {
//             const res = await axios.patch(`${import.meta.env.VITE_HOST}/platform/cart/update-quantity`, {
//                 userID: user?._id, productID, variantID, action,
//             });

//             if (res.status === 200) {
//                 dispatch({ type: "UPDATE_CART", payload: { cart: res.data.cart } });
//             }
//         } catch (err) {
//             console.error("Quantity update failed:", err.message);
//         } finally {
//             setUpdatingCart(false)
//         }
//     };

//     const handleRemoveFromCart = (item) => {
//         const { productID, variantID } = item;

//         const updatedCart = cart.filter(
//             cartItem =>
//                 !(
//                     cartItem.productID === productID &&
//                     cartItem.variantID === variantID
//                 )
//         );
//         setCart(updatedCart)

//         setLoading(true);
//         axios.delete(`${import.meta.env.VITE_HOST}/platform/cart/remove-from-cart`, {
//             params: { userID: user?._id, productID, variantID },
//         })
//             .then(res => {
//                 const { status, data } = res
//                 if (status === 203) {
//                     window.toastify(data.message, "success")
//                     dispatch({ type: "UPDATE_CART", payload: { cart: updatedCart } });
//                 }
//             })
//             .catch(err => console.error('Frontend DELETE error', err.message))
//             .finally(() => setLoading(false))
//     }

//     const getCartItemKey = (item) => `${item.productID}-${item.variantID || 'no-variant'}`

//     const renderVariantOptions = (item) => {
//         if (!item.selectedOptions || item.selectedOptions.length === 0) return null;

//         return (
//             <div className='flex items-center gap-2 mt-1 flex-wrap'>
//                 {item.selectedOptions.map((option, idx) => (
//                     <p key={idx} className='text-[10px] text-gray-900 bg-gray-100 px-1 py-0.5 rounded border border-gray-200'>
//                         <span className='font-bold'>{option.optionName}:</span> {option.optionValue}
//                     </p>
//                 ))}
//             </div>
//         )
//     }

//     // Calculation 

//     const amount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

//     const totalWeight = cart.reduce((acc, item) => {
//         if (!item.weight) return acc;

//         let weightKg = 0;
//         const unit = item.weightUnit?.toLowerCase() || "kg";

//         switch (unit) {
//             case "g":
//                 weightKg = item.weight / 1000;
//                 break;
//             case "lb":
//                 weightKg = item.weight * 0.453592;
//                 break;
//             default:
//                 weightKg = item.weight;
//         }

//         return acc + weightKg * item.quantity;
//     }, 0);

//     let deliveryCharges = 0

//     if (settings.deliveryCharges?.amount) {
//         deliveryCharges = cart.length * settings.deliveryCharges.amount
//     }

//     if (settings.deliveryCharges?.byWeight) {
//         deliveryCharges = totalWeight * settings.deliveryCharges.byWeight
//     }

//     if (settings.deliveryCharges?.freeDeliveryAbove && amount >= settings.deliveryCharges?.freeDeliveryAbove) {
//         deliveryCharges = 0
//     }

//     const netPayable = amount + deliveryCharges - discount;

//     // Apply Coupon
//     const handleApplyCoupon = async () => {
//         if (!couponCode.trim()) return window.toastify("Enter a coupon code", "info");

//         try {
//             const res = await axios.post(`${import.meta.env.VITE_HOST}/platform/coupons/verify-coupon`, {
//                 sellerID: settings?.sellerID,
//                 code: couponCode.trim(), amount
//             });

//             const { coupon } = res.data;

//             if (coupon.minOrderValue && amount < coupon.minOrderValue) {
//                 return window.toastify(`Minimum order value is ${settings.content.currency}${coupon.minOrderValue.toLocaleString()} to use this coupon`, "info");
//             }

//             setAppliedCoupon(coupon);

//             let discountAmount = 0;
//             if (coupon.type === "percentage") {
//                 discountAmount = (amount * coupon.value) / 100;
//             } else if (coupon.type === "fixed") {
//                 discountAmount = coupon.value * cart.length;
//             }

//             if (discountAmount > amount) discountAmount = amount;

//             setDiscount(discountAmount);
//             window.toastify(`Coupon applied! You saved ${settings.content.currency} ${discountAmount.toLocaleString()}`, "success");
//         } catch (err) {
//             console.error("Apply coupon error:", err);
//             window.toastify(err.response?.data?.message || "Invalid coupon", "error");
//             setAppliedCoupon(null);
//             setDiscount(0);
//         }
//     };

//     const handleCheckout = () => {
//         if (cart.length === 0) return

//         if ([user.phoneNumber, user.address, user.city, user.place, user.province].some(v => !v?.trim())) {
//             return window.toastify("Please complete your shipping details!", "warning");
//         }

//         setShowCheckoutModal(true)
//     }

//     const handleTransactionSSChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (file.size > 5 * 1024 * 1024) {
//             return toastify("File too large (max 5MB)", "error")
//         }

//         const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

//         if (!allowedTypes.includes(file.type)) {
//             window.toastify("Only PNG, JPEG, and WEBP images are allowed", "error");
//             e.target.value = "";
//             setTransactionSS(null);
//             setTransactionSSPreview(null);
//             return;
//         }

//         setTransactionSS(file);

//         const reader = new FileReader();
//         reader.onloadend = () => setTransactionSSPreview(reader.result);
//         reader.readAsDataURL(file);
//     };

//     const handlePlaceOrder = () => {
//         if (placingOrder) return;

//         if (!selectedPaymentMethod.trim()) {
//             return window.toastify("Please select a payment method!", "warning");
//         }

//         if (selectedPaymentMethod === "online" && !transactionID) {
//             return window.toastify("Please enter transaction id!", "warning");
//         }

//         if (selectedPaymentMethod === "online" && !transactionSS) {
//             return window.toastify("Please upload payment proof!", "warning");
//         }

//         const shippingDetails = {
//             province: user.province || "",
//             city: user.city || "",
//             place: user.place || "",
//             address: user.address || "",
//             phoneNumber: user.phoneNumber || "",
//         }

//         const formData = new FormData()

//         formData.append("userID", user._id)
//         formData.append("sellerID", settings.sellerID)
//         formData.append("totalAmount", amount)
//         if (appliedCoupon) {
//             formData.append("coupon", appliedCoupon.code)
//             formData.append("discountAmount", discount)
//         }
//         formData.append("deliveryCharges", deliveryCharges)
//         formData.append("finalAmount", netPayable)
//         formData.append("shippingDetails", JSON.stringify(shippingDetails))
//         formData.append("products", JSON.stringify(cart))
//         formData.append("paymentMethod", selectedPaymentMethod)
//         if (selectedPaymentMethod === "online") {
//             formData.append("gateway", selectedGateway)
//             formData.append("transactionID", transactionID)
//             formData.append("transactionSS", transactionSS)
//         }
//         formData.append("paymentStatus", selectedPaymentMethod === "cod" ? "pending" : "processing")

//         setPlacingOrder(true);
//         axios.post(`${import.meta.env.VITE_HOST}/platform/order/place-order`, formData)
//             .then(res => {
//                 if (res.status === 201) {
//                     const { orderID } = res.data;
//                     dispatch({ type: "UPDATE_CART", payload: { cart: [] } });
//                     setCart([]);

//                     setShowCheckoutModal(false);
//                     setTransactionSSPreview(null);
//                     setTransactionSS(null);
//                     setSelectedPaymentMethod("");
//                     setSelectedGateway(null);
//                     setTransactionID(null);
//                     setCouponCode("");
//                     setAppliedCoupon(null);
//                     setDiscount(0);

//                     window.toastify("Order placed successfully!", "success");
//                 }
//             })
//             .catch(err => window.toastify("Order placement failed!", "error"))
//             .finally(() => setPlacingOrder(false));
//     }

//     if (loading) return <Loader />

//     return (
//         <div>
//             <section className="relative py-12">
//                 <div className="main-container grid grid-cols-1 lg:grid-cols-3 gap-8 items-start p-4">
//                     <div className="lg:col-span-2 bg-white p-6 border border-gray-200 rounded-3xl">
//                         <h1 className="head text-xl font-bold border-b border-gray-200 mb-6 pb-4 text-[var(--text)]">Your Shopping Bag</h1>
//                         <ul>
//                             {
//                                 cart.length > 0 ?
//                                     cart.map((item) => {
//                                         const imageUrl = item.variantImageURL || item.mainImageURL;
//                                         return (
//                                             <li key={getCartItemKey(item)} className="flex  flex-col md:flex-row items-center gap-8 border-b border-gray-200 py-4" >
//                                                 <a href={`/brand/${settings?.brandSlug}/product/${item.slug}`} target='_blank'>
//                                                     <img src={`${import.meta.env.VITE_HOST}${imageUrl}`} alt={item.title} className="w-24 h-24 p-4 object-contain bg-gray-100 cursor-pointer rounded-full" />
//                                                 </a>

//                                                 <div className="flex-1">
//                                                     <a
//                                                         href={`/brand/${settings?.brandSlug}/product/${item.slug}`}
//                                                         target='_blank'
//                                                         className="w-fit transition-all duration-200 ease-linear cursor-pointer hover:text-[var(--pr)]"
//                                                     >
//                                                         {item.title}
//                                                     </a>

//                                                     {renderVariantOptions(item)}

//                                                     <div className='flex items-center gap-2'>
//                                                         <p className="text-sm font-semibold mt-2">
//                                                             {settings?.content?.currency} {item.price.toLocaleString()}
//                                                         </p>
//                                                         <div className='flex gap-6 mt-2'>
//                                                             {item.comparedPrice > item.price && (
//                                                                 <p className="text-xs text-gray-500 line-through">
//                                                                     {settings?.content?.currency} {item.comparedPrice.toLocaleString()}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className='flex flex-col gap-4 md:items-end items-center'>
//                                                     <button className='text-sm mr-2 hover:opacity-70' onClick={() => handleRemoveFromCart(item)}>
//                                                         <FaTrash className='text-red-500' />
//                                                     </button>
//                                                     <div className="flex items-center gap-4">
//                                                         <button className="h-7 w-7 items-center flex justify-center border border-gray-300 rounded-full transition-all duration-100 ease-linear hover:bg-[#000] hover:text-white hover:border-none"
//                                                             disabled={updatingCart}
//                                                             onClick={() => handleUpdateQuantity(item, "decrement")}
//                                                         >
//                                                             -
//                                                         </button>
//                                                         <span>{item.quantity}</span>
//                                                         <button className="h-7 w-7 items-center flex justify-center border border-gray-300 rounded-full transition-all duration-100 ease-linear hover:bg-[#000] hover:text-white hover:border-none"
//                                                             disabled={updatingCart}
//                                                             onClick={() => handleUpdateQuantity(item, "increment")}
//                                                         >
//                                                             +
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </li>
//                                         )
//                                     })
//                                     :
//                                     <div className='flex flex-col justify-center items-center'>
//                                         <p>No item found in your cart</p>
//                                         <button className='text-sm bg-black text-white rounded-lg px-4 py-2 mt-4 hover:bg-black/80' onClick={() => navigate(`/brand/${settings?.brandSlug}/products`)}>Continue Shopping</button>
//                                     </div>
//                             }
//                         </ul>
//                     </div>

//                     <div className='w-full lg:max-w-[400px] flex flex-col gap-6'>
//                         <div className="border border-gray-200 p-6 rounded-3xl flex flex-col">
//                             <h1 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
//                                 Shipping Details
//                             </h1>
//                             <div className="space-y-1 mt-4">
//                                 {!user.phoneNumber || !user.address &&
//                                     <p className='flex justify-center items-center gap-1 text-xs p-1 bg-amber-100 text-amber-600  rounded-md mb-4'><FaInfo /> Please fill information to make order</p>
//                                 }

//                                 <div className="flex items-center gap-1 flex-wrap mb-2">
//                                     <FaMapMarkerAlt className="text-gray-600 text-lg" />
//                                     <span className="text-xs font-semibold text-gray-800 capitalize">{user?.place}</span>
//                                     <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 ml-2 rounded">
//                                         Default
//                                     </span>
//                                 </div>
//                                 <p className="text-gray-800 text-sm"><span className='font-bold'>Username:</span> {user?.username}</p>
//                                 <p className="text-gray-800 text-sm"><span className='font-bold'>Email:</span> {user?.email}</p>
//                                 {
//                                     user?.phoneNumber
//                                         ? <p className="text-gray-800 text-sm"><span className='font-bold'>Contact:</span> {user?.phoneNumber}</p>
//                                         : <button className="text-sm text-blue-600 underline" onClick={() => navigate("/user/profile")}>Add phone number</button>
//                                 }
//                                 <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
//                                     <p className="text-gray-800 text-sm leading-relaxed flex-1">
//                                         <span className='font-bold'>Address:</span> {" "}
//                                         {
//                                             !user.address
//                                                 ? <button className="text-sm text-blue-600 underline" onClick={() => navigate("/user/address")}>Add address details</button>
//                                                 : `${user.address}, ${user.province}, ${user.city}`
//                                         }
//                                     </p>
//                                 </div>
//                             </div>

//                         </div>

//                         <div className="border border-gray-200 p-6 rounded-3xl flex flex-col">
//                             <h1 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
//                                 Summary
//                             </h1>

//                             <div>
//                                 <div className="mt-5 flex justify-between items-center">
//                                     <h5 className="text-sm font-medium text-gray-800">Promotional coupons</h5>
//                                     <a href={`/brand/${settings?.brandSlug}/coupons`} target='_blank' className="underline text-sm text-gray-800 cursor-pointer hover:text-gray-600">
//                                         View
//                                     </a>
//                                 </div>
//                                 <div className="flex mt-3 border border-gray-300 rounded-md">
//                                     <input type="text" placeholder="Enter coupon code" value={couponCode} className="flex-1 px-3 py-2 text-sm outline-none" onChange={(e) => setCouponCode(e.target.value)} />
//                                     <button className="px-5 py-2 text-sm font-semibold text-gray-800 border-l border-gray-300 hover:bg-gray-100"
//                                         onClick={handleApplyCoupon}
//                                     >
//                                         Apply
//                                     </button>
//                                 </div>

//                                 {appliedCoupon && (
//                                     <div className="mt-2 flex justify-between items-center text-green-600 text-sm">
//                                         <span>
//                                             {appliedCoupon.code} ({appliedCoupon.type === "percentage"
//                                                 ? `${appliedCoupon.value}%`
//                                                 : `${settings.content.currency}${appliedCoupon.value}`
//                                             }) applied
//                                         </span>
//                                         <button
//                                             className="text-red-500 text-xs underline"
//                                             onClick={() => {
//                                                 setAppliedCoupon(null);
//                                                 setDiscount(0);
//                                                 setCouponCode("");
//                                             }}
//                                         >
//                                             Remove
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>

//                             <div>
//                                 <div className="mt-6 flex justify-between items-center">
//                                     <h5 className="text-sm text-gray-600">Amount</h5>
//                                     <span className="font-semibold text-gray-800">
//                                         {settings.content.currency} {amount.toLocaleString()}
//                                     </span>
//                                 </div>
//                                 {
//                                     totalWeight > 0 && <div className="mt-3 flex justify-between items-center">
//                                         <h5 className="text-sm text-gray-600">Total Weight</h5>
//                                         <span className="font-semibold text-gray-800">{totalWeight.toFixed(2)} kg</span>
//                                     </div>
//                                 }
//                                 <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
//                                     <h5 className="text-sm text-green-500">Delivery Charges</h5>
//                                     <span className="font-semibold text-green-500">
//                                         {settings.content.currency} {deliveryCharges.toLocaleString()}
//                                     </span>
//                                 </div>
//                                 {
//                                     discount > 0 &&
//                                     <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
//                                         <h5 className="text-sm text-green-600">Discount</h5>
//                                         <span className="font-semibold text-green-600">
//                                             -{settings.content.currency} {discount.toLocaleString()}
//                                         </span>
//                                     </div>
//                                 }
//                                 <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
//                                     <h5 className="text-sm text-gray-600">Net Payable</h5>
//                                     <span className="font-semibold text-gray-800">
//                                         {settings.content.currency} {netPayable.toLocaleString()}
//                                     </span>
//                                 </div>
//                             </div>

//                             <button className="bg-black text-white font-semibold py-3 w-full rounded-md mt-6 hover:opacity-80 transition-all ease-linear"
//                                 onClick={handleCheckout}
//                             >
//                                 Checkout
//                             </button>
//                             <button className="text-center underline text-gray-800 hover:text-[var(--pr)] text-sm font-bold mt-4" onClick={() => navigate(`/brand/${settings?.brandSlug}/products`)}>
//                                 Continue Shopping
//                             </button>
//                             <p className="flex items-start gap-2 text-sm text-gray-500 mt-6">
//                                 <FaShieldAlt className="text-lg flex-shrink-0" />
//                                 Safe and secure payments easy returns 100% authentic products
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <Checkout user={user} settings={settings} cart={cart} amount={amount} deliveryCharges={deliveryCharges}
//                 totalWeight={totalWeight} netPayable={netPayable} appliedCoupon={appliedCoupon} discount={discount}
//                 selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod}
//                 selectedGateway={selectedGateway} setSelectedGateway={setSelectedGateway}
//                 transactionID={transactionID} setTransactionID={setTransactionID}
//                 handleTransactionSSChange={handleTransactionSSChange} transactionSSPreview={transactionSSPreview}
//                 showCheckoutModal={showCheckoutModal} setShowCheckoutModal={setShowCheckoutModal}
//                 handlePlaceOrder={handlePlaceOrder} placingOrder={placingOrder}
//             />
//         </div>
//     )
// }