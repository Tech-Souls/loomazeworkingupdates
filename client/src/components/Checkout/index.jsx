import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { FaShieldAlt } from 'react-icons/fa'
import ButtonLoader from '../ButtonLoader'

export default function Checkout({
    user, settings, cart, amount, deliveryCharges, totalWeight, netPayable, appliedCoupon, discount,
    selectedPaymentMethod, selectedGateway, setSelectedGateway, transactionID, setTransactionID, handleTransactionSSChange, transactionSSPreview,
    setSelectedPaymentMethod, showCheckoutModal, setShowCheckoutModal, handlePlaceOrder, placingOrder,
    isGuest = false // Add this prop to identify guest users
}) {
    const navigate = useNavigate()

    const getCartItemKey = (item) => `${item.productID}-${item.variantID || 'no-variant'}`

    const renderVariantOptions = (item) => {
        if (!item.selectedOptions || item.selectedOptions.length === 0) return null;

        return (
            <div className='flex items-center gap-1 mt-1 flex-wrap'>
                {item.selectedOptions.map((option, idx) => (
                    <span key={idx} className='text-[9px] text-gray-700 bg-gray-100 px-1 py-0.5 rounded'>
                        {option.optionName}: {option.optionValue}
                    </span>
                ))}
            </div>
        )
    }

    return (
        <div className={`fixed inset-0 bg-black/50 p-6 z-99 transition-all duration-500 ease-out ${showCheckoutModal ? "visible opacity-100" : "invisible opacity-0"}`}>
            <div className={`w-full h-full bg-white p-8 rounded-3xl overflow-y-auto transition-all duration-500 ease-out ${showCheckoutModal ? "translate-y-0" : "translate-y-50"}`}>
                <div className='flex justify-between items-center border-b border-gray-300 pb-3'>
                    <h1 className='font-bold'>Order Checkout {isGuest && <span className="text-sm font-normal text-gray-500">(Guest)</span>}</h1>
                    <X size={18} className='cursor-pointer hover:text-red-500' onClick={() => setShowCheckoutModal(false)} />
                </div>

                <div className='flex gap-10 mt-6'>
                    <div className='space-y-6 flex-1'>
                        <div>
                            <h1 className='head text-base mb-2'>Contact Details</h1>
                            <div className='flex justify-between gap-4 flex-wrap bg-blue-50 p-3 rounded-xl'>
                                <p className='text-sm'><span className='font-bold'>{isGuest ? "Full Name" : "Username"}:</span> {user.fullName || user.username}</p>
                                <p className='text-sm'><span className='font-bold'>Email:</span> {user.email}</p>
                                <p className='text-sm'><span className='font-bold'>Phone Number:</span> {user.phoneNumber}</p>
                            </div>
                        </div>

                        <div>
                            <h1 className='head text-base mb-2'>Shipping Details</h1>
                            <div className='flex justify-between bg-blue-50 p-3 rounded-xl'>
                                <p className='text-sm'><span className='font-bold'>Address:</span> {user.address}, {user.place}, {user.city}, {user.province}.</p>
                            </div>
                        </div>

                        <div>
                            <h1 className='head text-base mb-2'>Select Payment Method *</h1>
                            <div className='flex gap-3'>
                                {
                                    settings?.paymentModes?.cod &&
                                    <button className={`text-sm font-bold border w-fit px-4 py-2 rounded-xl transition-all duration-200 ease-out
                                        ${selectedPaymentMethod === "cod" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-800 border border-gray-200"}`}
                                        onClick={() => setSelectedPaymentMethod("cod")}
                                    >
                                        Cash On Delivery (COD)
                                    </button>
                                }
                                {
                                    settings?.paymentModes?.online.length > 0 &&
                                    <button className={`text-sm font-bold border w-fit px-4 py-2 rounded-xl transition-all duration-200 ease-out
                                        ${selectedPaymentMethod === "online" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-800 border border-gray-200"}`}
                                        onClick={() => setSelectedPaymentMethod("online")}
                                    >
                                        Online Payment
                                    </button>
                                }
                            </div>

                            {
                                selectedPaymentMethod === "online" &&
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                                    {
                                        settings.paymentModes.online.filter(mode => mode.isActive).map((method, index) => (
                                            <div
                                                key={index}
                                                className={`space-y-1 border p-4 cursor-pointer rounded-xl
                                                ${selectedGateway === method.bankName ? "text-blue-600 bg-blue-50 border-blue-200" : "text-gray-800 bg-gray-100 border-gray-200"}`}
                                                onClick={() => setSelectedGateway(method.bankName)}
                                            >
                                                <p className='text-sm'><span className='font-bold'>Bank Name:</span> {method.bankName}</p>
                                                <p className='text-sm'><span className='font-bold'>Account Name:</span> {method.accountName}</p>
                                                <p className='text-sm'><span className='font-bold'>Account Number:</span> {method.accountNumber}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            }

                            {
                                selectedPaymentMethod === "online" &&
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                    <div>
                                        <label className='text-sm font-bold'>Transaction ID:</label>
                                        <input
                                            type="text"
                                            name="transactionID"
                                            id="transactionID"
                                            value={transactionID || ""}
                                            placeholder='Enter transaction ID'
                                            className='w-full mt-2 !p-2.5 border border-gray-300'
                                            onChange={(e) => setTransactionID(e.target.value)}
                                            required={selectedPaymentMethod === "online"}
                                        />
                                    </div>
                                    <div>
                                        <label className='text-sm font-bold'>Screenshot:</label>
                                        <input
                                            type="file"
                                            name="transactionSS"
                                            id="transactionSS"
                                            className='w-full mt-2 !p-2.5 border border-gray-300'
                                            onChange={handleTransactionSSChange}
                                            required={selectedPaymentMethod === "online"}
                                        />
                                        <p className='text-xs text-gray-500 mt-1'>Upload payment proof (PNG, JPEG, WEBP, max 5MB)</p>
                                    </div>
                                </div>
                            }

                            {transactionSSPreview && (
                                <div className='mt-4'>
                                    <p className='text-sm font-bold mb-2'>Payment Proof Preview:</p>
                                    <img src={transactionSSPreview} alt="Transaction Screenshot Preview" className="w-32 h-32 object-cover rounded border" />
                                </div>
                            )}
                        </div>

                        {isGuest && (
                            <div className='bg-yellow-50 border border-yellow-200 p-4 rounded-xl'>
                                <p className='text-sm text-yellow-800'>
                                    <span className='font-bold'>Note:</span> You are placing an order as a guest.
                                    Consider <button
                                        className='text-blue-600 underline font-semibold hover:text-blue-800 ml-1'
                                        onClick={() => {
                                            setShowCheckoutModal(false);
                                            navigate(`/brand/${settings?.brandSlug}/auth?redirect=/cart`);
                                        }}
                                    >
                                        creating an account
                                    </button> to track your order easily.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='w-full max-w-[420px] p-6 border border-gray-300 rounded-3xl flex flex-col'>
                        <h1 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
                            Order Summary {isGuest && <span className="text-xs font-normal text-gray-500">(Guest)</span>}
                        </h1>

                        {/* Calculated Amounts */}
                        <div>
                            {appliedCoupon && (
                                <div className="mt-6 flex justify-center items-center bg-green-100 text-green-600 text-sm p-2 rounded-lg">
                                    <span>
                                        {appliedCoupon.code} ({appliedCoupon.type === "percentage"
                                            ? `${appliedCoupon.value}%`
                                            : `${settings.content.currency}${appliedCoupon.value}`
                                        }) coupon applied
                                    </span>
                                </div>
                            )}

                            <div className='mt-4'>
                                <h3 className='text-sm font-bold mb-2'>Items in Cart ({cart.length})</h3>
                                <div className='max-h-[200px] overflow-y-auto pr-2'>
                                    {
                                        cart.length > 0 ?
                                            cart.map((item) => {
                                                const imageUrl = item.variantImageURL || item.mainImageURL;

                                                return (
                                                    <div key={getCartItemKey(item)} className="flex items-center gap-3 border-b border-gray-200 py-3">
                                                        <a href={`/brand/${settings?.brandSlug}/product/${item.slug}`} target='_blank' rel="noreferrer">
                                                            <img
                                                                src={`${imageUrl}`}
                                                                alt={item.title}
                                                                className="w-12 h-12 p-1 object-contain bg-gray-100 cursor-pointer rounded"
                                                            />
                                                        </a>
                                                        <div className="flex-1 min-w-0">
                                                            <a
                                                                href={`/brand/${settings?.brandSlug}/product/${item.slug}`}
                                                                target='_blank'
                                                                rel="noreferrer"
                                                                className="text-xs font-bold transition-all duration-200 ease-linear cursor-pointer hover:text-[var(--pr)] truncate block"
                                                            >
                                                                {item.title}
                                                            </a>

                                                            {/* Show variant options */}
                                                            {renderVariantOptions(item)}

                                                            <div className='flex justify-between items-center mt-1'>
                                                                <p className="text-xs font-semibold">{settings?.content?.currency} {item.price.toLocaleString()}</p>
                                                                <p className="text-xs">x{item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className='flex flex-col justify-center items-center py-4'>
                                                <p className='text-sm text-gray-500'>No items in cart</p>
                                            </div>
                                    }
                                </div>
                            </div>

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
                                <h5 className="text-sm text-gray-800 font-bold">Net Payable</h5>
                                <span className="font-bold text-lg text-gray-900">
                                    {settings.content.currency} {netPayable.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            className="flex justify-center items-center bg-black text-white font-semibold py-3 w-full rounded-md mt-6 hover:opacity-80 transition-all ease-linear disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={placingOrder || !selectedPaymentMethod}
                            onClick={handlePlaceOrder}
                        >
                            {!placingOrder ? (
                                <span>
                                    {isGuest ? "Place Guest Order" : "Place Order"}
                                    {!selectedPaymentMethod && " (Select payment method)"}
                                </span>
                            ) : (
                                <span className='flex items-center gap-2'>
                                    <ButtonLoader /> {isGuest ? "Placing Guest Order..." : "Placing Order..."}
                                </span>
                            )}
                        </button>

                        <button
                            className="text-center underline text-gray-800 hover:text-[var(--pr)] text-sm font-bold mt-4"
                            onClick={() => {
                                setShowCheckoutModal(false);
                                navigate(`/brand/${settings?.brandSlug}/products`);
                            }}
                        >
                            Continue Shopping
                        </button>

                        <p className="flex items-start gap-2 text-sm text-gray-500 mt-6">
                            <FaShieldAlt className="text-lg flex-shrink-0 mt-0.5" />
                            <span>Safe and secure payments. Easy returns. 100% authentic products.</span>
                        </p>

                        {isGuest && (
                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Your order will be processed as a guest. You'll receive order confirmation via email.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { X } from 'lucide-react'
// import { FaShieldAlt } from 'react-icons/fa'
// import ButtonLoader from '../ButtonLoader'

// export default function Checkout({
//     user, settings, cart, amount, deliveryCharges, totalWeight, netPayable, appliedCoupon, discount,
//     selectedPaymentMethod, selectedGateway, setSelectedGateway, transactionID, setTransactionID, handleTransactionSSChange, transactionSSPreview,
//     setSelectedPaymentMethod, showCheckoutModal, setShowCheckoutModal, handlePlaceOrder, placingOrder
// }) {
//     const navigate = useNavigate()

//     const getCartItemKey = (item) => `${item.productID}-${item.variantID || 'no-variant'}`

//     const renderVariantOptions = (item) => {
//         if (!item.selectedOptions || item.selectedOptions.length === 0) return null;

//         return (
//             <div className='flex items-center gap-1 mt-1 flex-wrap'>
//                 {item.selectedOptions.map((option, idx) => (
//                     <span key={idx} className='text-[9px] text-gray-700 bg-gray-100 px-1 py-0.5 rounded'>
//                         {option.optionName}: {option.optionValue}
//                     </span>
//                 ))}
//             </div>
//         )
//     }

//     return (
//         <div className={`fixed inset-0 bg-black/50 p-6 z-99 transition-all duration-500 ease-out ${showCheckoutModal ? "visible opacity-100" : "invisible opacity-0"}`}>
//             <div className={`w-full h-full bg-white p-8 rounded-3xl overflow-y-auto transition-all duration-500 ease-out ${showCheckoutModal ? "translate-y-0" : "translate-y-50"}`}>
//                 <div className='flex justify-between items-center border-b border-gray-300 pb-3'>
//                     <h1 className='font-bold'>Order Checkout</h1>
//                     <X size={18} className='cursor-pointer hover:text-red-500' onClick={() => setShowCheckoutModal(false)} />
//                 </div>

//                 <div className='flex gap-10 mt-6'>
//                     <div className='space-y-6 flex-1'>
//                         <div>
//                             <h1 className='head text-base mb-2'>Contact Details</h1>
//                             <div className='flex justify-between gap-4 flex-wrap bg-blue-50 p-3 rounded-xl'>
//                                 <p className='text-sm'><span className='font-bold'>Username:</span> {user.username}</p>
//                                 <p className='text-sm'><span className='font-bold'>Email:</span> {user.email}</p>
//                                 <p className='text-sm'><span className='font-bold'>Phone Number:</span> {user.phoneNumber}</p>
//                             </div>
//                         </div>

//                         <div>
//                             <h1 className='head text-base mb-2'>Shipping Details</h1>
//                             <div className='flex justify-between bg-blue-50 p-3 rounded-xl'>
//                                 <p className='text-sm'><span className='font-bold'>Address:</span> {user.address}, {user.province}, {user.city}.</p>
//                             </div>
//                         </div>

//                         <div>
//                             <h1 className='head text-base mb-2'>Select Payment Method *</h1>
//                             <div className='flex gap-3'>
//                                 {
//                                     settings?.paymentModes?.cod &&
//                                     <button className={`text-sm font-bold border w-fit px-4 py-2 rounded-xl transition-all duration-200 ease-out
//                                         ${selectedPaymentMethod === "cod" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-800 border border-gray-200"}`}
//                                         onClick={() => setSelectedPaymentMethod("cod")}
//                                     >
//                                         Cash On Delivery (COD)
//                                     </button>
//                                 }
//                                 {
//                                     settings?.paymentModes?.online.length > 0 &&
//                                     <button className={`text-sm font-bold border w-fit px-4 py-2 rounded-xl transition-all duration-200 ease-out
//                                         ${selectedPaymentMethod === "online" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-800 border border-gray-200"}`}
//                                         onClick={() => setSelectedPaymentMethod("online")}
//                                     >
//                                         Online Payment
//                                     </button>
//                                 }
//                             </div>

//                             {
//                                 selectedPaymentMethod === "online" &&
//                                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
//                                     {
//                                         settings.paymentModes.online.filter(mode => mode.isActive).map(method => (
//                                             <div className={`space-y-1 border p-4 cursor-pointer rounded-xl
//                                             ${selectedGateway === method.bankName ? "text-blue-600 bg-blue-50 border-blue-200" : "text-gray-800 bg-gray-100 border-gray-200"}`}
//                                                 onClick={() => setSelectedGateway(method.bankName)}
//                                             >
//                                                 <p className='text-sm'><span className='font-bold'>Bank Name:</span> {method.bankName}</p>
//                                                 <p className='text-sm'><span className='font-bold'>Account Name:</span> {method.accountName}</p>
//                                                 <p className='text-sm'><span className='font-bold'>Account Number:</span> {method.accountNumber}</p>
//                                             </div>
//                                         ))
//                                     }
//                                 </div>
//                             }

//                             {
//                                 selectedPaymentMethod === "online" &&
//                                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
//                                     <div>
//                                         <label className='text-sm font-bold'>Transaction ID:</label>
//                                         <input type="text" name="transactionID" id="transactionID" value={transactionID || ""} placeholder='Enter transaction ID' className='w-full mt-2 !p-2.5 border border-gray-300' onChange={(e) => setTransactionID(e.target.value)} />
//                                     </div>
//                                     <div>
//                                         <label className='text-sm font-bold'>Screenshot:</label>
//                                         <input type="file" name="transactionSS" id="transactionSS" className='w-full mt-2 !p-2.5 border border-gray-300' onChange={handleTransactionSSChange} />
//                                     </div>
//                                 </div>
//                             }

//                             {transactionSSPreview && (
//                                 <img src={transactionSSPreview} alt="Transaction Screenshot Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
//                             )}
//                         </div>
//                     </div>

//                     <div className='w-full max-w-[420px] p-6 border border-gray-300 rounded-3xl flex flex-col'>
//                         <h1 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
//                             Summary
//                         </h1>

//                         {/* Calculated Amounts */}
//                         <div>
//                             {appliedCoupon && (
//                                 <div className="mt-6 flex justify-center items-center bg-green-100 text-green-600 text-sm p-2 rounded-lg">
//                                     <span>
//                                         {appliedCoupon.code} ({appliedCoupon.type === "percentage"
//                                             ? `${appliedCoupon.value}%`
//                                             : `${settings.content.currency}${appliedCoupon.value}`
//                                         }) coupon applied
//                                     </span>
//                                 </div>
//                             )}

//                             <div>
//                                 <ul>
//                                     {
//                                         cart.length > 0 ?
//                                             cart.map((item) => {
//                                                 const imageUrl = item.variantImageURL || item.mainImageURL;

//                                                 return (
//                                                     <li key={getCartItemKey(item)} className="flex flex-col md:flex-row items-center gap-5 border-b border-gray-200 py-4">
//                                                         <a href={`/brand/${settings?.brandSlug}/product/${item.slug}`} target='_blank'>
//                                                             <img
//                                                                 src={`${import.meta.env.VITE_HOST}${imageUrl}`}
//                                                                 alt={item.title}
//                                                                 className="w-12 h-12 p-2 object-contain bg-gray-100 cursor-pointer rounded-full"
//                                                             />
//                                                         </a>
//                                                         <div className="flex-1">
//                                                             <a
//                                                                 href={`/brand/${settings?.brandSlug}/product/${item.slug}`}
//                                                                 target='_blank'
//                                                                 className="w-fit text-xs font-bold transition-all duration-200 ease-linear cursor-pointer hover:text-[var(--pr)]"
//                                                             >
//                                                                 {item.title}
//                                                             </a>

//                                                             {/* Show variant options */}
//                                                             {renderVariantOptions(item)}

//                                                             <div className='flex justify-between items-center mt-1'>
//                                                                 <p className="text-xs font-semibold">{settings?.content?.currency} {item.price.toLocaleString()}</p>
//                                                                 <p className="text-xs">x{item.quantity}</p>
//                                                             </div>
//                                                         </div>
//                                                     </li>
//                                                 )
//                                             })
//                                             :
//                                             <div className='flex flex-col justify-center items-center'>
//                                                 <p>No item found in your cart</p>
//                                                 <button className='text-sm bg-black text-white rounded-lg px-4 py-2 mt-4 hover:bg-black/80'
//                                                     onClick={() => navigate(`/brand/${settings?.brandSlug}/products`)}
//                                                 >
//                                                     Continue Shopping
//                                                 </button>
//                                             </div>
//                                     }
//                                 </ul>
//                             </div>

//                             <div className="mt-6 flex justify-between items-center">
//                                 <h5 className="text-sm text-gray-600">Amount</h5>
//                                 <span className="font-semibold text-gray-800">
//                                     {settings.content.currency} {amount.toLocaleString()}
//                                 </span>
//                             </div>
//                             {
//                                 totalWeight > 0 && <div className="mt-3 flex justify-between items-center">
//                                     <h5 className="text-sm text-gray-600">Total Weight</h5>
//                                     <span className="font-semibold text-gray-800">{totalWeight.toFixed(2)} kg</span>
//                                 </div>
//                             }
//                             <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
//                                 <h5 className="text-sm text-green-500">Delivery Charges</h5>
//                                 <span className="font-semibold text-green-500">
//                                     {settings.content.currency} {deliveryCharges.toLocaleString()}
//                                 </span>
//                             </div>
//                             {
//                                 discount > 0 &&
//                                 <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
//                                     <h5 className="text-sm text-green-600">Discount</h5>
//                                     <span className="font-semibold text-green-600">
//                                         -{settings.content.currency} {discount.toLocaleString()}
//                                     </span>
//                                 </div>
//                             }
//                             <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
//                                 <h5 className="text-sm text-gray-600">Net Payable</h5>
//                                 <span className="font-semibold text-gray-800">
//                                     {settings.content.currency} {netPayable.toLocaleString()}
//                                 </span>
//                             </div>
//                         </div>

//                         <button className="flex justify-center items-center bg-black text-white font-semibold py-3 w-full rounded-md mt-6 hover:opacity-80 transition-all ease-linear disabled:opacity-50"
//                             disabled={placingOrder}
//                             onClick={handlePlaceOrder}
//                         >
//                             {!placingOrder ? "Place Order" : <ButtonLoader />}
//                         </button>

//                         <button className="text-center underline text-gray-800 hover:text-[var(--pr)] text-sm font-bold mt-4"
//                             onClick={() => navigate(`/brand/${settings?.brandSlug}/products`)}
//                         >
//                             Continue Shopping
//                         </button>

//                         <p className="flex items-start gap-2 text-sm text-gray-500 mt-6">
//                             <FaShieldAlt className="text-lg flex-shrink-0" />
//                             Safe and secure payments easy returns 100% authentic products
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }