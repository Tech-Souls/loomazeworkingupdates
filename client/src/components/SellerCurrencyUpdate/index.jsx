import React, { useState } from 'react'
import ButtonLoader from '../ButtonLoader'
import axios from 'axios'

export default function SellerCurrencyUpdate({ user, settings, setSettings }) {
    const [currency, setCurrency] = useState(settings.content.currency)
    const [loading, setLoading] = useState(false)

    const handleUpdateCurrency = () => {
        if (!currency.trim()) return window.toastify("Please enter a curreny text", "info")

        setLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/content/currency/update/${user._id}`, { currency })
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    setSettings(prev => ({
                        ...prev,
                        content: { ...prev.content, currency }
                    }))
                    window.toastify(data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className='w-fit p-4 border border-gray-200 mt-6'>
            <div className='flex justify-between items-center mb-4'>
                <p className='text-sm text-gray-900 font-bold'>Currency</p>
                <button className='text-xs bg-[var(--primary)] text-white px-2.5 py-1 rounded-md transition-all duration-200 ease-out hover:opacity-70'
                    disabled={loading}
                    onClick={handleUpdateCurrency}
                >
                    {!loading ? 'Save' : <ButtonLoader />}
                </button>
            </div>

            <select name="currency" id="currency" value={currency} className='text-sm p-2.5 bg-white border border-gray-300 outline-none'
                onChange={e => setCurrency(e.target.value)}
            >
                <option value="" disabled>Select a currency for payments</option>
                <option value="$">USD ($)</option>
                <option value="Rs">PKR (Rs)</option>
                <option value="€">EURO (€)</option>
                <option value="£">Pound (£)</option>
                <option value="SAR">Riyal (SAR)</option>
            </select>
        </div>
    )
}