import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../contexts/AuthContext';
import { LuPartyPopper } from "react-icons/lu";
import axios from 'axios';
import Loader from '../../../components/Loader';

export default function Dashboard() {
    const { user } = useAuthContext()
    const [totals, setTotals] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (user._id) fetchTotals()
    }, [user._id])

    const fetchTotals = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/user/dashboard/totals?userID=${user._id}`)
            .then(res => {
                setTotals(res.data.totals)
            })
            .catch(err => console.error("Frontend GET error:", err))
            .finally(() => setLoading(false))
    }

    if (loading) return <Loader />

    return (
        <div className="space-y-8 p-6">
            <div className='flex justify-between items-center'>
                <h2 className="text-xl font-semibold head">Dashboard</h2>
                <p className='flex items-center gap-2 text-sm bg-(--userPr)/20 border border-(--userPr)/40 px-3 py-1.5 rounded-lg'>
                    <LuPartyPopper /> Welcome Back! <span className='font-bold'>{user.username}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Total Orders */}
                <div className="bg-white border border-neutral-200 shad rounded-xl p-4 sm:p-6 cursor-pointer" onClick={() => navigate("/user/orders")}>
                    <p className="text-sm font-bold text-neutral-700 pb-3 sm:pb-4 border-b border-gray-200">Total Orders</p>
                    <div className="pt-6 sm:pt-8">
                        <div className="flex justify-between items-end">
                            <p className="text-3xl text-neutral-800">
                                {totals.totalOrders || 0}
                            </p>
                            <div className='text-blue-500'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none">
                                    <path d="M8 7H16C17.8856 7 18.8284 7 19.4142 7.58579C20 8.17157 20 9.11438 20 11V15C20 18.2998 20 19.9497 18.9749 20.9749C17.9497 22 16.2998 22 13 22H11C7.70017 22 6.05025 22 5.02513 20.9749C4 19.9497 4 18.2998 4 15V11C4 9.11438 4 8.17157 4.58579 7.58579C5.17157 7 6.11438 7 8 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 9.5C16 5.63401 14.2091 2 12 2C9.79086 2 8 5.63401 8 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favourites */}
                <div className="bg-white border border-neutral-200 shad rounded-xl p-4 sm:p-6 cursor-pointer" onClick={() => navigate("/user/favourites")}>
                    <p className="text-sm font-bold text-neutral-700 pb-3 sm:pb-4 border-b border-gray-200">Favourites</p>
                    <div className="pt-6 sm:pt-8">
                        <div className="flex justify-between items-end">
                            <p className="text-3xl text-neutral-800">
                                {user.favourites.length}
                            </p>
                            <div className='text-red-500'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none">
                                    <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white border border-neutral-200 shad rounded-xl p-4 sm:p-6 cursor-pointer" onClick={() => navigate("/user/orders?tab=pending")}>
                    <p className="text-sm font-bold text-neutral-700 pb-3 sm:pb-4 border-b border-gray-200">Pending Orders</p>
                    <div className="pt-6 sm:pt-8">
                        <div className="flex justify-between items-end">
                            <p className="text-3xl text-neutral-800">
                                {totals.pendingOrders || 0}
                            </p>
                            <div className='text-amber-500'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="bg-white shad rounded-xl p-4 sm:p-6">
                <h3 className="head text-sm sm:text-base font-semibold mb-2">Recent Activity</h3>
                <p className="text-sm text-gray-500">
                    Your recent orders and activities will appear here.
                </p>
            </div> */}
        </div>
    );
}