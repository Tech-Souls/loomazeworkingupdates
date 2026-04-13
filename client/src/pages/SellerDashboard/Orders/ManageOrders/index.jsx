import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext';
import { RxTrash } from 'react-icons/rx';
import { LuSearch } from 'react-icons/lu';
import axios from 'axios';

export default function ManageOrders() {
    const [searchParams] = useSearchParams();
    const urlPage = parseInt(searchParams.get("page")) || 1;

    const { user } = useSellerAuthContext()
    const [orders, setOrders] = useState([])
    const [page, setPage] = useState(urlPage);
    const [totalPages, setTotalPages] = useState(1);
    const [currency, setCurrency] = useState("")
    const [searchText, setSearchText] = useState("")
    const [activeSearch, setActiveSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (activeSearch) {
            fetchSearchedOrders(activeSearch, page)
        } else {
            fetchOrders(page)
        }
    }, [activeSearch, page])

    const fetchOrders = (page = 1) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/manage-orders/all?sellerID=${user._id}&page=${page}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setOrders(data?.orders || [])
                    setTotalPages(Math.ceil((data?.totalOrders || 0) / 20));
                    setCurrency(data?.currency)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const fetchSearchedOrders = (text, page = 1) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/manage-orders/search?sellerID=${user._id}&searchText=${text}&page=${page}`)
            .then(res => {
                if (res.status === 200) {
                    setOrders(res.data?.searchedOrders || [])
                    setTotalPages(Math.ceil((res.data?.totalSearchedOrders || 0) / 20));
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleSearch = () => {
        if (!searchText) return setActiveSearch("")
        setActiveSearch(searchText)
    }

    const handleDeleteOrder = (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        setLoading(true);
        axios.delete(`${import.meta.env.VITE_HOST}/seller/manage-orders/delete/${id}`)
            .then(res => {
                if (res.status === 203) {
                    window.toastify(res.data.message, "success")
                    setOrders(prev => prev.filter(order => order._id !== id));
                }
            })
            .catch(err => {
                console.error("Frontend DELETE error", err.message)
                window.toastify(err.response?.data?.message || "Failed to delete order", "error")
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Manage Orders</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Monitor, manage and control all the orders you received on your store.</p>
            </div>

            <div className='seller-container'>
                <div className='flex justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Orders / Manage Orders</p>

                    <div className='flex flex-1 justify-end items-center gap-2.5'>
                        <input type="text" name="searchText" id="searchText" value={searchText} placeholder='Search by order id' className='w-full max-w-[250px]  border border-gray-200 text-sm bg-white !px-4 !py-2 !rounded-none' onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                        <button className='flex items-center gap-1 text-sm text-white bg-[var(--secondary)] px-5 py-2 transition-all duration-150 ease-linear hover:bg-[var(--secondary)]/70' onClick={handleSearch}>Search <LuSearch /></button>
                    </div>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">Order ID</th>
                                <th scope="col" className="font-bold px-6 py-4">Items</th>
                                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Payment Method</th>
                                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Payment Status</th>
                                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Total Amount</th>
                                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Shipping Address</th>
                                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">Order Status</th>
                                <th scope="col" className="font-bold px-6 py-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                    <tr className='bg-white'>
                                        <td colSpan={7} className='py-20'>
                                            <div className='flex justify-center'>
                                                <div className='flex flex-col items-center gap-5'>
                                                    <span className='w-8 h-8 rounded-full border-t-2 border-[var(--secondary)] animate-spin'></span>
                                                    <p>Loading...</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    :
                                    orders.length > 0 ?
                                        orders.map(order => (
                                            <tr key={order._id} className="bg-white border-b border-gray-200">
                                                <td className="px-6 py-4">{order.orderID}</td>
                                                <td className="px-6 py-4 text-gray-900 font-bold capitalize">{order.products.length}</td>
                                                <td className="px-6 py-4 uppercase">
                                                    {order.paymentMethod || "_"}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {order.paymentStatus}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {currency} {order.finalAmount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    <div className="line-clamp-2 text-ellipsis overflow-hidden">
                                                        {order.shippingDetails.address + ", " + order.shippingDetails.province + ", " + order.shippingDetails.city + "."}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    <div className={`w-fit px-2 py-0.5 ${order.status === "pending" ? "bg-yellow-100 text-yellow-500" :
                                                        order.status === "processing" ? "bg-amber-100 text-amber-500" : order.status === "shipped" ? "bg-amber-100 text-amber-500" :
                                                            order.status === "delivered" ? "bg-green-100 text-green-500" : order.status === "returned" ? "bg-red-100 text-red-500" : order.status === "cancelled" ? "bg-red-100 text-red-500" : ""}`}
                                                    >
                                                        {order.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-end gap-2 items-center'>
                                                        <button className='bg-[var(--secondary)]/20 text-[var(--secondary)] text-[10px] px-2.5 font-bold py-1 rounded-2xl whitespace-nowrap hover:bg-[var(--secondary)]/30'
                                                            onClick={() => navigate(`/seller/orders/manage-orders/update/${order.orderID}`)}
                                                        >
                                                            See Details
                                                        </button>
                                                        <RxTrash className='text-[16px] text-red-500 cursor-pointer hover:text-red-300' onClick={() => handleDeleteOrder(order._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr className='bg-white'>
                                            <td colSpan={7} className='px-6 py-4 text-center text-red-500'>No order found!</td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex gap-2 mt-5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => { setPage(p); navigate(`?page=${p}`) }}
                                className={`px-3 py-1 text-sm 
                                ${page === p ? "bg-[var(--secondary)] text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}