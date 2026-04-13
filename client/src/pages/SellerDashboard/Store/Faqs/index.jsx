import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ButtonLoader from '../../../../components/ButtonLoader'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import { RxTrash } from 'react-icons/rx'

export default function Faqs() {
    const { user } = useSellerAuthContext()
    const [faqs, setFaqs] = useState([])
    const [faq, setFaq] = useState({ question: "", answer: "" })
    const [creating, setCreating] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user._id) {
            fetchFaqs()
        }
    }, [user])

    const fetchFaqs = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_HOST}/seller/faqs/all?sellerID=${user._id}`,)
            .then(res => {
                if (res.status === 200) {
                    setFaqs(res.data.faqs || []);
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleCreateFaq = () => {
        if (!faq.question || !faq.answer) return window.toastify("Both fields are required!", "info")

        const data = {
            sellerID: user._id,
            ...faq
        }

        setCreating(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/faqs/create`, data)
            .then(res => {
                setFaqs(prev => ([res.data.faq, ...prev]));
                setFaq({ question: "", answer: "" })
                window.toastify(res.data.message, "success")
            })
            .catch(err => window.toastify(err.response?.data?.message || "Something went wrong", "error"))
            .finally(() => setCreating(false))
    }

    const handleDeleteFaq = (id) => {
        if (!window.confirm("Are you sure you want to delete this faq?")) return;

        setLoading(true);
        axios.delete(`${import.meta.env.VITE_HOST}/seller/faqs/delete/${id}`)
            .then(res => {
                if (res.status === 203) {
                    window.toastify(res.data.message, "success")
                    setFaqs(prev => prev.filter(faq => faq._id !== id));
                }
            })
            .catch(err => {
                console.error("Frontend DELETE error", err.message)
                window.toastify(err.response?.data?.message || "Failed to delete faq", "error")
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Faqs</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Create and manage frequently asked questions on your platform.</p>
            </div>

            <div className='seller-container'>
                <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Store / Faqs</p>

                <div className='bg-white p-4 sm:p-6 light-shad mt-8'>
                    <h2 className='text-sm mb-4'>Create FAQ</h2>

                    <div className='space-y-4'>
                        <input type="text" name="question" id="question" value={faq.question} placeholder='Type question of FAQ' className='w-full !p-2.5 text-sm border border-gray-200 !rounded-none'
                            onChange={(e) => setFaq(prev => ({ ...prev, question: e.target.value }))}
                        />
                        <textarea name="answer" id="answer" value={faq.answer} rows={4} placeholder='Type detailed answer of FAQ...' className='w-full !p-2.5 text-sm border border-gray-200 !rounded-none outline-none outline-[var(--secondary)] focus:border-[var(--secondary)] resize-none'
                            onChange={(e) => setFaq(prev => ({ ...prev, answer: e.target.value }))}
                        ></textarea>
                    </div>

                    <button className='text-sm bg-[var(--primary)] text-white px-4 py-2 mt-2 transition-all duration-200 ease-out hover:bg-[var(--primary)]/70 disabled:opacity-70'
                        disabled={creating}
                        onClick={handleCreateFaq}
                    >
                        {!creating ? 'Create' :
                            <span className='flex items-center gap-2'>Creating... <ButtonLoader /></span>
                        }
                    </button>
                </div>

                <div className="relative overflow-x-auto mt-8">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">#</th>
                                <th scope="col" className="font-bold px-6 py-4">Question</th>
                                <th scope="col" className="font-bold px-6 py-4">Answer</th>
                                <th scope="col" className="font-bold px-6 py-4 text-end">Actions</th>
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
                                    faqs.length > 0 ?
                                        faqs.map((faq, i) => (
                                            <tr key={faq._id} className="bg-white border-b border-gray-200">
                                                <td className="px-6 py-4">{i + 1}</td>
                                                <td className="px-6 py-4">
                                                    {faq.question}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {faq.answer}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-end gap-2 items-center'>
                                                        {/* <MdOutlineEdit className='text-[16px] text-blue-500 cursor-pointer hover:text-blue-300' /> */}
                                                        <RxTrash className='text-[16px] text-red-500 cursor-pointer hover:text-red-300' onClick={() => handleDeleteFaq(faq._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr className='bg-white'>
                                            <td colSpan={4} className='px-6 py-4 text-center text-red-500'>No faqs found!</td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}