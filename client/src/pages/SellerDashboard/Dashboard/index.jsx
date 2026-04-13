import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSellerAuthContext } from '../../../contexts/SellerAuthContext';
import { IoAddCircleOutline } from "react-icons/io5";
import { BsCollection } from "react-icons/bs";
import { BiCustomize } from "react-icons/bi";
import dayjs from "dayjs";
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Dashboard() {
    const { user } = useSellerAuthContext()
    console.log("Seller Dashboard User:", user)  // Debugging line to check user data
    const [settings, setSettings] = useState({ content: { currency: '' } })
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [overviewData, setOverviewData] = useState({ orders: {}, sales: {} })
    const [overviewLoading, setOverviewLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        if (!user?._id) return
        fetchSettings()
        fetchOverviewData()
        fetchAvailableMonths()
    }, [user?._id])

    useEffect(() => {
        if (selectedMonth && user?._id) {
            fetchChartData()
        }
    }, [selectedMonth, user?._id])

    const fetchSettings = () => {
        setSettingsLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/dashboard/fetch-settings?sellerID=${user._id}`)
            .then(res => {
                setSettings(res.data.settings || { content: { currency: '' } })
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
                setSettings({ content: { currency: '' } })
            })
            .finally(() => setSettingsLoading(false))
    }

    const fetchOverviewData = () => {
        setOverviewLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/dashboard/get-overview-data?sellerID=${user._id}`)
            .then(res => {
                setOverviewData(res.data.overviewData || { orders: {}, sales: {} })
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
                setOverviewData({ orders: {}, sales: {} })
            })
            .finally(() => setOverviewLoading(false))
    }

    const fetchAvailableMonths = () => {
        axios.get(`${import.meta.env.VITE_HOST}/seller/dashboard/get-available-months?sellerID=${user._id}`)
            .then(res => {
                const months = res.data.availableMonths || []
                setAvailableMonths(months)
                if (months.length > 0) {
                    setSelectedMonth(months[0].value)
                }
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Failed to load available months")
                setAvailableMonths([])
            })
    }

    const fetchChartData = () => {
        setChartLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/dashboard/get-orders-chart-data?sellerID=${user._id}&month=${selectedMonth}`)
            .then(res => {
                setChartData(res.data.chartData || [])
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Failed to load chart data")
                setChartData([])
            })
            .finally(() => setChartLoading(false))
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const fullDate = payload[0]?.payload?.fullDate || `Day ${label}`;
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
                    <p className="font-semibold text-sm">{fullDate}</p>
                    <p className="text-sm text-blue-600">
                        Orders: <span className="font-bold">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Dashboard</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>This is the dashboard for you, allowing to monitor, manage, and control all key aspects of your store.</p>
            </div>

            <div className='seller-container'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Dashboard</p>

                    <div className='flex flex-wrap gap-3'>
                        <button className='flex items-center gap-2 text-xs bg-white px-4 py-2 border border-gray-200'
                            onClick={() => navigate("/seller/inventory/add-product")}
                        >
                            <IoAddCircleOutline className='text-base' /> Add New Product
                        </button>
                        <button className='flex items-center gap-2 text-xs bg-white px-4 py-2 border border-gray-200'
                            onClick={() => navigate("/seller/inventory/manage-products")}
                        >
                            <BsCollection className='text-sm' /> My Products
                        </button>
                        <button className='flex items-center gap-2 text-xs bg-white px-4 py-2 border border-gray-200'
                            onClick={() => navigate("/seller/store/settings/theme")}
                        >
                            <BiCustomize className='text-sm' /> Customize Store
                        </button>
                    </div>
                </div>

                <div className='mt-8'>
                    <h2>Store Overview</h2>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5'>
                        <div className='bg-white p-6 border border-gray-200 light-shad'>
                            <p className='text-base font-semibold'>Orders</p>
                            <div className='flex justify-between mt-4'>
                                <div>
                                    <p className='text-xs text-gray-700'>Completed Orders</p>
                                    {!overviewLoading ?
                                        <p className='text-lg font-semibold'>{overviewData?.orders?.completedOrders || 0}</p>
                                        :
                                        <div className='w-16 h-6 bg-gray-200 animate-pulse mt-1 rounded'></div>
                                    }
                                </div>
                                <div>
                                    <p className='text-xs text-gray-700'>Pending Orders</p>
                                    {!overviewLoading ?
                                        <p className='text-lg font-semibold'>{overviewData?.orders?.pendingOrders || 0}</p>
                                        :
                                        <div className='w-16 h-6 bg-gray-200 animate-pulse mt-1 rounded'></div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-6 border border-gray-200 light-shad'>
                            <p className='text-base font-semibold'>Sales</p>
                            <div className='flex justify-between mt-4'>
                                <div>
                                    <p className='text-xs text-gray-700'>Completed Sales</p>
                                    {!overviewLoading && !settingsLoading ?
                                        <p className='text-lg font-semibold'>{settings?.content?.currency} {overviewData?.sales?.completedSales?.toLocaleString() || 0}</p>
                                        :
                                        <div className='w-20 h-6 bg-gray-200 animate-pulse mt-1 rounded'></div>
                                    }
                                </div>
                                <div>
                                    <p className='text-xs text-gray-700'>Pending Sales</p>
                                    {!overviewLoading && !settingsLoading ?
                                        <p className='text-lg font-semibold'>{settings?.content?.currency} {overviewData?.sales?.pendingSales?.toLocaleString() || 0}</p>
                                        :
                                        <div className='w-20 h-6 bg-gray-200 animate-pulse mt-1 rounded'></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 mt-8 light-shad">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-900">Orders Analytics</h2>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <label htmlFor="month-select" className="text-sm font-medium text-gray-700">
                                Select Month:
                            </label>
                            <select
                                id="month-select"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={availableMonths.length === 0}
                            >
                                {availableMonths.map(month => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {chartLoading ? (
                        <div className="h-80 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                                <p className="mt-3 text-gray-600">Loading chart data...</p>
                            </div>
                        </div>
                    ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 15 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="fullDate"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    labelFormatter={(value) => `Day ${value}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#1d4ed8' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-80 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <p className="text-lg">No order data available for the selected period</p>
                                <p className="text-sm mt-2">Start selling to see your orders analytics</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}