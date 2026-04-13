import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSellerAuthContext } from '../../../../../contexts/SellerAuthContext'
import Loader from '../../../../../components/Loader'
import ButtonLoader from '../../../../../components/ButtonLoader'
import axios from 'axios'

export default function UpdateOrder() {
    const { orderID } = useParams()
    const { user } = useSellerAuthContext()
    const [order, setOrder] = useState({})
    const [currency, setCurrency] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [transactionScreeshot, setTransactionScreenshot] = useState(null);

    console.log('order', order)

    useEffect(() => {
        if (orderID) {
            fetchOrder()
        }
    }, [orderID])

    const fetchOrder = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/update-order/fetch-order?sellerID=${user._id}&orderID=${orderID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setOrder(data.order || {});
                    setCurrency(data.currency)
                    console.log('fetch order data', data)
                    setTransactionScreenshot(data.payment?.transactionSS || null);
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleUpdateOrderStatus = () => {
        setSaving(true)
        axios.put(`${import.meta.env.VITE_HOST}/seller/update-order/update-status`, {
            sellerID: user._id, orderID, status: order.status
        })
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    window.toastify(data.message, "success")
                    setOrder(data.order || {});
                }
            })
            .catch(err => window.toastify(err.response.data.message || "Something went wrong! Please try again.", "error"))
            .finally(() => setSaving(false))
    }

    if (loading) return <Loader />

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Update Order</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Monitor, manage and control the order status here.</p>
            </div>
            
            {
                order?.paymentMethod === "online" &&
                <div className='bg-white p-4 light-shad text-gray-900 mt-4'>
                    <p className='text-sm font-bold mb-3 pb-2 border-b border-gray-200'>Payment Screenshot</p>
                    {
                        transactionScreeshot ?
                            <img src={transactionScreeshot} alt="Transaction Screenshot" className='w-full max-w-md h-auto object-contain' />
                            :
                            <p className='text-sm text-gray-500'>No screenshot available.</p>
                    }
                </div>
            }

            <div className='seller-container'>
                <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Orders / Update Order</p>

                <div className='flex flex-col gap-4 mt-6'>
                    <div className='bg-white p-4 light-shad text-gray-900'>
                        <p className='text-sm font-bold mb-3 pb-2 border-b border-gray-200'>Order Status <span className='inline-block px-1.5 py-0.5 ml-1 text-[11px] text-amber-600 bg-amber-50 font-normal'>Update the order delivery status here</span></p>
                        <div className='flex gap-4'>
                            <select name="status" id="status" value={order.status} className='text-sm w-full border border-gray-300 p-2.5'
                                onChange={(e) => setOrder(prev => ({
                                    ...prev, status: e.target.value
                                }))}>
                                <option value="" disabled>Select order status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="returned">Returned</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <button className='text-xs font-bold bg-[var(--primary)] text-white px-4 hover:bg-[var(--primary)]/70 disabled:opacity-50'
                                onClick={handleUpdateOrderStatus}
                            >
                                {!saving ? "Save" : <ButtonLoader />}
                            </button>
                        </div>
                    </div>

                    <div className='bg-white p-4 light-shad text-gray-900'>
                        <p className='text-sm font-bold mb-3 pb-2 border-b border-gray-200'>User Information</p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
                            <p><span className='font-bold'>Username:</span> {order?.userID?.username}</p>
                            <p><span className='font-bold'>Email:</span> {order?.userID?.email}</p>
                            <p><span className='font-bold'>Phone Number:</span> {order?.shippingDetails?.phoneNumber}</p>
                        </div>
                    </div>

                    <div className='bg-white p-4 light-shad text-gray-900'>
                        <p className='text-sm font-bold mb-3 pb-2 border-b border-gray-200'>Shipping Details</p>
                        <p className='text-xs inline-block px-1.5 py-0.5 bg-green-100 text-green-700 rounded-sm capitalize'>{order?.shippingDetails?.place}</p>
                        <p className='text-sm mt-2'><span className='font-bold'>Address:</span> {order?.shippingDetails?.address + ", " + order?.shippingDetails?.province + ", " + order?.shippingDetails?.city + "."}</p>
                    </div>

                    <div className='bg-white p-4 light-shad text-gray-900'>
                        <p className='text-sm font-bold mb-3 pb-2 border-b border-gray-200'>Ordered Products</p>

                        <div className="relative overflow-x-auto mt-5">
                            <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                                <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                                    <tr>
                                        <th scope="col" className="font-bold px-6 py-4">#</th>
                                        <th scope="col" className="font-bold px-6 py-4">Product ID</th>
                                        <th scope="col" className="font-bold px-6 py-4">Product</th>
                                        <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Quantity</th>
                                        <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ?
                                            <tr className='bg-white'>
                                                <td colSpan={5} className='py-20'>
                                                    <div className='flex justify-center'>
                                                        <div className='flex flex-col items-center gap-5'>
                                                            <span className='w-8 h-8 rounded-full border-t-2 border-[var(--secondary)] animate-spin'></span>
                                                            <p>Loading...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            :
                                            order?.products?.length > 0 ?
                                                order?.products?.map((product, i) => (
                                                    <tr key={product._id} className="bg-white border-b border-gray-200">
                                                        <td className="px-6 py-4">{i + 1}</td>
                                                        <td className="px-6 py-4">{product.productID}</td>
                                                        <td className="px-6 py-4">
                                                            <div className='flex items-center gap-3'>
                                                                <img src={`${product.variantImageURL || product.mainImageURL}`} alt={product.title} className='w-14 h-14 p-1 object-contain bg-gray-100 rounded-full' />
                                                                <div>
                                                                    <a href={`/brand/${product?.brandSlug}/product/${product.slug}`} target='_blank' className="w-fit text-xs font-bold transition-all duration-200 ease-linear cursor-pointer hover:text-[var(--pr)]">{product.title}</a>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                                        {Array.isArray(product?.selectedOptions) &&
                                                                            product.selectedOptions.map((opt, idx) => (
                                                                                <p
                                                                                    key={idx}
                                                                                    className="w-fit text-[10px] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-sm"
                                                                                >
                                                                                    {opt.optionName}: {opt.optionValue}
                                                                                </p>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 capitalize">
                                                            {product.quantity}
                                                        </td>
                                                        <td className="px-6 py-4 capitalize">
                                                            {currency} {product.price.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))
                                                :
                                                <tr className='bg-white'>
                                                    <td colSpan={5} className='px-6 py-4 text-center text-red-500'>No product found!</td>
                                                </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='bg-white p-4 light-shad text-gray-900'>
                        <p className='text-sm font-bold mb-3 pb-2 border-b border-gray-200'>Billing</p>

                        <div className="relative overflow-x-auto mt-5">
                            <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                                <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                                    <tr>
                                        <th scope="col" className="font-bold px-6 py-4">Total Amount</th>
                                        <th scope="col" className="font-bold px-6 py-4">Coupon Applied</th>
                                        <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Discount</th>
                                        <th scope="col" className="font-bold px-6 py-4">Delivery Charges</th>
                                        <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Net Payable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ?
                                            <tr className='bg-white'>
                                                <td colSpan={4} className='py-20'>
                                                    <div className='flex justify-center'>
                                                        <div className='flex flex-col items-center gap-5'>
                                                            <span className='w-8 h-8 rounded-full border-t-2 border-[var(--secondary)] animate-spin'></span>
                                                            <p>Loading...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            :
                                            order?.orderID > 0 ?
                                                <tr className="bg-white border-b border-gray-200">
                                                    <td className="px-6 py-4">{currency} {order.totalAmount.toLocaleString()}</td>
                                                    <td className="px-6 py-4">{order.coupon || "_"}</td>
                                                    <td className="px-6 py-4">{currency} {order.discountAmount.toLocaleString()}</td>
                                                    <td className="px-6 py-4">{currency} {order.deliveryCharges.toLocaleString()}</td>
                                                    <td className="px-6 py-4">{currency} {order.finalAmount.toLocaleString()}</td>
                                                </tr>
                                                :
                                                <tr className='bg-white'>
                                                    <td colSpan={4} className='px-6 py-4 text-center text-red-500'>No product found!</td>
                                                </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}