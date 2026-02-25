import React, { useState } from 'react'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import { useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import Loader from '../../../../components/Loader';
import ButtonLoader from '../../../../components/ButtonLoader';

const initialState = { shippingGap: null, deliveryGap: null }

export default function DeliveryDateEstimate() {
    const { user } = useSellerAuthContext()
    const [settings, setSettings] = useState(initialState)
    const [shippingDate, setShippingDate] = useState(null)
    const [deliveredDate, setDeliveredDate] = useState(null)
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const handleChange = e => setSettings(s => ({ ...s, [e.target.name]: e.target.value }))

    const placeOrderDate = dayjs().format("DD MMM");

    useEffect(() => {
        if (!user?._id) return
        fetchSettings()
    }, [user?._id])

    useEffect(() => {
        setShippingDate(dayjs().add(settings?.shippingGap, "day").format("DD MMM"))
        setDeliveredDate(dayjs().add(settings?.deliveryGap, "day").format("DD MMM"))
    }, [settings])

    const fetchSettings = () => {
        setSettingsLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/delivery-date-estimate/fetch-settings?sellerID=${user._id}`)
            .then(res => {
                setSettings(res.data.settings || {})
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
            })
            .finally(() => setSettingsLoading(false))
    }

    const handleSaveChanges = () => {
        setSaving(true)
        axios.put(`${import.meta.env.VITE_HOST}/seller/delivery-date-estimate/save-changes?sellerID=${user._id}`,
            { shippingGap: settings.shippingGap, deliveryGap: settings.deliveryGap })
            .then(res => {
                window.toastify(res.data.message, "success")
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong. Please try again!", "error")
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
            })
            .finally(() => setSaving(false))
    }

    if (settingsLoading) return <Loader />

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Delivery Date Estimate</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Update your delivery date estimation in days according to your delivery time</p>
            </div>

            <div className='seller-container'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-5 mb-6'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Dashboard / Delivery Date Estimate</p>
                </div>

                <div className='w-full max-w-3xl bg-white p-4 sm:p-6 mb-6 light-shad'>
                    <h2>Delivery Date Setting</h2>
                    <p className='w-fit px-2 py-0.5 bg-yellow-100 text-yellow-600 border border-yellow-200 text-xs mt-2'>Give shipping and delivery date gap according to order placed day</p>

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

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8'>
                        <div className='flex justify-between items-center gap-2'>
                            <div>
                                <label className='text-sm text-gray-900 font-bold'>Shipping Gap</label>
                                <p className='text-xs'>(In Days)</p>
                            </div>
                            <input type="number" min={0} name="shippingGap" id="shippingGap" value={settings?.shippingGap || ""} className='w-14 text-sm !p-2.5 !border !border-gray-300 !rounded-none' onChange={handleChange} />
                        </div>

                        <div className='flex justify-between items-center gap-2'>
                            <div>
                                <label className='text-sm text-gray-900 font-bold'>Delivery Gap</label>
                                <p className='text-xs'>(In Days)</p>
                            </div>
                            <input type="number" min={0} name="deliveryGap" id="deliveryGap" value={settings?.deliveryGap || ""} className='w-14 text-sm !p-2.5 !border !border-gray-300 !rounded-none' onChange={handleChange} />
                        </div>
                    </div>

                    <div className='flex justify-end mt-6'>
                        <button className='px-4 py-2.5 text-xs bg-[var(--primary)] text-white rounded-lg transition-all duration-200 ease-linear hover:opacity-80 disabled:opacity-80'
                            disabled={saving}
                            onClick={handleSaveChanges}
                        >
                            {saving ? <ButtonLoader /> : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}