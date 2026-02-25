import React, { useEffect, useState } from 'react'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import { Plus, Trash2 } from 'lucide-react'
import { BiX } from 'react-icons/bi'
import Loader from '../../../../components/Loader'
import ButtonLoader from '../../../../components/ButtonLoader'
import axios from 'axios'

const initialState = { amount: null, freeDeliveryAbove: null, byWeight: null }
const initialPaymentModesState = { cod: true, online: [] }
const initialNewPaymentMethodState = { bankName: "", accountName: "", accountNumber: "" }

export default function DeliveryChargesAndPaymentMethods() {
    const { user } = useSellerAuthContext()
    const [settings, setSettings] = useState()
    const [state, setState] = useState(initialState)
    const [type, setType] = useState("free")
    const [newPaymentMethod, setNewPaymentMethod] = useState(initialNewPaymentMethodState)
    const [paymentModes, setPaymentModes] = useState(initialPaymentModesState)
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [creating, setCreating] = useState(false)
    const [savingPaymentModes, setSavingPaymentModes] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
    const handleNewPaymentMethodsOnChange = e => setNewPaymentMethod(s => ({ ...s, [e.target.name]: e.target.value }))

    useEffect(() => {
        if (!user._id) return

        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/seller-settings/get?brandSlug=${user.brandSlug}`)
            .then(res => {
                setSettings(res.data.settings)
            })
            .catch(err => window.toastify(err.response?.data?.message || "Failed to fetch settings", "error"))
            .finally(() => setLoading(false))
    }, [user])

    useEffect(() => {
        if (!settings?._id) return

        const { amount, freeDeliveryAbove, byWeight } = settings.deliveryCharges || {}

        setState({
            amount: amount || null,
            freeDeliveryAbove: freeDeliveryAbove || null,
            byWeight: byWeight || null,
        })

        if (byWeight) setType("byWeight")
        else if (amount) setType("fixed")
        else setType("free")

        const { cod, online } = settings.paymentModes

        setPaymentModes({ cod, online })
    }, [settings])

    const handleTypeChange = (field) => {
        setType(field)

        setState(prev => {
            if (field === "free") return { amount: null, freeDeliveryAbove: null, byWeight: null }
            if (field === "fixed") return { amount: prev.amount, freeDeliveryAbove: prev.freeDeliveryAbove, byWeight: null }
            if (field === "byWeight") return { amount: null, freeDeliveryAbove: prev.freeDeliveryAbove, byWeight: prev.byWeight }
            return prev
        })
    }

    const handleSaveShippingCharges = () => {
        if (type === "fixed" && !state.amount) return window.toastify("Enter an amount for delivery charges", "info")
        if (type === "byWeight" && !state.byWeight) return window.toastify("Enter weight percentage for delivery charges", "info")

        setSaving(true)
        axios.put(`${import.meta.env.VITE_HOST}/seller/charges-and-methods/delivery-charges/update/${user._id}`, state)
            .then(res => {
                window.toastify(res.data.message, "success")
            })
            .catch(err => window.toastify(err.response?.data?.message || "Failed to save changes", "error"))
            .finally(() => setSaving(false))
    }

    const handleAddPaymentMethod = () => {
        if (!newPaymentMethod.bankName || !newPaymentMethod.accountName || !newPaymentMethod.accountNumber) {
            return window.toastify("Please fill all fields!", "warning")
        }

        setCreating(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/charges-and-methods/payment-modes/create/${user._id}`, newPaymentMethod)
            .then(res => {
                setSettings(res.data.sellerSettings)
                setNewPaymentMethod(initialNewPaymentMethodState)
                setShowCreateModal(false)
                window.toastify(res.data.message, "success")
            })
            .catch(err => {
                console.error(err);
                window.toastify(err.response?.data?.message || "Failed to add payment method", "error")
            })
            .finally(() => setCreating(false))
    }

    const handlePaymentModeToggle = (id) => {
        const updatedOnlineModes = paymentModes.online.map(mode => {
            if (mode._id === id) {
                return { ...mode, isActive: !mode.isActive };
            }
            return mode;
        });

        setPaymentModes(prev => ({ ...prev, online: updatedOnlineModes }));
    }

    const handleSavePaymentModes = () => {
        if (!paymentModes.cod && paymentModes.online.length === 0) {
            return window.toastify("Please enable at least one payment mode!", "error")
        }

        setSavingPaymentModes(true)
        axios.put(`${import.meta.env.VITE_HOST}/seller/charges-and-methods/payment-modes/update/${user._id}`, paymentModes)
            .then(res => {
                window.toastify(res.data.message, "success")
            })
            .catch(err => window.toastify(err.response?.data?.message || "Failed to save changes", "error"))
            .finally(() => setSavingPaymentModes(false))
    }

    const handleDeletePaymentMode = async (id) => {
        try {
            setLoading(true)
            await axios.delete(`${import.meta.env.VITE_HOST}/seller/charges-and-methods/payment-modes/delete/${user._id}/${id}`);

            setPaymentModes(prev => ({
                ...prev,
                online: prev.online.filter(mode => mode._id !== id)
            }));

            window.toastify("Payment method deleted successfully", "success");
        } catch (err) {
            console.error(err);
            window.toastify(err.response?.data?.message || "Failed to delete payment method", "error");
        } finally {
            setLoading(false)
        }
    };

    if (loading) return <Loader />

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Delivery Charges</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Manage delivery charges of your orders.</p>
            </div>

            <div className='seller-container'>
                <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Payments / Delivery Charges</p>

                {/* Shipping Charges */}
                <div className='flex flex-col gap-4 w-full max-w-3xl bg-white p-6 my-6 light-shad'>
                    <h1 className='text-sm text-[var(--primary)]'>Shipping Charges</h1>

                    <div className='flex gap-3'>
                        <button className={`text-xs px-3 py-1 rounded-sm
                            ${type === "free" ? "bg-blue-100 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}
                            onClick={() => handleTypeChange("free")}
                        >
                            FREE
                        </button>
                        <button className={`text-xs px-3 py-1 rounded-sm
                            ${type === "fixed" ? "bg-blue-100 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}
                            onClick={() => handleTypeChange("fixed")}
                        >
                            Fixed Price
                        </button>
                        <button className={`text-xs px-3 py-1 rounded-sm
                            ${type === "byWeight" ? "bg-blue-100 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}
                            onClick={() => handleTypeChange("byWeight")}
                        >
                            By Weight
                        </button>
                    </div>

                    {type === "free" &&
                        <p className='text-sm text-center bg-green-100 text-green-600 p-2 rounded-md'>The shipping is free on your website</p>
                    }

                    {type !== "free" &&
                        <>
                            {type === "fixed" &&
                                <div>
                                    <label className='text-xs font-bold text-gray-900'>Amount</label>
                                    <input type="number" name="amount" id="amount" value={state.amount || ""} placeholder='Enter your fixed delivery charges' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                                </div>
                            }

                            {type === "byWeight" &&
                                <div>
                                    <label className='text-xs font-bold text-gray-900'>Amount Per KG</label>
                                    <input type="number" name="byWeight" id="byWeight" value={state.byWeight || ""} placeholder='Enter amount per kg e.g, $1 per kg' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                                </div>
                            }

                            <div>
                                <p className='w-fit bg-yellow-50 text-yellow-600 text-xs font-bold my-2'>Enter price of order on which you will offer free delivery. Leave it blank if you don't want to offer</p>
                                <div>
                                    <label className='text-xs font-bold text-gray-900'>Free Delivery Above</label>
                                    <input type="number" name="freeDeliveryAbove" id="freeDeliveryAbove" value={state.freeDeliveryAbove || ""} placeholder='Enter amount e.g., Free delivery above order of $5000' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                                </div>
                            </div>
                        </>
                    }

                    <div className='flex justify-end mt-2'>
                        <button className='text-sm text-white bg-[var(--primary)] font-bold px-4 py-1.5 rounded-md transition-all duration-200 ease-out hover:opacity-70 disabled:opacity-50'
                            disabled={saving}
                            onClick={handleSaveShippingCharges}
                        >
                            {!saving ? 'Save' : <ButtonLoader />}
                        </button>
                    </div>
                </div>

                {/* Payment Method */}
                <div className='flex flex-col gap-4 w-full max-w-3xl bg-white p-6 my-6 light-shad'>
                    <h1 className='text-sm text-[var(--primary)]'>Payment Methods</h1>

                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-900 font-bold'>Cash On Delivery</p>
                        <div className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${paymentModes.cod ? "bg-blue-500" : "bg-gray-200"}`}
                            onClick={() => setPaymentModes(prev => ({
                                ...prev, cod: !prev.cod
                            }))}
                        >
                            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${paymentModes.cod ? "left-[calc(100%-20px)]" : "left-1"}`}></div>
                        </div>
                    </div>

                    <div>
                        <div className='flex justify-between items-center my-3'>
                            <p className='text-sm text-gray-900 font-bold'>Online Methods</p>
                            <button className='flex items-center gap-1 text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1.5 font-bold rounded-md hover:bg-[var(--primary)]/20' onClick={() => setShowCreateModal(true)}>
                                Add Method <Plus size={16} />
                            </button>
                        </div>
                        {paymentModes.online.length === 0 ?
                            <p className='text-sm text-center bg-blue-100 text-blue-600 p-2 rounded-md'>No online method added yet to receive payments</p>
                            :
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {paymentModes.online.map((mode, i) => (
                                    <div key={i} className='bg-blue-50 p-4 rounded-xl'>
                                        <div className='flex justify-between items-center border-b border-gray-300 pb-3'>
                                            <p className='head text-sm font-bold text-gray-800'>{mode.bankName}</p>
                                            <div className='flex items-center gap-2'>
                                                <div className={`relative w-7.5 h-4.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${mode.isActive ? "bg-blue-500" : "bg-gray-200"}`}
                                                    onClick={() => handlePaymentModeToggle(mode._id)}
                                                >
                                                    <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-all duration-200 ease-out ${mode.isActive ? "left-[calc(100%-14.5px)]" : "left-1"}`}></div>
                                                </div>
                                                <Trash2 size={14} className='text-red-500 cursor-pointer hover:text-red-300' onClick={() => handleDeletePaymentMode(mode._id)} />
                                            </div>
                                        </div>
                                        <div className='space-y-0.5 mt-3'>
                                            <p className='text-xs text-gray-800'><span className='text-gray-700 font-bold'>Account Name:</span> {mode.accountName}</p>
                                            <p className='text-xs text-gray-800'><span className='text-gray-700 font-bold'>Account Number:</span> {mode.accountNumber}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>

                    <div className='flex justify-end mt-2'>
                        <button className='text-sm text-white bg-[var(--primary)] font-bold px-4 py-1.5 rounded-md transition-all duration-200 ease-out hover:opacity-70 disabled:opacity-50'
                            disabled={savingPaymentModes}
                            onClick={handleSavePaymentModes}
                        >
                            {!savingPaymentModes ? 'Save' : <ButtonLoader />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <div className={`flex justify-end fixed top-0 right-0 w-full bg-black/20 h-screen transition-all duration-200 ease-linear ${showCreateModal ? 'visible opacity-100' : 'invisible opacity-0'}`}
                onClick={() => setShowCreateModal(false)}
            >
                <div className={`flex flex-col justify-between w-full max-w-[400px] h-full bg-white transition-all duration-300 ease-linear ${showCreateModal ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className='flex justify-between items-center p-6 border-b border-b-gray-200'>
                        <p className='font-bold'>Add New Payment Method</p>
                        <BiX className='text-2xl cursor-pointer' onClick={() => setShowCreateModal(false)} />
                    </div>

                    <div className='flex flex-col gap-4 flex-1 p-6 overflow-y-auto'>
                        <div>
                            <label className='font-bold text-sm'>Bank Name *</label>
                            <input type="text" name="bankName" id="bankName" value={newPaymentMethod.bankName} placeholder='Enter bank name' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleNewPaymentMethodsOnChange} />
                        </div>
                        <div>
                            <label className='font-bold text-sm'>Account Name *</label>
                            <input type="text" name="accountName" id="accountName" value={newPaymentMethod.accountName} placeholder='Enter account name' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleNewPaymentMethodsOnChange} />
                        </div>
                        <div>
                            <label className='font-bold text-sm'>Account Number *</label>
                            <input type="text" name="accountNumber" id="accountNumber" value={newPaymentMethod.accountNumber} placeholder='Enter account number' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleNewPaymentMethodsOnChange} />
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 p-6'>
                        <button className='px-4 py-1.5 bg-gray-100 text-gray-600' onClick={() => setShowCreateModal(false)}>Cancel</button>
                        <button className='px-4 py-1.5 bg-[var(--secondary)] text-white disabled:opacity-50'
                            disabled={creating}
                            onClick={handleAddPaymentMethod}
                        >
                            {!creating ? 'Create' : <ButtonLoader />}
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}