import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ButtonLoader from '../../../../../components/ButtonLoader'
import axios from 'axios'

const initialState = {
    productPageVisibility: {
        showCountDown: true, showPeopleViewing: true, showDeliveryDateEstimate: true, showStoreServices: true
    }
}

export default function ProductPageLayout({ user, settings, setSettings }) {
    const [state, setState] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const { showCountDown, showPeopleViewing, showDeliveryDateEstimate, showStoreServices } = settings.productPageVisibility
        setState({
            productPageVisibility: {
                showCountDown, showPeopleViewing, showDeliveryDateEstimate, showStoreServices
            }
        })
    }, [settings])

    const handleSaveChanges = () => {
        setLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/product-page-layout/update/${user._id}`, state)
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    setSettings(data.updatedData)
                    window.toastify(res.data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setLoading(false))
    }

    return (
        <>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-[#333]'>Product Page Visibility Settings</h1>
                <div className='flex justify-end gap-2'>
                    <button className='px-4 py-1.5 text-xs bg-gray-100 text-gray-800 font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-gray-200' onClick={() => navigate(-1)}>Cancel</button>
                    <button className='flex items-center gap-2 px-4 py-1.5 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                        disabled={loading}
                        onClick={handleSaveChanges}
                    >
                        {!loading ? 'Save Changes' : <>Saving <ButtonLoader /></>}
                    </button>
                </div>
            </div>

            <p className='w-fit text-sm bg-blue-50 text-blue-500 border border-blue-200 px-2 py-1 rounded-md mb-6'>Manage which section you want to display on your product page</p>

            <div className='flex flex-col gap-2.5 sm:gap-4'>
                <div className='p-4 border border-gray-200'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-900 font-bold'>Display Sale Countdown</p>
                        <div className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.productPageVisibility.showCountDown ? "bg-blue-500" : "bg-gray-200"}`}
                            onClick={() => setState(prev => ({
                                ...prev, productPageVisibility: {
                                    ...prev.productPageVisibility, showCountDown: !prev.productPageVisibility.showCountDown
                                }
                            }))}
                        >
                            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.productPageVisibility.showCountDown ? "left-[calc(100%-20px)]" : "left-1"}`}></div>
                        </div>
                    </div>
                </div>

                <div className='p-4 border border-gray-200'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-900 font-bold'>Display Customer Viewing</p>
                        <div className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.productPageVisibility.showPeopleViewing ? "bg-blue-500" : "bg-gray-200"}`}
                            onClick={() => setState(prev => ({
                                ...prev, productPageVisibility: {
                                    ...prev.productPageVisibility, showPeopleViewing: !prev.productPageVisibility.showPeopleViewing
                                }
                            }))}
                        >
                            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.productPageVisibility.showPeopleViewing ? "left-[calc(100%-20px)]" : "left-1"}`}></div>
                        </div>
                    </div>
                </div>

                <div className='p-4 border border-gray-200'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-900 font-bold'>Display Delivery Date Estimate</p>
                        <div className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.productPageVisibility.showDeliveryDateEstimate ? "bg-blue-500" : "bg-gray-200"}`}
                            onClick={() => setState(prev => ({
                                ...prev, productPageVisibility: {
                                    ...prev.productPageVisibility, showDeliveryDateEstimate: !prev.productPageVisibility.showDeliveryDateEstimate
                                }
                            }))}
                        >
                            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.productPageVisibility.showDeliveryDateEstimate ? "left-[calc(100%-20px)]" : "left-1"}`}></div>
                        </div>
                    </div>
                </div>

                <div className='p-4 border border-gray-200'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-900 font-bold'>Display Store Services</p>
                        <div className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.productPageVisibility.showStoreServices ? "bg-blue-500" : "bg-gray-200"}`}
                            onClick={() => setState(prev => ({
                                ...prev, productPageVisibility: {
                                    ...prev.productPageVisibility, showStoreServices: !prev.productPageVisibility.showStoreServices
                                }
                            }))}
                        >
                            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.productPageVisibility.showStoreServices ? "left-[calc(100%-20px)]" : "left-1"}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}