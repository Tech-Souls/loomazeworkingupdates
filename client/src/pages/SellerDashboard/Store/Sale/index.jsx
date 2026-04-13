import React, { useRef, useState } from 'react'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import { useEffect } from 'react';
import Loader from '../../../../components/Loader';
import ButtonLoader from '../../../../components/ButtonLoader';
import axios from 'axios';

const initialState = { saleEndTime: null, saleBoxBgColor: "#000000", saleHeading: "Hurry Up! Sale ends in", saleBoxTextColor: "#ffffff" }

export default function Sale() {
    const { user } = useSellerAuthContext()
    const [settings, setSettings] = useState(initialState)
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const bgInputRef = useRef()

    const handleChange = e => setSettings(s => ({ ...s, [e.target.name]: e.target.value }))

    useEffect(() => {
        if (!user?._id) return
        fetchSettings()
    }, [user?._id])

    const fetchSettings = () => {
        setSettingsLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/sale/fetch-settings?sellerID=${user._id}`)
            .then(res => {
                setSettings(res.data.settings.sale || {})
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
            })
            .finally(() => setSettingsLoading(false))
    }

    const handleSaveChanges = () => {
        setSaving(true)
        axios.put(`${import.meta.env.VITE_HOST}/seller/sale/save-changes?sellerID=${user._id}`, settings)
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
                <p className='font-bold text-gray-900'>Sale</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Manage sale time on your products</p>
            </div>

            <div className='seller-container'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-5 mb-6'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Store / Sale</p>
                </div>

                <div className='w-full max-w-3xl bg-white p-4 sm:p-6 mb-6 light-shad'>
                    <h2>Manage Sale Time</h2>
                    <p className='w-fit px-2 py-0.5 bg-yellow-100 text-yellow-600 border border-yellow-200 text-xs mt-2'>Select a date for sale end time from the given date picker below</p>

                    <div className='flex flex-col gap-4 mt-4'>
                        <div>
                            <label className='text-sm font-bold'>Sale ends on</label>
                            <input type="date" name="saleEndTime" id="saleEndTime"
                                value={
                                    settings?.saleEndTime
                                        ? settings.saleEndTime.substring(0, 10)
                                        : ""
                                }
                                className='block text-sm mt-2 !px-4 !py-2.5 !border !border-gray-300 !rounded-none' onChange={handleChange} />
                        </div>

                        <div>
                            <label className='text-sm font-bold'>Sale Heading</label>
                            <input type="text" name="saleHeading" id="saleHeading" value={settings?.saleHeading} className='block text-sm w-full mt-2 !px-4 !p-2.5 !border !border-gray-300 !rounded-none' onChange={handleChange} />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <label className='text-sm font-bold'>Background Color</label>
                                <input ref={bgInputRef} type="color" name="saleBoxBgColor" id="saleBoxBgColor" value={settings?.saleBoxBgColor} className='block w-full mt-2 !px-0 !py-0 !rounded-none' onChange={handleChange} />
                            </div>
                            <div>
                                <label className='text-sm font-bold'>Text Color</label>
                                <input type="color" name="saleBoxTextColor" id="saleBoxTextColor" value={settings?.saleBoxTextColor} className='block w-full mt-2 !px-0 !py-0 !rounded-none' onChange={handleChange} />
                            </div>
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