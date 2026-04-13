import React, { useEffect, useState } from 'react'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import { FiPlusCircle } from 'react-icons/fi'
import { BiCheck, BiX } from 'react-icons/bi'
import { RxTrash } from 'react-icons/rx'
import axios from 'axios'

const initialState = { code: "", type: "fixed", value: 0, minOrderValue: 0 }

export default function Coupons() {
    const { user } = useSellerAuthContext()
    const [coupons, setCoupons] = useState([])
    const [state, setState] = useState(initialState)
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    useEffect(() => {
        if (user._id) {
            fetchCoupons()
        }
    }, [user])

    const fetchCoupons = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_HOST}/seller/coupons/all?sellerID=${user._id}`,)
            .then(res => {
                if (res.status === 200) {
                    setCoupons(res.data.coupons || []);
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleCreateCoupon = () => {
        const { code, type, value } = state

        if (!code || !type || !value) return window.toastify("Please fill all required fields!", "warning")

        setLoading(true);
        axios.post(`${import.meta.env.VITE_HOST}/seller/coupons/create`, { ...state, sellerID: user._id })
            .then(res => {
                if (res.status === 201) {
                    window.toastify(res.data.message, "success")
                    setCoupons(prev => [res.data.coupon, ...prev]);
                    setShowCreateModal(false);
                    setState(initialState)
                }
            })
            .catch(err => {
                console.error("Frontend POST error", err.message)
                window.toastify(err.response?.data?.message || "Something went wrong! Please try again", "error")
            })
            .finally(() => setLoading(false));
    };

    const handleCouponStatusToggle = (id) => {
        setLoading(true);
        axios.put(`${import.meta.env.VITE_HOST}/seller/coupons/toggle-status/${id}`)
            .then(res => {
                if (res.status === 202) {
                    window.toastify(res.data.message, "success")
                    setTimeout(() => {
                        setCoupons(prev => prev.map(coupon => (coupon._id === res.data.coupon._id ? res.data.coupon : coupon)));
                    }, 100);
                }
            })
            .catch(err => {
                console.error("Frontend TOGGLE error", err.message);
                window.toastify(err.response?.data?.message || "Failed to update toggle", "error");
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteCoupon = (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;

        setLoading(true);
        axios.delete(`${import.meta.env.VITE_HOST}/seller/coupons/delete/${id}`)
            .then(res => {
                if (res.status === 203) {
                    window.toastify(res.data.message, "success")
                    setCoupons(prev => prev.filter(coupon => coupon._id !== id));
                }
            })
            .catch(err => {
                console.error("Frontend DELETE error", err.message)
                window.toastify(err.response?.data?.message || "Failed to delete coupon", "error")
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Coupons</p>
                
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Create coupon codes to apply extra discounts on your store.</p>
            </div>

            <div className='seller-container'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Store / Coupons</p>
                    <button className='flex items-center gap-2 text-xs bg-[var(--primary)]/5 text-[var(--primary)] px-6 py-2 transition-all duration-150 ease-linear hover:bg-[var(--primary)]/10' onClick={() => setShowCreateModal(true)}>Create new coupon <FiPlusCircle /></button>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">#</th>
                                <th scope="col" className="font-bold px-6 py-4">Code</th>
                                <th scope="col" className="font-bold px-6 py-4">Type</th>
                                <th scope="col" className="font-bold px-6 py-4">Amount</th>
                                <th scope="col" className="font-bold px-6 py-4">Min Order Amount</th>
                                <th scope="col" className="font-bold px-6 py-4">Status</th>
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
                                    coupons.length > 0 ?
                                        coupons.map((coupon, i) => (
                                            <tr key={coupon._id} className="bg-white border-b border-gray-200">
                                                <td className="px-6 py-4">{i + 1}</td>
                                                <td scope="row" className="px-6 py-4 text-gray-900 font-bold capitalize">
                                                    <div className='w-fit flex items-center gap-4'>
                                                        <span className='whitespace-nowrap'>{coupon.code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {coupon.type}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {coupon.value}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {coupon.minOrderValue}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    <span className={`relative inline-block w-10 h-5 border cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-linear ${coupon.status === 'active' ? 'bg-[#ddffe0] border-green-100' : 'bg-gray-200 border-gray-200'}`}
                                                        onClick={() => handleCouponStatusToggle(coupon._id)}
                                                    >
                                                        <span className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 flex justify-center items-center rounded-full transition-all duration-300 ease-linear ${coupon.status === 'active' ? 'bg-[#53f163] left-[calc(100%-18px)]' : 'bg-white left-[2px]'}`}><BiCheck className='text-white' /></span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-end gap-2 items-center'>
                                                        {/* <MdOutlineEdit className='text-[16px] text-blue-500 cursor-pointer hover:text-blue-300' /> */}
                                                        <RxTrash className='text-[16px] text-red-500 cursor-pointer hover:text-red-300' onClick={() => handleDeleteCoupon(coupon._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr className='bg-white'>
                                            <td colSpan={5} className='px-6 py-4 text-center text-red-500'>No coupons found!</td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>

                {/* Create Modal */}
                <div className={`flex justify-end fixed top-0 right-0 w-full bg-black/20 h-screen transition-all duration-200 ease-linear ${showCreateModal ? 'visible opacity-100' : 'invisible opacity-0'}`}
                    onClick={() => setShowCreateModal(false)}
                >
                    <div className={`flex flex-col justify-between w-full max-w-[400px] h-full bg-white transition-all duration-300 ease-linear ${showCreateModal ? 'translate-x-0' : 'translate-x-full'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className='flex justify-between items-center p-6 border-b border-b-gray-200'>
                            <p className='font-bold'>Create New Coupon</p>
                            <BiX className='text-2xl cursor-pointer' onClick={() => setShowCreateModal(false)} />
                        </div>

                        <div className='flex flex-col gap-4 flex-1 p-6 overflow-y-auto'>
                            <div>
                                <label className='font-bold text-sm'>Code *</label>
                                <input type="text" name="code" id="code" value={state.code} placeholder='Enter coupon code' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleChange} />
                            </div>
                            <div>
                                <label className='font-bold text-sm'>Type *</label>
                                <div className='flex gap-2 mt-3'>
                                    <button className={`text-xs px-3 py-1.5 border ${state.type === 'fixed' ? "text-[var(--secondary)] bg-[var(--secondary)]/10 border-[var(--secondary)]" : "bg-gray-100 border-gray-200"}`}
                                        onClick={() => setState(prev => ({ ...prev, type: "fixed" }))}
                                    >
                                        Fixed
                                    </button>
                                    <button className={`text-xs px-3 py-1.5 border ${state.type === 'percentage' ? "text-[var(--secondary)] bg-[var(--secondary)]/10 border-[var(--secondary)]" : "bg-gray-100 border-gray-200"}`}
                                        onClick={() => setState(prev => ({ ...prev, type: "percentage" }))}
                                    >
                                        Percentage
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className='font-bold text-sm'>Amount *</label>
                                <input type="number" name="value" id="value" value={state.value} placeholder='Enter amount of discount' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleChange} />
                            </div>
                            <div>
                                <label className='font-bold text-sm'>Min. Order Value <span className='text-xs'>(Optional)</span></label>
                                <p className='text-[11px] bg-yellow-100 text-yellow-600 w-fit mt-1'>Minimum value of order on which it will be applicable</p>
                                <input type="number" name="minOrderValue" id="minOrderValue" value={state.minOrderValue} placeholder='Enter amount of discount' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleChange} />
                            </div>
                        </div>

                        <div className='flex justify-end gap-3 p-6'>
                            <button className='px-4 py-1.5 bg-gray-100 text-gray-600' onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className='px-4 py-1.5 bg-[var(--secondary)] text-white' onClick={handleCreateCoupon}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}